from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from datetime import datetime
import os
import uuid
import re
import logging
import pandas as pd
from io import BytesIO

app = Flask(__name__)

# Configure CORS
official_origins = [
    "https://beninmathscamp.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
]
CORS(app,
     origins=official_origins,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Accept", "Cache-Control"],
     max_age=86400)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Atlas configuration
env_uri = os.environ.get('MONGODB_URI')
if not env_uri:
    logger.error('MONGODB_URI environment variable is not set')
    raise RuntimeError('MONGODB_URI is required')
client = MongoClient(env_uri)
db = client.get_default_database()
students_col = db.students
messages_col = db.messages
# Unique index on student email to prevent duplicates
students_col.create_index('email', ASCENDING, unique=True)

# Validation and sanitization helpers

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$'
    return bool(email and isinstance(email, str) and re.match(pattern, email.strip()))


def validate_phone(phone: str) -> bool:
    if not phone:
        return True
    phone = phone.strip()
    patterns = [
        r'^\+229\s?[0-9]{8}$',
        r'^[0-9]{8}$',
        r'^\+?[0-9]{8,15}$'
    ]
    return any(re.match(p, phone) for p in patterns)


def sanitize_string(text: str, max_length: int = 1000) -> str:
    if not isinstance(text, str):
        return ''
    sanitized = re.sub(r'[<>"\'\x00-\x1f\x7f-\x9f]', '', text)
    return sanitized.strip()[:max_length] 

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'API is running',
        'timestamp': datetime.utcnow().isoformat(),
        'students_count': students_col.count_documents({}),
        'messages_count': messages_col.count_documents({})
    })

@app.route('/api/register', methods=['POST'])
def register_student():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    data = request.get_json()
    required = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
    missing = [f for f in required if not data.get(f) or (isinstance(data.get(f), str) and not data[f].strip())]
    if missing:
        return jsonify({'error': f'Champs manquants: {", ".join(missing)}'}), 400
    # Sanitize and validate inputs
    try:
        prenom = sanitize_string(data['prenom'], 100)
        nom = sanitize_string(data['nom'], 100)
        email = data['email'].strip().lower()
        telephone = sanitize_string(data['telephone'], 20)
        age = int(data['age'])
        if age < 14 or age > 18:
            return jsonify({'error': "L'âge doit être entre 14 et 18 ans"}), 400
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        if not validate_phone(telephone):
            return jsonify({'error': 'Format de téléphone invalide'}), 400
        niveau = data['niveau'].strip()
        if niveau not in ['quatrieme','troisieme','seconde','premiere','terminale']:
            return jsonify({'error': 'Niveau scolaire invalide'}), 400
        motivation = sanitize_string(data['motivation'], 2000)
        if len(motivation) < 50:
            return jsonify({'error': 'La motivation doit contenir au moins 50 caractères'}), 400
    except Exception as e:
        logger.error(f'Validation error: {e}')
        return jsonify({'error': 'Données invalides'}), 400
    # Prepare document
    student_doc = {
        'prenom': prenom,
        'nom': nom,
        'email': email,
        'telephone': telephone,
        'age': age,
        'niveau': niveau,
        'ecole': sanitize_string(data['ecole'], 200),
        'ville': sanitize_string(data['ville'], 100),
        'departement': sanitize_string(data['departement'], 100),
        'commune': sanitize_string(data['commune'], 100),
        'motivation': motivation,
        'registeredAt': datetime.utcnow(),
        'status': 'pending'
    }
    # Insert into MongoDB
    try:
        result = students_col.insert_one(student_doc)
        return jsonify({'message': 'Inscription enregistrée avec succès', 'studentId': str(result.inserted_id)}), 201
    except DuplicateKeyError:
        return jsonify({'error': 'Cette adresse email est déjà utilisée'}), 400
    except Exception as e:
        logger.error(f'Insert error: {e}')
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/contact', methods=['POST'])
def contact_message():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    data = request.get_json()
    required = ['name','email','message','interest']
    missing = [f for f in required if not data.get(f) or (isinstance(data.get(f), str) and not data[f].strip())]
    if missing:
        return jsonify({'error': f'Champs manquants: {", ".join(missing)}'}), 400
    try:
        name = sanitize_string(data['name'],100)
        email = data['email'].strip().lower()
        phone = sanitize_string(data.get('phone',''),20)
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        if phone and not validate_phone(phone):
            return jsonify({'error': 'Format de téléphone invalide'}), 400
        interest = data['interest'].strip()
        if interest not in ['participant','parent','intervenant','partenaire']:
            return jsonify({'error': 'Type d\'intérêt invalide'}), 400
        message = sanitize_string(data['message'],2000)
        if len(message) < 10:
            return jsonify({'error': 'Le message doit contenir au moins 10 caractères'}), 400
    except Exception as e:
        logger.error(f'Contact validation error: {e}')
        return jsonify({'error': 'Données invalides'}), 400
    contact_doc = {
        '_id': str(uuid.uuid4()),
        'name': name,
        'email': email,
        'phone': phone,
        'interest': interest,
        'message': message,
        'createdAt': datetime.utcnow(),
        'status': 'new'
    }
    try:
        messages_col.insert_one(contact_doc)
        return jsonify({'message': 'Message envoyé avec succès', 'messageId': contact_doc['_id']}), 201
    except Exception as e:
        logger.error(f'Contact insert error: {e}')
        return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    cursor = students_col.find().sort('registeredAt', DESCENDING)
    out = []
    for s in cursor:
        s['id'] = str(s.pop('_id'))
        s['registeredAt'] = s['registeredAt'].isoformat()
        out.append(s)
    return jsonify(out)

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['pending','confirmed','rejected']:
        return jsonify({'error': 'Statut invalide'}), 400
    try:
        oid = ObjectId(student_id)
    except Exception:
        return jsonify({'error': 'ID invalide'}), 400
    result = students_col.update_one(
        {'_id': oid},
        {'$set': {'status': new_status, 'statusUpdatedAt': datetime.utcnow()}}
    )
    if result.matched_count == 0:
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    return jsonify({'message': 'Statut mis à jour avec succès'})

