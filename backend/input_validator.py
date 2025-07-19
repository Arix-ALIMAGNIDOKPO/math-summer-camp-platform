import re
from typing import Dict, Any, List
from flask import jsonify

class InputValidator:
    """Input validation and sanitization utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email or len(email) > 254:
            return False
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        if not phone:
            return False
        
        # Remove spaces and special characters
        clean_phone = re.sub(r'[^\d+]', '', phone)
        
        # Check if it's a valid format (8-15 digits, optionally starting with +)
        pattern = r'^\+?[0-9]{8,15}$'
        return bool(re.match(pattern, clean_phone))
    
    @staticmethod
    def sanitize_string(text: str, max_length: int = 1000) -> str:
        """Sanitize string input"""
        if not isinstance(text, str):
            return ""
        
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\'\x00-\x1f\x7f-\x9f]', '', text)
        
        # Trim whitespace and limit length
        sanitized = sanitized.strip()[:max_length]
        
        return sanitized
    
    @staticmethod
    def validate_age(age: Any) -> tuple[bool, int]:
        """Validate age input"""
        try:
            age_int = int(age)
            if 14 <= age_int <= 18:
                return True, age_int
            return False, 0
        except (ValueError, TypeError):
            return False, 0
    
    @staticmethod
    def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> tuple[bool, str]:
        """Validate that all required fields are present and not empty"""
        for field in required_fields:
            if field not in data or not data[field] or (isinstance(data[field], str) and not data[field].strip()):
                return False, f"Le champ {field} est requis"
        return True, ""
    
    @staticmethod
    def validate_student_data(data: Dict[str, Any]) -> tuple[bool, str, Dict[str, Any]]:
        """Validate and sanitize student registration data"""
        required_fields = ['prenom', 'nom', 'email', 'telephone', 'age', 'niveau', 'ecole', 'ville', 'departement', 'commune', 'motivation']
        
        # Check required fields
        is_valid, error_msg = InputValidator.validate_required_fields(data, required_fields)
        if not is_valid:
            return False, error_msg, {}
        
        # Validate email
        if not InputValidator.validate_email(data['email']):
            return False, "Format d'email invalide", {}
        
        # Validate phone
        if not InputValidator.validate_phone(data['telephone']):
            return False, "Format de téléphone invalide", {}
        
        # Validate age
        age_valid, age_value = InputValidator.validate_age(data['age'])
        if not age_valid:
            return False, "L'âge doit être entre 14 et 18 ans", {}
        
        # Validate niveau
        valid_niveaux = ['quatrieme', 'troisieme', 'seconde', 'premiere', 'terminale']
        if data['niveau'] not in valid_niveaux:
            return False, "Niveau scolaire invalide", {}
        
        # Sanitize string fields
        sanitized_data = {}
        string_fields = ['prenom', 'nom', 'niveau', 'ecole', 'ville', 'departement', 'commune']
        for field in string_fields:
            sanitized_data[field] = InputValidator.sanitize_string(data[field], 100)
        
        # Special handling for motivation (longer text)
        sanitized_data['motivation'] = InputValidator.sanitize_string(data['motivation'], 2000)
        
        # Email and phone (already validated)
        sanitized_data['email'] = data['email'].lower().strip()
        sanitized_data['telephone'] = data['telephone'].strip()
        sanitized_data['age'] = age_value
        
        return True, "", sanitized_data
    
    @staticmethod
    def validate_contact_data(data: Dict[str, Any]) -> tuple[bool, str, Dict[str, Any]]:
        """Validate and sanitize contact form data"""
        required_fields = ['name', 'email', 'message', 'interest']
        
        # Check required fields
        is_valid, error_msg = InputValidator.validate_required_fields(data, required_fields)
        if not is_valid:
            return False, error_msg, {}
        
        # Validate email
        if not InputValidator.validate_email(data['email']):
            return False, "Format d'email invalide", {}
        
        # Validate phone if provided
        if data.get('phone') and not InputValidator.validate_phone(data['phone']):
            return False, "Format de téléphone invalide", {}
        
        # Validate interest
        valid_interests = ['participant', 'parent', 'intervenant', 'partenaire']
        if data['interest'] not in valid_interests:
            return False, "Type d'intérêt invalide", {}
        
        # Sanitize data
        sanitized_data = {
            'name': InputValidator.sanitize_string(data['name'], 100),
            'email': data['email'].lower().strip(),
            'phone': data.get('phone', '').strip(),
            'interest': data['interest'],
            'message': InputValidator.sanitize_string(data['message'], 2000)
        }
        
        return True, "", sanitized_data