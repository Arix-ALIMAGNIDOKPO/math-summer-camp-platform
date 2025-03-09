
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize students file if it doesn't exist
if not os.path.exists(STUDENTS_FILE):
    with open(STUDENTS_FILE, 'w') as f:
        json.dump([], f)

def get_students():
    try:
        with open(STUDENTS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading students: {e}")
        return []

def save_students(students):
    with open(STUDENTS_FILE, 'w') as f:
        json.dump(students, f, indent=2)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Math Summer Camp API is running'})

@app.route('/api/students', methods=['GET'])
def list_students():
    students = get_students()
    return jsonify(students)

@app.route('/api/students', methods=['POST'])
def register_student():
    try:
        data = request.json
        students = get_students()
        
        # Validate required fields
        required_fields = ['firstName', 'lastName', 'email', 'phone', 'age', 'grade', 'school']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate a unique ID for the student
        student_id = f"STU{len(students) + 1:04d}"
        
        # Add registration timestamp
        timestamp = datetime.now().isoformat()
        
        # Create student object
        student = {
            'id': student_id,
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'phone': data['phone'],
            'age': data['age'],
            'grade': data['grade'],
            'school': data['school'],
            'parentInfo': data.get('parentInfo', {}),
            'registeredAt': timestamp,
            'status': 'pending'  # pending, confirmed, rejected
        }
        
        students.append(student)
        save_students(students)
        
        return jsonify({'success': True, 'message': 'Registration successful', 'studentId': student_id}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    students = get_students()
    student = next((s for s in students if s['id'] == student_id), None)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify(student)

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    try:
        data = request.json
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        new_status = data['status']
        if new_status not in ['pending', 'confirmed', 'rejected']:
            return jsonify({'error': 'Invalid status value'}), 400
        
        students = get_students()
        student_index = next((i for i, s in enumerate(students) if s['id'] == student_id), None)
        
        if student_index is None:
            return jsonify({'error': 'Student not found'}), 404
        
        students[student_index]['status'] = new_status
        save_students(students)
        
        return jsonify({'success': True, 'message': f'Student status updated to {new_status}'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
