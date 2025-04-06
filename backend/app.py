
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
from functools import wraps
import os
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'summer-maths-camp-secret-key')
CORS(app)  # Enable CORS for all routes

# Define the data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')
ADMIN_CREDENTIALS = {
    'username': os.environ.get('ADMIN_USERNAME', 'admin'),
    'password': os.environ.get('ADMIN_PASSWORD', 'password')
}

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

# Admin login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# API Endpoints
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Summer Maths Camp API is running'})

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
            'department': data.get('department', ''),
            'commune': data.get('commune', ''),
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

# Admin Routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_CREDENTIALS['username'] and password == ADMIN_CREDENTIALS['password']:
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    students = get_students()
    stats = {
        'total': len(students),
        'pending': sum(1 for s in students if s['status'] == 'pending'),
        'confirmed': sum(1 for s in students if s['status'] == 'confirmed'),
        'rejected': sum(1 for s in students if s['status'] == 'rejected')
    }
    return render_template('dashboard.html', stats=stats)

@app.route('/admin/students')
@login_required
def admin_students():
    students = get_students()
    status_filter = request.args.get('status', '')
    
    if status_filter and status_filter != 'all':
        students = [s for s in students if s['status'] == status_filter]
    
    return render_template('students.html', students=students, status_filter=status_filter)

@app.route('/admin/students/<student_id>')
@login_required
def admin_student_detail(student_id):
    students = get_students()
    student = next((s for s in students if s['id'] == student_id), None)
    
    if not student:
        return "Student not found", 404
    
    return render_template('student_detail.html', student=student)

@app.route('/admin/students/<student_id>/update-status', methods=['POST'])
@login_required
def admin_update_status(student_id):
    new_status = request.form.get('status')
    if new_status not in ['pending', 'confirmed', 'rejected']:
        return "Invalid status", 400
    
    students = get_students()
    student_index = next((i for i, s in enumerate(students) if s['id'] == student_id), None)
    
    if student_index is None:
        return "Student not found", 404
    
    students[student_index]['status'] = new_status
    save_students(students)
    
    return redirect(url_for('admin_student_detail', student_id=student_id))

