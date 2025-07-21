from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid
import pandas as pd
from io import BytesIO
import re
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)

# Configure CORS more permissively for debugging
CORS(app, 
     origins=["*"],  # Allow all origins for now
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
     supports_credentials=False)  # Disable credentials for broader compatibility

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DATA_DIR = 'data'
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def init_data_files():
    """Initialize data files if they don't exist"""
    try:
        if not os.path.exists(STUDENTS_FILE):
            with open(STUDENTS_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)
            logger.info(f"Created {STUDENTS_FILE}")
            
        if not os.path.exists(MESSAGES_FILE):
            with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)
            logger.info(f"Created {MESSAGES_FILE}")
    except Exception as e:
        logger.error(f"Error initializing data files: {e}")

def load_data(filename):
    """Load data from JSON file with error handling"""
    try:
        if not os.path.exists(filename):
            logger.warning(f"File {filename} does not exist, returning empty list")
            return []
            
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                logger.warning(f"File {filename} is empty, returning empty list")
                return []
            
            data = json.loads(content)
            if not isinstance(data, list):
                logger.warning(f"Data in {filename} is not a list, returning empty list")
                return []
            
            return data
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in {filename}: {e}")
        return []
    except Exception as e:
        logger.error(f"Error loading {filename}: {e}")
        return []

def save_data(filename, data):
    """Save data to JSON file with error handling"""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        # Validate data is a list
        if not isinstance(data, list):
            raise ValueError("Data must be a list")
        
        # Write to temporary file first, then rename (atomic operation)
        temp_file = filename + '.tmp'
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Atomic rename
        os.rename(temp_file, filename)
        logger.info(f"Successfully saved {len(data)} records to {filename}")
        return True
    except Exception as e:
        logger.error(f"Error saving to {filename}: {e}")
        # Clean up temp file if it exists
        temp_file = filename + '.tmp'
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except:
                pass
        return False

def validate_email(email):
    """Validate email format"""
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email.strip()))

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Phone is optional in some contexts
    
    if not isinstance(phone, str):
        return False

    # Clean the phone number - remove spaces and non-digit characters except +
    phone = phone.strip()
    
    # Multiple valid formats for Benin
    patterns = [
        r'^\+229\s?[0-9]{8}$',     # +229 12345678 or +22912345678
        r'^[0-9]{8}$',             # 12345678
        r'^\+?[0-9]{8,15}$'        # International format
    ]
    
    return any(re.match(pattern, phone) for pattern in patterns)

def sanitize_string(text, max_length=1000):
    """Sanitize string input"""
    if not isinstance(text, str):
        return ""
    
    # Remove dangerous characters and trim
    sanitized = re.sub(r'[<>"\'\x00-\x1f\x7f-\x9f]', '', text)
    return sanitized.strip()[:max_length]

def generate_student_id():
    """Generate unique student ID"""
    students = load_data(STUDENTS_FILE)
    existing_ids = {student.get('id', '') for student in students if isinstance(student, dict)}
    
    counter = 1
    while True:
        student_id = f"STU{counter:04d}"
        if student_id not in existing_ids:
            return student_id
        counter += 1

# Initialize data files on startup
init_data_files()

@app.before_request
def handle_preflight():
    """Handle CORS preflight requests"""
    if request.method == "OPTIONS":
        print(f"OPTIONS request from origin: {request.headers.get('Origin')}")
        print(f"Request headers: {dict(request.headers)}")
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,Accept,Origin,X-Requested-With")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Max-Age', '86400')
        return response

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "API is running",
        "timestamp": datetime.now().isoformat(),
        "students_count": len(load_data(STUDENTS_FILE)),
        "messages_count": len(load_data(MESSAGES_FILE))
    })

