from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import json
import os
from datetime import datetime
import uuid
import pandas as pd
from io import BytesIO
import tempfile
import re
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)

# Configure CORS with specific origins for production
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, supports_credentials=True)
else:
    CORS(app, supports_credentials=True)

# Configure logging
if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Application startup')

# Configuration
DATA_DIR = 'data'
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Security functions
def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return False
    
    # Remove spaces and special characters except +
    clean_phone = re.sub(r'[^\d+]', '', phone)
    
    # Check if it's a valid format for Benin (+229 followed by 8 digits) or international
    benin_pattern = r'^(\+229)?[0-9]{8}$'
    international_pattern = r'^\+?[0-9]{8,15}$'
    
    return bool(re.match(benin_pattern, clean_phone)) or bool(re.match(international_pattern, clean_phone))

def sanitize_input(text):
    """Basic input sanitization"""
    if not isinstance(text, str):
        return text
    # Remove potentially dangerous characters
    return re.sub(r'[<>"\']', '', text).strip()

def rate_limit_check(request):
    """Basic rate limiting check"""
    # In production, implement proper rate limiting with Redis or similar
    return True

def load_data(filename):
    """Load data from JSON file"""
    try:
        # Ensure the file exists
        if not os.path.exists(filename):
            app.logger.info(f"Creating new data file: {filename}")
            save_data(filename, [])
            return []
            
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, FileNotFoundError, Exception) as e:
        app.logger.error(f"Error loading data from {filename}: {e}")
        return []

def save_data(filename, data):
    """Save data to JSON file"""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        app.logger.info(f"Data saved successfully to {filename}")
    except Exception as e:
        app.logger.error(f"Error saving data to {filename}: {e}")
        raise

def generate_student_id():
    """Generate a unique student ID"""
    students = load_data(STUDENTS_FILE)
    existing_ids = [student.get('id', '') for student in students]
    
    counter = 1
    while True:
        student_id = f"STU{counter:04d}"
        if student_id not in existing_ids:
            return student_id
        counter += 1

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "API is running",
        "timestamp": datetime.now().isoformat(),
        "cors_origins": app.config.get('CORS_ORIGINS', 'Not configured')
    })

