from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid
import pandas as pd
from io import BytesIO
import tempfile

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
CORS(app)

# Configuration
DATA_DIR = 'data'
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def load_data(filename):
    """Load data from JSON file"""
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_data(filename, data):
    """Save data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/api/register', methods=['POST'])
def register_student():
    """Register a new student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Le champ {field} est requis"}), 400
        
        # Load existing students
        students = load_data(STUDENTS_FILE)
        
        # Check if email already exists
        existing_emails = [student.get('email', '').lower() for student in students]
        if data['email'].lower() in existing_emails:
            return jsonify({"error": "Cette adresse email est déjà utilisée"}), 400
        
        # Create new student record
        student = {
            "id": generate_student_id(),
            "prenom": data['prenom'],
            "nom": data['nom'],
            "email": data['email'],
            "telephone": data['telephone'],
            "age": int(data['age']),
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
        
        return jsonify({
            "message": "Inscription enregistrée avec succès",
            "studentId": student['id']
        }), 201
        
    except Exception as e:
        print(f"Error registering student: {e}")
        return jsonify({"error": "Erreur lors de l'enregistrement"}), 500

@app.route('/api/contact', methods=['POST'])
def contact_message():
    """Save contact message"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message', 'interest']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Le champ {field} est requis"}), 400
        
        # Load existing messages
        messages = load_data(MESSAGES_FILE)
        
        # Create new message record
        message = {
            "id": str(uuid.uuid4()),
            "name": data['name'],
            "email": data['email'],
            "phone": data.get('phone', ''),
            "interest": data['interest'],
            "message": data['message'],
            "createdAt": datetime.now().isoformat(),
            "status": "new"
        }
        
        # Add to messages list
        messages.append(message)
        save_data(MESSAGES_FILE, messages)
        
        return jsonify({
            "message": "Message envoyé avec succès",
            "messageId": message['id']
        }), 201
        
    except Exception as e:
        print(f"Error saving message: {e}")
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
        print(f"Error getting students: {e}")
        return jsonify({"error": "Erreur lors de la récupération des étudiants"}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get all messages"""
    try:
        messages = load_data(MESSAGES_FILE)
        # Sort by creation date (newest first)
        messages.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        return jsonify(messages)
    except Exception as e:
        print(f"Error getting messages: {e}")
        return jsonify({"error": "Erreur lors de la récupération des messages"}), 500

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    """Update student status"""
    try:
        data = request.get_json()
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
        
        return jsonify({"message": "Statut mis à jour avec succès"})
        
    except Exception as e:
        print(f"Error updating student status: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour"}), 500

@app.route('/api/messages/<message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    """Update message status"""
    try:
        data = request.get_json()
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
        
        return jsonify({"message": "Statut mis à jour avec succès"})
        
    except Exception as e:
        print(f"Error updating message status: {e}")
        return jsonify({"error": "Erreur lors de la mise à jour"}), 500

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
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        print(f"Error exporting students: {e}")
        return jsonify({"error": "Erreur lors de l'export"}), 500

@app.route('/api/export/messages')
def export_messages():
    """Export messages to Excel"""
    try:
        messages = load_data(MESSAGES_FILE)
        
        if not messages:
            return jsonify({"error": "Aucun message à exporter"}), 404
        
        # Prepare data for Excel
        df_data = []
        for message in messages:
            df_data.append({
                'ID': message.get('id', ''),
                'Nom': message.get('name', ''),
                'Email': message.get('email', ''),
                'Téléphone': message.get('phone', ''),
                'Intérêt': message.get('interest', ''),
                'Message': message.get('message', ''),
                'Date de création': message.get('createdAt', ''),
                'Statut': message.get('status', '')
            })
        
        df = pd.DataFrame(df_data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Messages', index=False)
        
        output.seek(0)
        
        # Generate filename with current date
        filename = f"messages_summer_maths_camp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        print(f"Error exporting messages: {e}")
        return jsonify({"error": "Erreur lors de l'export"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)