@app.route('/api/register', methods=['POST'])
def register_student():
    """Register a new student"""
    try:
        print(f"POST /api/register - Origin: {request.headers.get('Origin')}")
        print(f"Content-Type: {request.headers.get('Content-Type')}")
        print(f"Request method: {request.method}")
        
        # Get JSON data
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data provided"}), 400
        
        logger.info(f"Received registration data: {list(data.keys())}")
        
        # Validate required fields
        required_fields = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
        missing_fields = []
        
        for field in required_fields:
            if field not in data or not data[field] or (isinstance(data[field], str) and not data[field].strip()):
                missing_fields.append(field)
        
        if missing_fields:
            logger.error(f"Missing required fields: {missing_fields}")
            return jsonify({"error": f"Champs manquants: {', '.join(missing_fields)}"}), 400
        
        # Validate and sanitize data
        try:
            # Sanitize strings
            prenom = sanitize_string(data['prenom'], 100)
            nom = sanitize_string(data['nom'], 100)
            email = data['email'].strip().lower()
            telephone = re.sub(r'[^\d+]', '', data['telephone'].strip())
            ecole = sanitize_string(data['ecole'], 200)
            ville = sanitize_string(data['ville'], 100)
            departement = sanitize_string(data['departement'], 100)
            commune = sanitize_string(data['commune'], 100)
            motivation = sanitize_string(data['motivation'], 2000)
            niveau = data['niveau'].strip()
            
            # Validate age
            try:
                age = int(data['age'])
                if age < 14 or age > 18:
                    return jsonify({"error": "L'âge doit être entre 14 et 18 ans"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Âge invalide"}), 400
            
            # Validate email
            if not validate_email(email):
                return jsonify({"error": "Format d'email invalide"}), 400
            
            # Validate phone
            if not validate_phone(telephone):
                return jsonify({"error": "Format de téléphone invalide"}), 400
            
            # Clean and format phone number
            # Clean and format phone number - be more flexible
            telephone_clean = re.sub(r'[^\d+]', '', telephone)
            if telephone_clean.startswith('+229'):
                telephone = telephone_clean
            elif len(telephone_clean) == 8 and telephone_clean.isdigit():
                telephone = f"+229{telephone}"
            else:
                telephone = telephone_clean
            
            # Validate niveau
            valid_niveaux = ['quatrieme', 'troisieme', 'seconde', 'premiere', 'terminale']
            if niveau not in valid_niveaux:
                return jsonify({"error": "Niveau scolaire invalide"}), 400
            
            # Check minimum lengths
            if len(prenom) < 2:
                return jsonify({"error": "Le prénom doit contenir au moins 2 caractères"}), 400
            if len(nom) < 2:
                return jsonify({"error": "Le nom doit contenir au moins 2 caractères"}), 400
            if len(motivation) < 50:
                return jsonify({"error": "La motivation doit contenir au moins 50 caractères"}), 400
            
        except Exception as e:
            logger.error(f"Data validation error: {e}")
            return jsonify({"error": "Données invalides"}), 400
        
        # Load existing students
        students = load_data(STUDENTS_FILE)
        
        # Check for duplicate email
        existing_emails = {student.get('email', '').lower() for student in students if isinstance(student, dict)}
        if email in existing_emails:
            logger.warning(f"Duplicate email attempt: {email}")
            return jsonify({"error": "Cette adresse email est déjà utilisée"}), 400
        
        # Create student record
        student = {
            "id": generate_student_id(),
            "prenom": prenom,
            "nom": nom,
            "email": email,
            "telephone": telephone,
            "age": age,
            "niveau": niveau,
            "ecole": ecole,
            "ville": ville,
            "departement": departement,
            "commune": commune,
            "motivation": motivation,
            "registeredAt": datetime.now().isoformat(),
            "status": "pending"
        }
        
        # Save student
        students.append(student)
        if not save_data(STUDENTS_FILE, students):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Student registered successfully: {student['id']}")
        
        return jsonify({
            "message": "Inscription enregistrée avec succès",
            "studentId": student['id']
        }), 201
        
    except Exception as e:
        logger.error(f"Unexpected error in register_student: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

@app.route('/api/contact', methods=['POST'])
def contact_message():
    """Save contact message"""
    try:
        print(f"POST /api/contact - Origin: {request.headers.get('Origin')}")
        print(f"Content-Type: {request.headers.get('Content-Type')}")
        
        # Get JSON data
        if not request.is_json:
            logger.error("Contact request is not JSON")
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if not data:
            logger.error("No JSON data received for contact")
            return jsonify({"error": "No data provided"}), 400
        
        logger.info(f"Received contact data: {list(data.keys())}")
        
        # Validate required fields
        required_fields = ['name', 'email', 'message', 'interest']
        missing_fields = []
        
        for field in required_fields:
            if field not in data or not data[field] or (isinstance(data[field], str) and not data[field].strip()):
                missing_fields.append(field)
        
        if missing_fields:
            logger.error(f"Missing required fields in contact: {missing_fields}")
            return jsonify({"error": f"Champs manquants: {', '.join(missing_fields)}"}), 400
        
        # Validate and sanitize data
        try:
            name = sanitize_string(data['name'], 100)
            email = data['email'].strip().lower()
            phone = sanitize_string(data.get('phone', ''), 20) if data.get('phone') else ''
            interest = data['interest'].strip()
            message = sanitize_string(data['message'], 2000)
            
            # Check minimum lengths after sanitization
            if len(name) < 2:
                return jsonify({"error": "Le nom doit contenir au moins 2 caractères"}), 400
            if len(message) < 10:
                return jsonify({"error": "Le message doit contenir au moins 10 caractères"}), 400
            
            # Validate email
            if not validate_email(email):
                return jsonify({"error": "Format d'email invalide"}), 400
            
            # Validate phone if provided
            if phone and not validate_phone(phone):
                return jsonify({"error": "Format de téléphone invalide"}), 400
            
            # Clean and format phone number if provided
            if phone:
                phone_clean = re.sub(r'[^\d+]', '', phone)
                if phone_clean.startswith('+229'):
                    phone = phone_clean
                elif len(phone_clean) == 8 and phone_clean.isdigit():
                    phone = f"+229{phone_clean}"
                else:
                    phone = phone_clean
            
            # Validate interest
            valid_interests = ['participant', 'parent', 'intervenant', 'partenaire']
            if interest not in valid_interests:
                return jsonify({"error": "Type d'intérêt invalide"}), 400
            
        except Exception as e:
            logger.error(f"Contact data validation error: {e}")
            return jsonify({"error": "Données invalides"}), 400
        
        # Load existing messages
        messages = load_data(MESSAGES_FILE)
        
        # Create message record
        contact_message = {
            "id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "phone": phone,
            "interest": interest,
            "message": message,
            "createdAt": datetime.now().isoformat(),
            "status": "new"
        }
        
        # Save message
        messages.append(contact_message)
        if not save_data(MESSAGES_FILE, messages):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Contact message saved successfully: {contact_message['id']}")
        
        return jsonify({
            "message": "Message envoyé avec succès",
            "messageId": contact_message['id']
        }), 201
        
    except Exception as e:
        logger.error(f"Unexpected error in contact_message: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students"""
    try:
        students = load_data(STUDENTS_FILE)
        # Sort by registration date (newest first)
        students.sort(key=lambda x: x.get('registeredAt', ''), reverse=True)
        logger.info(f"Retrieved {len(students)} students")
        return jsonify(students)
    except Exception as e:
        logger.error(f"Error getting students: {e}")
        return jsonify({"error": "Erreur lors de la récupération des étudiants"}), 500

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    """Update student status"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"error": "Status is required"}), 400
        
        new_status = data['status']
        if new_status not in ['pending', 'confirmed', 'rejected']:
            return jsonify({"error": "Statut invalide"}), 400
        
        students = load_data(STUDENTS_FILE)
        student = next((s for s in students if s.get('id') == student_id), None)
        
        if not student:
            return jsonify({"error": "Étudiant non trouvé"}), 404
        
        student['status'] = new_status
        student['statusUpdatedAt'] = datetime.now().isoformat()
        
        if not save_data(STUDENTS_FILE, students):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Student status updated: {student_id} -> {new_status}")
        return jsonify({"message": "Statut mis à jour avec succès"})
        
    except Exception as e:
        logger.error(f"Error updating student status: {e}")
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
        
        if not save_data(STUDENTS_FILE, students):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Student deleted: {student_id}")
        return jsonify({"message": "Étudiant supprimé avec succès"})
        
    except Exception as e:
        logger.error(f"Error deleting student: {e}")
        return jsonify({"error": "Erreur lors de la suppression"}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get all messages"""
    try:
        messages = load_data(MESSAGES_FILE)
        # Sort by creation date (newest first)
        messages.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        logger.info(f"Retrieved {len(messages)} messages")
        return jsonify(messages)
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        return jsonify({"error": "Erreur lors de la récupération des messages"}), 500

@app.route('/api/messages/<message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    """Update message status"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"error": "Status is required"}), 400
        
        new_status = data['status']
        if new_status not in ['new', 'read', 'replied']:
            return jsonify({"error": "Statut invalide"}), 400
        
        messages = load_data(MESSAGES_FILE)
        message = next((m for m in messages if m.get('id') == message_id), None)
        
        if not message:
            return jsonify({"error": "Message non trouvé"}), 404
        
        message['status'] = new_status
        message['statusUpdatedAt'] = datetime.now().isoformat()
        
        if not save_data(MESSAGES_FILE, messages):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Message status updated: {message_id} -> {new_status}")
        return jsonify({"message": "Statut du message mis à jour avec succès"})
        
    except Exception as e:
        logger.error(f"Error updating message status: {e}")
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
        
        if not save_data(MESSAGES_FILE, messages):
            return jsonify({"error": "Erreur lors de la sauvegarde"}), 500
        
        logger.info(f"Message deleted: {message_id}")
        return jsonify({"message": "Message supprimé avec succès"})
        
    except Exception as e:
        logger.error(f"Error deleting message: {e}")
        return jsonify({"error": "Erreur lors de la suppression"}), 500

@app.route('/api/export/students', methods=['GET'])
def export_students():
    """Export students to Excel"""
    try:
        students = load_data(STUDENTS_FILE)
        
        if not students:
            return jsonify({"error": "Aucun étudiant à exporter"}), 404
        
        # Prepare data for Excel
        df_data = []
        for student in students:
            if isinstance(student, dict):
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
        
        if not df_data:
            return jsonify({"error": "Aucune donnée valide à exporter"}), 404
        
        df = pd.DataFrame(df_data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Inscriptions', index=False)
        
        output.seek(0)
        
        # Generate filename with current date
        filename = f"inscriptions_summer_maths_camp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        logger.info(f"Students export generated: {len(df_data)} records")
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        logger.error(f"Error exporting students: {e}")
        return jsonify({"error": "Erreur lors de l'export"}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify({"error": "Endpoint non trouvé"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {error}")
    return jsonify({"error": "Erreur interne du serveur"}), 500

@app.errorhandler(400)
def bad_request(error):
    logger.error(f"Bad request: {error}")
    return jsonify({"error": "Requête invalide"}), 400

@app.errorhandler(405)
def method_not_allowed(error):
    logger.warning(f"Method not allowed: {request.method} {request.url}")
    return jsonify({"error": "Méthode non autorisée"}), 405

@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Max-Age', '86400')
    return response

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    port = int(os.environ.get('PORT', 5000))
    
    logger.info(f"Starting server on port {port}, debug={debug_mode}")
    logger.info("CORS configured for all origins (*)")
    logger.info("Available endpoints: /api/health, /api/register, /api/contact, /api/students, /api/messages")
    
    # Initialize data files before starting
    init_data_files()
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port, threaded=True)