@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        oid = ObjectId(student_id)
    except Exception:
        return jsonify({'error': 'ID invalide'}), 400
    result = students_col.delete_one({'_id': oid})
    if result.deleted_count == 0:
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    return jsonify({'message': 'Étudiant supprimé avec succès'})

@app.route('/api/messages', methods=['GET'])
def get_messages():
    cursor = messages_col.find().sort('createdAt', DESCENDING)
    out = []
    for m in cursor:
        m['id'] = m.pop('_id')
        m['createdAt'] = m['createdAt'].isoformat()
        out.append(m)
    return jsonify(out)

@app.route('/api/messages/<message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 400
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['new','read','replied']:
        return jsonify({'error': 'Statut invalide'}), 400
    result = messages_col.update_one(
        {'_id': message_id},
        {'$set': {'status': new_status, 'statusUpdatedAt': datetime.utcnow()}}
    )
    if result.matched_count == 0:
        return jsonify({'error': 'Message non trouvé'}), 404
    return jsonify({'message': 'Statut du message mis à jour avec succès'})

@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    result = messages_col.delete_one({'_id': message_id})
    if result.deleted_count == 0:
        return jsonify({'error': 'Message non trouvé'}), 404
    return jsonify({'message': 'Message supprimé avec succès'})

@app.route('/api/export/students', methods=['GET'])
def export_students():
    cursor = students_col.find().sort('registeredAt', DESCENDING)
    df_data = []
    for s in cursor:
        df_data.append({
            'ID': str(s['_id']),
            'Prénom': s['prenom'],
            'Nom': s['nom'],
            'Email': s['email'],
            'Téléphone': s['telephone'],
            'Âge': s['age'],
            'Niveau': s['niveau'],
            'École': s['ecole'],
            'Ville': s['ville'],
            'Département': s['departement'],
            'Commune': s['commune'],
            'Motivation': s['motivation'],
            'Date d\'inscription': s['registeredAt'].isoformat(),
            'Statut': s['status']
        })
    if not df_data:
        return jsonify({'error': 'Aucun étudiant à exporter'}), 404
    df = pd.DataFrame(df_data)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Inscriptions', index=False)
    output.seek(0)
    filename = f"inscriptions_summer_maths_camp_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=filename
    )

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Requête invalide'}), 400

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Méthode non autorisée'}), 405

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug, threaded=True)