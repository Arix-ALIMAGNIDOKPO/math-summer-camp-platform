
# Math Summer Camp - Backend API

Ce répertoire contient le backend Flask pour le Math Summer Camp.

## Installation et configuration locale

1. Créez un environnement virtuel Python (recommandé) :
   ```
   python -m venv venv
   ```

2. Activez l'environnement virtuel :
   - Sur Windows : `venv\Scripts\activate`
   - Sur macOS/Linux : `source venv/bin/activate`

3. Installez les dépendances :
   ```
   pip install -r requirements.txt
   ```

4. Lancez le serveur de développement :
   ```
   python app.py
   ```
   
   Le serveur sera accessible à l'adresse http://localhost:5000

## Déploiement en production

### Option 1 : Déploiement sur un VPS (Virtual Private Server)

1. Connectez-vous à votre serveur via SSH.
2. Clonez ce dépôt sur votre serveur.
3. Installez les dépendances comme indiqué ci-dessus.
4. Utilisez Gunicorn pour exécuter l'application en production :
   ```
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
5. Configurez Nginx comme proxy inverse (recommandé) pour gérer les connexions entrantes.

### Option 2 : Déploiement sur Heroku

1. Créez un compte sur [Heroku](https://heroku.com) si vous n'en avez pas déjà un.
2. Installez la CLI Heroku et connectez-vous.
3. À la racine du projet, créez un fichier `Procfile` avec le contenu :
   ```
   web: gunicorn app:app
   ```
4. Déployez l'application :
   ```
   heroku create math-summer-camp-api
   git push heroku main
   ```

### Option 3 : Utiliser Docker

1. Créez un Dockerfile à la racine du projet avec le contenu suivant :
   ```
   FROM python:3.9-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
   ```

2. Construisez et exécutez l'image Docker :
   ```
   docker build -t math-summer-camp-api .
   docker run -p 5000:5000 math-summer-camp-api
   ```

## API Endpoints

### Vérification de l'état
- `GET /api/health` - Vérifie si l'API fonctionne correctement

### Gestion des inscriptions
- `GET /api/students` - Liste tous les étudiants inscrits
- `POST /api/students` - Inscrit un nouvel étudiant
- `GET /api/students/<student_id>` - Obtient les détails d'un étudiant spécifique
- `PUT /api/students/<student_id>/status` - Met à jour le statut d'un étudiant

## Structure des données

### Étudiant
```json
{
  "id": "STU0001",
  "firstName": "Prénom",
  "lastName": "Nom",
  "email": "email@example.com",
  "phone": "+123456789",
  "age": 16,
  "grade": "Seconde",
  "school": "Lycée Example",
  "parentInfo": {
    "name": "Nom du parent",
    "email": "parent@example.com",
    "phone": "+123456789"
  },
  "registeredAt": "2023-05-15T14:30:00.000Z",
  "status": "pending"
}
```
