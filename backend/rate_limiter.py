import time
from collections import defaultdict, deque
from functools import wraps
from flask import request, jsonify
import threading

class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(deque)
        self.lock = threading.Lock()
    
    def is_allowed(self, key, limit=10, window=60):
        """
        Check if request is allowed based on rate limiting
        
        Args:
            key: Identifier for the client (IP address)
            limit: Maximum number of requests allowed
            window: Time window in seconds
        
        Returns:
            bool: True if request is allowed, False otherwise
        """
        now = time.time()
        
        with self.lock:
            # Clean old requests outside the window
            while self.requests[key] and self.requests[key][0] <= now - window:
                self.requests[key].popleft()
            
            # Check if limit is exceeded
            if len(self.requests[key]) >= limit:
                return False
            
            # Add current request
            self.requests[key].append(now)
            return True

# Global rate limiter instance
rate_limiter = RateLimiter()

def rate_limit(limit=10, window=60):
    """
    Decorator for rate limiting endpoints
    
    Args:
        limit: Maximum number of requests allowed
        window: Time window in seconds
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Use IP address as key
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            
            if not rate_limiter.is_allowed(client_ip, limit, window):
                return jsonify({"error": "Trop de requêtes"}), 429
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator