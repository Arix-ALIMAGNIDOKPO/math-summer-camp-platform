from flask import Flask, request, jsonify, render_template_string, redirect, url_for, session
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'smc2025_secret_key_admin'
CORS(app)

# Configuration
ADMIN_USERNAME = "admin_smc"
ADMIN_PASSWORD = "SMC2025@Admin"

# Chemins des fichiers de données
STUDENTS_FILE = os.path.join(os.path.dirname(__file__), 'data', 'students.json')
APPLICATIONS_FILE = os.path.join(os.path.dirname(__file__), 'data', 'applications.json')

# Créer le dossier data s'il n'existe pas
os.makedirs(os.path.dirname(STUDENTS_FILE), exist_ok=True)

def load_json_file(filepath, default_data=None):
    """Charge un fichier JSON ou retourne les données par défaut"""
    if default_data is None:
        default_data = []
    
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        return default_data
    except Exception as e:
        print(f"Erreur lors du chargement de {filepath}: {e}")
        return default_data

def save_json_file(filepath, data):
    """Sauvegarde des données dans un fichier JSON"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Erreur lors de la sauvegarde de {filepath}: {e}")
        return False

def generate_student_id():
    """Génère un ID unique pour un étudiant"""
    students = load_json_file(STUDENTS_FILE)
    return f"STU{len(students) + 1:04d}"

def generate_application_id():
    """Génère un ID unique pour une candidature"""
    applications = load_json_file(APPLICATIONS_FILE)
    return f"APP{len(applications) + 1:04d}"

# Routes API pour les inscriptions
@app.route('/api/register', methods=['POST'])
def register_student():
    """Enregistre une nouvelle candidature d'inscription"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Charger les candidatures existantes
        applications = load_json_file(APPLICATIONS_FILE)
        
        # Vérifier si l'email existe déjà
        for app in applications:
            if app.get('email') == data['email']:
                return jsonify({'error': 'Une candidature avec cet email existe déjà'}), 400
        
        # Créer la nouvelle candidature
        new_application = {
            'id': generate_application_id(),
            'prenom': data['prenom'],
            'nom': data['nom'],
            'email': data['email'],
            'telephone': data['telephone'],
            'age': data['age'],
            'niveau': data['niveau'],
            'ecole': data['ecole'],
            'ville': data['ville'],
            'departement': data['departement'],
            'commune': data['commune'],
            'motivation': data['motivation'],
            'status': 'pending',
            'submittedAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # Ajouter la candidature
        applications.append(new_application)
        
        # Sauvegarder
        if save_json_file(APPLICATIONS_FILE, applications):
            return jsonify({
                'message': 'Candidature enregistrée avec succès',
                'application_id': new_application['id']
            }), 201
        else:
            return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
            
    except Exception as e:
        print(f"Erreur lors de l'enregistrement: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/applications', methods=['GET'])
def get_applications():
    """Récupère toutes les candidatures"""
    try:
        applications = load_json_file(APPLICATIONS_FILE)
        
        # Filtrer par statut si spécifié
        status_filter = request.args.get('status')
        if status_filter:
            applications = [app for app in applications if app.get('status') == status_filter]
        
        return jsonify(applications), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des candidatures: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/applications/<application_id>', methods=['GET'])
def get_application(application_id):
    """Récupère une candidature spécifique"""
    try:
        applications = load_json_file(APPLICATIONS_FILE)
        
        for app in applications:
            if app.get('id') == application_id:
                return jsonify(app), 200
        
        return jsonify({'error': 'Candidature non trouvée'}), 404
    except Exception as e:
        print(f"Erreur lors de la récupération de la candidature: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/applications/<application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    """Met à jour le statut d'une candidature"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'accepted', 'rejected']:
            return jsonify({'error': 'Statut invalide'}), 400
        
        applications = load_json_file(APPLICATIONS_FILE)
        
        for i, app in enumerate(applications):
            if app.get('id') == application_id:
                applications[i]['status'] = new_status
                applications[i]['updatedAt'] = datetime.now().isoformat()
                
                if save_json_file(APPLICATIONS_FILE, applications):
                    return jsonify({
                        'message': 'Statut mis à jour avec succès',
                        'application': applications[i]
                    }), 200
                else:
                    return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
        
        return jsonify({'error': 'Candidature non trouvée'}), 404
    except Exception as e:
        print(f"Erreur lors de la mise à jour du statut: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

# Routes pour l'ancien système (compatibilité)
@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérification de l'état de l'API"""
    return jsonify({
        'status': 'healthy',
        'message': 'Summer Maths Camp API is running',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/students', methods=['GET', 'POST'])
def handle_students():
    """Gère les étudiants (ancien système)"""
    if request.method == 'GET':
        students = load_json_file(STUDENTS_FILE)
        return jsonify(students), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            students = load_json_file(STUDENTS_FILE)
            
            new_student = {
                'id': generate_student_id(),
                'firstName': data.get('firstName'),
                'lastName': data.get('lastName'),
                'email': data.get('email'),
                'phone': data.get('phone'),
                'age': data.get('age'),
                'grade': data.get('grade'),
                'school': data.get('school'),
                'parentInfo': data.get('parentInfo', {}),
                'registeredAt': datetime.now().isoformat(),
                'status': 'pending'
            }
            
            students.append(new_student)
            
            if save_json_file(STUDENTS_FILE, students):
                return jsonify({
                    'message': 'Étudiant enregistré avec succès',
                    'student': new_student
                }), 201
            else:
                return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
                
        except Exception as e:
            print(f"Erreur lors de l'enregistrement de l'étudiant: {e}")
            return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    """Récupère un étudiant spécifique"""
    try:
        students = load_json_file(STUDENTS_FILE)
        
        for student in students:
            if student.get('id') == student_id:
                return jsonify(student), 200
        
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    except Exception as e:
        print(f"Erreur lors de la récupération de l'étudiant: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/students/<student_id>/status', methods=['PUT'])
def update_student_status(student_id):
    """Met à jour le statut d'un étudiant"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'confirmed', 'rejected']:
            return jsonify({'error': 'Statut invalide'}), 400
        
        students = load_json_file(STUDENTS_FILE)
        
        for i, student in enumerate(students):
            if student.get('id') == student_id:
                students[i]['status'] = new_status
                students[i]['updatedAt'] = datetime.now().isoformat()
                
                if save_json_file(STUDENTS_FILE, students):
                    return jsonify({
                        'message': 'Statut mis à jour avec succès',
                        'student': students[i]
                    }), 200
                else:
                    return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
        
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    except Exception as e:
        print(f"Erreur lors de la mise à jour du statut: {e}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

# Interface d'administration web
ADMIN_LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Summer Maths Camp</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #0056b3; }
        .error { color: red; margin-top: 10px; }
        .credentials { background-color: #e7f3ff; padding: 15px; border-radius: 4px; margin-top: 20px; }
        .credentials h3 { margin-top: 0; color: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🎓 Summer Maths Camp</h1>
            <h2>Administration</h2>
        </div>
        
        <form method="POST">
            <div class="form-group">
                <label for="username">Nom d'utilisateur :</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">Se connecter</button>
            
            {% if error %}
            <div class="error">{{ error }}</div>
            {% endif %}
        </form>
        
        <div class="credentials">
            <h3>Identifiants de connexion :</h3>
            <p><strong>Utilisateur :</strong> admin_smc</p>
            <p><strong>Mot de passe :</strong> SMC2025@Admin</p>
        </div>
    </div>
</body>
</html>
'''

ADMIN_DASHBOARD_TEMPLATE = '''
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Summer Maths Camp</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .header { background: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .applications { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .application-item { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .application-item:last-child { border-bottom: none; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-accepted { background-color: #d4edda; color: #155724; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
        .btn { padding: 8px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; }
        .btn:hover { background-color: #0056b3; }
        .btn-danger { background-color: #dc3545; }
        .btn-danger:hover { background-color: #c82333; }
        .btn-success { background-color: #28a745; }
        .btn-success:hover { background-color: #218838; }
        .filters { margin-bottom: 20px; }
        .filters button { margin-right: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>🎓 Summer Maths Camp - Administration</h1>
            <a href="/admin/logout" class="btn">Déconnexion</a>
        </div>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <h3>Total des candidatures</h3>
                <div class="stat-number">{{ stats.total }}</div>
            </div>
            <div class="stat-card">
                <h3>En attente</h3>
                <div class="stat-number">{{ stats.pending }}</div>
            </div>
            <div class="stat-card">
                <h3>Acceptées</h3>
                <div class="stat-number">{{ stats.accepted }}</div>
            </div>
            <div class="stat-card">
                <h3>Rejetées</h3>
                <div class="stat-number">{{ stats.rejected }}</div>
            </div>
        </div>
        
        <div class="applications">
            <h2>Candidatures d'inscription</h2>
            
            <div class="filters">
                <a href="/admin/dashboard" class="btn">Toutes</a>
                <a href="/admin/dashboard?status=pending" class="btn">En attente</a>
                <a href="/admin/dashboard?status=accepted" class="btn btn-success">Acceptées</a>
                <a href="/admin/dashboard?status=rejected" class="btn btn-danger">Rejetées</a>
            </div>
            
            {% for app in applications %}
            <div class="application-item">
                <div>
                    <strong>{{ app.prenom }} {{ app.nom }}</strong><br>
                    <small>{{ app.email }} | {{ app.telephone }}</small><br>
                    <small>{{ app.ecole }} - {{ app.ville }}, {{ app.departement }}</small>
                </div>
                <div>
                    <span class="status status-{{ app.status }}">
                        {% if app.status == 'pending' %}En attente
                        {% elif app.status == 'accepted' %}Acceptée
                        {% else %}Rejetée{% endif %}
                    </span>
                    <a href="/admin/application/{{ app.id }}" class="btn" style="margin-left: 10px;">Voir détails</a>
                </div>
            </div>
            {% endfor %}
            
            {% if not applications %}
            <p style="text-align: center; color: #666; padding: 40px;">Aucune candidature trouvée.</p>
            {% endif %}
        </div>
    </div>
</body>
</html>
'''

APPLICATION_DETAIL_TEMPLATE = '''
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidature {{ application.id }} - Summer Maths Camp</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .header { background: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .field { margin-bottom: 20px; }
        .field label { display: block; font-weight: bold; margin-bottom: 5px; color: #333; }
        .field value { display: block; padding: 8px; background-color: #f8f9fa; border-radius: 4px; }
        .status { padding: 8px 16px; border-radius: 4px; font-weight: bold; display: inline-block; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-accepted { background-color: #d4edda; color: #155724; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
        .btn { padding: 10px 20px; margin: 5px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; }
        .btn:hover { background-color: #0056b3; }
        .btn-success { background-color: #28a745; }
        .btn-success:hover { background-color: #218838; }
        .btn-danger { background-color: #dc3545; }
        .btn-danger:hover { background-color: #c82333; }
        .btn-warning { background-color: #ffc107; color: #212529; }
        .btn-warning:hover { background-color: #e0a800; }
        .actions { text-align: center; margin-top: 30px; }
        .motivation { background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>🎓 Candidature {{ application.id }}</h1>
            <a href="/admin/dashboard" class="btn">← Retour au dashboard</a>
        </div>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>{{ application.prenom }} {{ application.nom }}</h2>
            <p>Statut actuel : 
                <span class="status status-{{ application.status }}">
                    {% if application.status == 'pending' %}En attente
                    {% elif application.status == 'accepted' %}Acceptée
                    {% else %}Rejetée{% endif %}
                </span>
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div class="field">
                    <label>Email :</label>
                    <div class="value">{{ application.email }}</div>
                </div>
                
                <div class="field">
                    <label>Téléphone :</label>
                    <div class="value">{{ application.telephone }}</div>
                </div>
                
                <div class="field">
                    <label>Âge :</label>
                    <div class="value">{{ application.age }} ans</div>
                </div>
                
                <div class="field">
                    <label>Niveau scolaire :</label>
                    <div class="value">{{ application.niveau }}</div>
                </div>
                
                <div class="field">
                    <label>École :</label>
                    <div class="value">{{ application.ecole }}</div>
                </div>
                
                <div class="field">
                    <label>Ville :</label>
                    <div class="value">{{ application.ville }}</div>
                </div>
                
                <div class="field">
                    <label>Département :</label>
                    <div class="value">{{ application.departement }}</div>
                </div>
                
                <div class="field">
                    <label>Commune :</label>
                    <div class="value">{{ application.commune }}</div>
                </div>
            </div>
            
            <div class="field" style="margin-top: 30px;">
                <label>Lettre de motivation :</label>
                <div class="motivation">{{ application.motivation }}</div>
            </div>
            
            <div class="field">
                <label>Date de candidature :</label>
                <div class="value">{{ application.submittedAt }}</div>
            </div>
            
            <div class="actions">
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="accept">
                    <button type="submit" class="btn btn-success">✓ Accepter</button>
                </form>
                
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="pending">
                    <button type="submit" class="btn btn-warning">⏳ Mettre en attente</button>
                </form>
                
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="reject">
                    <button type="submit" class="btn btn-danger">✗ Rejeter</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
'''

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Page de connexion administrateur"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template_string(ADMIN_LOGIN_TEMPLATE, error="Identifiants incorrects")
    
    return render_template_string(ADMIN_LOGIN_TEMPLATE)

@app.route('/admin/logout')
def admin_logout():
    """Déconnexion administrateur"""
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
def admin_dashboard():
    """Dashboard administrateur"""
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    try:
        applications = load_json_file(APPLICATIONS_FILE)
        
        # Filtrer par statut si spécifié
        status_filter = request.args.get('status')
        if status_filter:
            filtered_applications = [app for app in applications if app.get('status') == status_filter]
        else:
            filtered_applications = applications
        
        # Calculer les statistiques
        stats = {
            'total': len(applications),
            'pending': len([app for app in applications if app.get('status') == 'pending']),
            'accepted': len([app for app in applications if app.get('status') == 'accepted']),
            'rejected': len([app for app in applications if app.get('status') == 'rejected'])
        }
        
        return render_template_string(ADMIN_DASHBOARD_TEMPLATE, 
                                    applications=filtered_applications, 
                                    stats=stats)
    except Exception as e:
        print(f"Erreur dans le dashboard: {e}")
        return f"Erreur lors du chargement du dashboard: {e}", 500

@app.route('/admin/application/<application_id>', methods=['GET', 'POST'])
def admin_application_detail(application_id):
    """Détails d'une candidature"""
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    try:
        applications = load_json_file(APPLICATIONS_FILE)
        
        # Trouver la candidature
        application = None
        for app in applications:
            if app.get('id') == application_id:
                application = app
                break
        
        if not application:
            return "Candidature non trouvée", 404
        
        # Traitement des actions POST
        if request.method == 'POST':
            action = request.form.get('action')
            if action in ['accept', 'reject', 'pending']:
                status_map = {'accept': 'accepted', 'reject': 'rejected', 'pending': 'pending'}
                new_status = status_map[action]
                
                # Mettre à jour le statut
                for i, app in enumerate(applications):
                    if app.get('id') == application_id:
                        applications[i]['status'] = new_status
                        applications[i]['updatedAt'] = datetime.now().isoformat()
                        break
                
                # Sauvegarder
                if save_json_file(APPLICATIONS_FILE, applications):
                    return redirect(url_for('admin_application_detail', application_id=application_id))
                else:
                    return "Erreur lors de la sauvegarde", 500
        
        return render_template_string(APPLICATION_DETAIL_TEMPLATE, application=application)
    except Exception as e:
        print(f"Erreur dans les détails de candidature: {e}")
        return f"Erreur lors du chargement des détails: {e}", 500

@app.route('/admin')
def admin_redirect():
    """Redirection vers la page de connexion admin"""
    return redirect(url_for('admin_login'))

if __name__ == '__main__':
    print("🎓 Summer Maths Camp API démarrée")
    print(f"📧 Admin: {ADMIN_USERNAME}")
    print(f"🔑 Password: {ADMIN_PASSWORD}")
    print("🌐 Interface admin: http://localhost:5000/admin/login")
    app.run(debug=True, host='0.0.0.0', port=5000)