# Create templates directory if it doesn't exist
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Create HTML templates
def create_template_files():
    # Login template
    login_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - Summer Maths Camp</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-blue-600">Summer Maths Camp</h1>
                <p class="text-gray-600">Admin Portal</p>
            </div>
            
            {% if error %}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>
            {% endif %}
            
            <form method="POST" action="{{ url_for('admin_login') }}">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="username" type="text" name="username" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" type="password" name="password" required>
                </div>
                <div class="flex items-center justify-center">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
                        type="submit">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    </body>
    </html>
    """
    
    # Dashboard template
    dashboard_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - Summer Maths Camp</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen">
        {% include 'admin_nav.html' %}
        
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-2xl font-bold mb-8">Dashboard</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-gray-500 text-sm font-medium mb-2">Total Registrations</h2>
                    <div class="text-3xl font-bold text-gray-700">{{ stats.total }}</div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-gray-500 text-sm font-medium mb-2">Pending</h2>
                    <div class="text-3xl font-bold text-yellow-500">{{ stats.pending }}</div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-gray-500 text-sm font-medium mb-2">Confirmed</h2>
                    <div class="text-3xl font-bold text-green-500">{{ stats.confirmed }}</div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-gray-500 text-sm font-medium mb-2">Rejected</h2>
                    <div class="text-3xl font-bold text-red-500">{{ stats.rejected }}</div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Quick Actions</h2>
                <div class="flex space-x-4">
                    <a href="{{ url_for('admin_students') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View All Students
                    </a>
                    <a href="{{ url_for('admin_students') }}?status=pending" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                        View Pending Applications
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Admin navigation template
    admin_nav_html = """
    <nav class="bg-blue-600 text-white">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="font-bold text-xl">Summer Maths Camp Admin</div>
                <div class="flex items-center space-x-6">
                    <a href="{{ url_for('admin_dashboard') }}" class="hover:underline">Dashboard</a>
                    <a href="{{ url_for('admin_students') }}" class="hover:underline">Students</a>
                    <a href="{{ url_for('admin_logout') }}" class="hover:underline">Logout</a>
                </div>
            </div>
        </div>
    </nav>
    """
    
    # Students list template
    students_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Students - Summer Maths Camp</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen">
        {% include 'admin_nav.html' %}
        
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">Student Registrations</h1>
                <div class="flex space-x-2">
                    <a href="{{ url_for('admin_students') }}" class="px-4 py-2 rounded {% if status_filter == '' %}bg-blue-500 text-white{% else %}bg-gray-200{% endif %}">
                        All
                    </a>
                    <a href="{{ url_for('admin_students') }}?status=pending" class="px-4 py-2 rounded {% if status_filter == 'pending' %}bg-yellow-500 text-white{% else %}bg-gray-200{% endif %}">
                        Pending
                    </a>
                    <a href="{{ url_for('admin_students') }}?status=confirmed" class="px-4 py-2 rounded {% if status_filter == 'confirmed' %}bg-green-500 text-white{% else %}bg-gray-200{% endif %}">
                        Confirmed
                    </a>
                    <a href="{{ url_for('admin_students') }}?status=rejected" class="px-4 py-2 rounded {% if status_filter == 'rejected' %}bg-red-500 text-white{% else %}bg-gray-200{% endif %}">
                        Rejected
                    </a>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {% for student in students %}
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ student.firstName }} {{ student.lastName }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.school }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.grade }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {% if student.status == 'pending' %}
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Pending
                                </span>
                                {% elif student.status == 'confirmed' %}
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Confirmed
                                </span>
                                {% elif student.status == 'rejected' %}
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Rejected
                                </span>
                                {% endif %}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ student.registeredAt.split('T')[0] }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ url_for('admin_student_detail', student_id=student.id) }}" class="text-blue-600 hover:text-blue-900">
                                    View Details
                                </a>
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Student detail template
    student_detail_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Details - Summer Maths Camp</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen">
        {% include 'admin_nav.html' %}
        
        <div class="container mx-auto px-4 py-8">
            <div class="mb-6">
                <a href="{{ url_for('admin_students') }}" class="text-blue-600 hover:text-blue-800">
                    &larr; Back to Students
                </a>
            </div>
            
            <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div class="flex justify-between items-center px-4 py-5 sm:px-6">
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                            Student Information
                        </h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">
                            Registration details for {{ student.firstName }} {{ student.lastName }}
                        </p>
                    </div>
                    <div>
                        {% if student.status == 'pending' %}
                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                        </span>
                        {% elif student.status == 'confirmed' %}
                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                        </span>
                        {% elif student.status == 'rejected' %}
                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Rejected
                        </span>
                        {% endif %}
                    </div>
                </div>
                <div class="border-t border-gray-200">
                    <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.firstName }} {{ student.lastName }}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Registration ID
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.id }}
                            </dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.email }}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Phone number
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.phone }}
                            </dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Age
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.age }}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Grade
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.grade }}
                            </dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                School
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.school }}
                            </dd>
                        </div>
                        {% if student.department %}
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Department
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.department }}
                            </dd>
                        </div>
                        {% endif %}
                        {% if student.commune %}
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Commune
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.commune }}
                            </dd>
                        </div>
                        {% endif %}
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Registration Date
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ student.registeredAt.split('T')[0] }} at {{ student.registeredAt.split('T')[1].split('.')[0] }}
                            </dd>
                        </div>
                        
                        {% if student.parentInfo %}
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Parent Information
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div>Name: {{ student.parentInfo.name or 'N/A' }}</div>
                                <div>Email: {{ student.parentInfo.email or 'N/A' }}</div>
                                <div>Phone: {{ student.parentInfo.phone or 'N/A' }}</div>
                            </dd>
                        </div>
                        {% endif %}
                    </dl>
                </div>
            </div>
            
            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Update Registration Status
                    </h3>
                    <div class="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Change the current application status for this student.</p>
                    </div>
                    <form action="{{ url_for('admin_update_status', student_id=student.id) }}" method="POST" class="mt-5">
                        <div class="flex items-center space-x-4">
                            <button type="submit" name="status" value="pending" class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                Mark as Pending
                            </button>
                            <button type="submit" name="status" value="confirmed" class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Confirm Registration
                            </button>
                            <button type="submit" name="status" value="rejected" class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Reject Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    with open(os.path.join(TEMPLATES_DIR, 'login.html'), 'w') as f:
        f.write(login_html)
    
    with open(os.path.join(TEMPLATES_DIR, 'dashboard.html'), 'w') as f:
        f.write(dashboard_html)
    
    with open(os.path.join(TEMPLATES_DIR, 'admin_nav.html'), 'w') as f:
        f.write(admin_nav_html)
    
    with open(os.path.join(TEMPLATES_DIR, 'students.html'), 'w') as f:
        f.write(students_html)
    
    with open(os.path.join(TEMPLATES_DIR, 'student_detail.html'), 'w') as f:
        f.write(student_detail_html)

# Create the template files when the app starts
create_template_files()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