@app.route('/api/register', methods=['POST'])
def register_student():
    """Register a new student"""
    try:
        # Rate limiting check
        if not rate_limit_check(request):
            return jsonify({"error": "Trop de requêtes"}), 429
            
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Données manquantes"}), 400
        
        # Log received data for debugging
        app.logger.info(f"Received registration data: {data}")
        
        # Validate required fields
        required_fields = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
        for field in required_fields:
            if not data.get(field):
                app.logger.error(f"Missing required field: {field}")
                return jsonify({"error": f"Le champ {field} est requis"}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            app.logger.error(f"Invalid email format: {data['email']}")
            return jsonify({"error": "Format d'email invalide"}), 400
            
        # Validate phone format
        if not validate_phone(data['telephone']):
            app.logger.error(f"Invalid phone format: {data['telephone']}")
            return jsonify({"error": "Format de téléphone invalide"}), 400
            
        # Validate age
        try:
            age = int(data['age']) if isinstance(data['age'], str) else data['age']
            if age < 14 or age > 18:
                app.logger.error(f"Invalid age: {age}")
                return jsonify({"error": "L'âge doit être entre 14 et 18 ans"}), 400
        except ValueError:
            app.logger.error(f"Age conversion error: {data['age']}")
            return jsonify({"error": "Âge invalide"}), 400
        
        # Validate niveau
        valid_niveaux = ['quatrieme', 'troisieme', 'seconde', 'premiere', 'terminale']
        if data['niveau'] not in valid_niveaux:
            app.logger.error(f"Invalid niveau: {data['niveau']}")
            return jsonify({"error": "Niveau scolaire invalide"}), 400
        
        # Sanitize inputs
        for field in data:
            if isinstance(data[field], str):
                data[field] = sanitize_input(data[field])
        
        # Load existing students
        students = load_data(STUDENTS_FILE)
        
        # Check if email already exists
        existing_emails = [student.get('email', '').lower() for student in students]
        if data['email'].lower() in existing_emails:
            app.logger.error(f"Email already exists: {data['email']}")
            return jsonify({"error": "Cette adresse email est déjà utilisée"}), 400
        
        # Create new student record
        student = {
            "id": generate_student_id(),
            "prenom": data['prenom'],
            "nom": data['nom'],
            "email": data['email'].lower(),
            "telephone": data['telephone'],
            "age": age,
            "niveau": data['niveau'],
            "ecole": data['ecole'],
            "ville": data['ville'],
            "departement": data['departement'],
            "commune": data['commune'],
            "motivation": data['motivation'],
            "registeredAt": datetime.now().isoformat(),
            "status": "pending"
        }
        
        # Add to students list
        students.append(student)
        save_data(STUDENTS_FILE, students)
        
        app.logger.info(f"New student registered: {student['id']}")
        
        return jsonify({
            "message": "Inscription enregistrée avec succès",
            "studentId": student['id']
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error registering student: {e}")
        app.logger.error(f"Error details: {str(e)}")
        return jsonify({"error": "Erreur lors de l'enregistrement"}), 500

@app.route('/api/contact', methods=['POST'])
def contact_message():
    """Save contact message"""
    try:
        # Rate limiting check
        if not rate_limit_check(request):
            return jsonify({"error": "Trop de requêtes"}), 429
            
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Données manquantes"}), 400
        
        # Log received data for debugging
        app.logger.info(f"Received contact data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'email', 'message', 'interest']
        for field in required_fields:
            if not data.get(field):
                app.logger.error(f"Missing required field: {field}")
                return jsonify({"error": f"Le champ {field} est requis"}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            app.logger.error(f"Invalid email format: {data['email']}")
            return jsonify({"error": "Format d'email invalide"}), 400
            
        # Validate phone if provided
        if data.get('phone') and not validate_phone(data['phone']):
            app.logger.error(f"Invalid phone format: {data['phone']}")
            return jsonify({"error": "Format de téléphone invalide"}), 400
        
        # Validate interest
        valid_interests = ['participant', 'parent', 'intervenant', 'partenaire']
        if data['interest'] not in valid_interests:
            app.logger.error(f"Invalid interest: {data['interest']}")
            return jsonify({"error": "Type d'intérêt invalide"}), 400
        
        # Sanitize inputs
        for field in data:
            if isinstance(data[field], str):
                data[field] = sanitize_input(data[field])
        
        # Load existing messages
        messages = load_data(MESSAGES_FILE)
        
        # Create new message record
        message = {
            "id": str(uuid.uuid4()),
            "name": data['name'],
            "email": data['email'].lower(),
            "phone": data.get('phone', ''),
            "interest": data['interest'],
            "message": data['message'],
            "createdAt": datetime.now().isoformat(),
            "status": "new"
        }
        
        # Add to messages list
        messages.append(message)
        save_data(MESSAGES_FILE, messages)
        
        app.logger.info(f"New contact message: {message['id']}")
        
        return jsonify({
            "message": "Message envoyé avec succès",
            "messageId": message['id']
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error saving message: {e}")
        app.logger.error(f"Error details: {str(e)}")
        return jsonify({"error": "Erreur lors de l'envoi du message"}), 500

# API Routes for Admin
@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students"""
    try:
        students = load_data(STUDENTS_FILE)
        # Sort by registration date (newest first)
        students.sort(key=lambda x: x.get('registeredAt', ''), reverse=True)
        return jsonify(students)
    except Exception as e:
        app.logger.error(f"Error getting students: {e}")
        return jsonify({"error": "Erreur lors de la récupération des étudiants"}), 500

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    """Update student status"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Données manquantes"}), 400
            
        new_status = data.get('status')
        if new_status not in ['pending', 'confirmed', 'rejected']:
            return jsonify({"error": "Statut invalide"}), 400
        
        students = load_data(STUDENTS_FILE)
        student = next((s for s in students if s.get('id') == student_id), None)
        
        if not student:
            return jsonify({"error": "Étudiant non trouvé"}), 404
        
        student['status'] = new_status
        student['statusUpdatedAt'] = datetime.now().isoformat()
        
        save_data(STUDENTS_FILE, students)
        
        app.logger.info(f"Student status updated: {student_id} -> {new_status}")
        
        return jsonify({"message": "Statut mis à jour avec succès"})
        
    except Exception as e:
        app.logger.error(f"Error updating student status: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour"}), 500

@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student"""
    try:
        students = load_data(STUDENTS_FILE)
        student = next((s for s in students if s.get('id') == student_id), None)
        
        if not student:
            return jsonify({"error": "Étudiant non trouvé"}), 404
        
        students = [s for s in students if s.get('id') != student_id]
        save_data(STUDENTS_FILE, students)
        
        app.logger.info(f"Student deleted: {student_id}")
        
        return jsonify({"message": "Étudiant supprimé avec succès"})
        
    except Exception as e:
        app.logger.error(f"Error deleting student: {e}")
        return jsonify({"error": "Erreur lors de la suppression"}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get all messages"""
    try:
        messages = load_data(MESSAGES_FILE)
        # Sort by creation date (newest first)
        messages.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        return jsonify(messages)
    except Exception as e:
        app.logger.error(f"Error getting messages: {e}")
        return jsonify({"error": "Erreur lors de la récupération des messages"}), 500

@app.route('/api/messages/<message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    """Update message status"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Données manquantes"}), 400
            
        new_status = data.get('status')
        if new_status not in ['new', 'read', 'replied']:
            return jsonify({"error": "Statut invalide"}), 400
        
        messages = load_data(MESSAGES_FILE)
        message = next((m for m in messages if m.get('id') == message_id), None)
        
        if not message:
            return jsonify({"error": "Message non trouvé"}), 404
        
        message['status'] = new_status
        message['statusUpdatedAt'] = datetime.now().isoformat()
        
        save_data(MESSAGES_FILE, messages)
        
        app.logger.info(f"Message status updated: {message_id} -> {new_status}")
        
        return jsonify({"message": "Statut du message mis à jour avec succès"})
        
    except Exception as e:
        app.logger.error(f"Error updating message status: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour"}), 500

@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Delete a message"""
    try:
        messages = load_data(MESSAGES_FILE)
        message = next((m for m in messages if m.get('id') == message_id), None)
        
        if not message:
            return jsonify({"error": "Message non trouvé"}), 404
        
        messages = [m for m in messages if m.get('id') != message_id]
        save_data(MESSAGES_FILE, messages)
        
        app.logger.info(f"Message deleted: {message_id}")
        
        return jsonify({"message": "Message supprimé avec succès"})
        
        
    except Exception as e:
        app.logger.error(f"Error deleting message: {e}")
        return jsonify({"error": "Erreur lors de la suppression"}), 500

@app.route('/api/export/students')
def export_students():
    """Export students to Excel"""
    try:
        students = load_data(STUDENTS_FILE)
        
        if not students:
            return jsonify({"error": "Aucun étudiant à exporter"}), 404
        
        # Prepare data for Excel
        df_data = []
        for student in students:
            df_data.append({
                'ID': student.get('id', ''),
                'Prénom': student.get('prenom', ''),
                'Nom': student.get('nom', ''),
                'Email': student.get('email', ''),
                'Téléphone': student.get('telephone', ''),
                'Âge': student.get('age', ''),
                'Niveau': student.get('niveau', ''),
                'École': student.get('ecole', ''),
                'Ville': student.get('ville', ''),
                'Département': student.get('departement', ''),
                'Commune': student.get('commune', ''),
                'Motivation': student.get('motivation', ''),
                'Date d\'inscription': student.get('registeredAt', ''),
                'Statut': student.get('status', '')
            })
        
        df = pd.DataFrame(df_data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Inscriptions', index=False)
        
        output.seek(0)
        
        # Generate filename with current date
        filename = f"inscriptions_summer_maths_camp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        app.logger.info(f"Students export generated: {len(students)} records")
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        app.logger.error(f"Error exporting students: {e}")
        return jsonify({"error": "Erreur lors de l'export"}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    app.logger.warning(f"404 error: {request.url}")
    return jsonify({"error": "Endpoint non trouvé"}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"Internal error: {error}")
    return jsonify({"error": "Erreur interne du serveur"}), 500

@app.errorhandler(400)
def bad_request(error):
    app.logger.error(f"Bad request: {error}")
    return jsonify({"error": "Requête invalide"}), 400

@app.errorhandler(429)
def rate_limit_exceeded(error):
    app.logger.warning(f"Rate limit exceeded: {request.remote_addr}")
    return jsonify({"error": "Trop de requêtes"}), 429

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
