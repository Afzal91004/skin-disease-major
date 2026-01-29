import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import base64
import os
import secrets
from io import BytesIO
from PIL import Image
from datetime import datetime, timedelta
import logging
from werkzeug.utils import secure_filename
from database import init_database, save_diagnosis_to_db, get_user_history_from_db, clear_user_history_from_db
import json
from pathlib import Path



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask App
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# FIXED: Proper CORS configuration
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
TEMP_FOLDER = 'static/temp'
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Class labels - Fixed order matching your trained models
disease_classes = [
    'Bacterial Infections - Cellulitis',
    'Bacterial Infections - Impetigo',
    'Fungal Infections - Athlete\'s Foot',
    'Fungal Infections - Nail Fungus',
    'Fungal Infections - Ringworm',
    'Parasitic Infections - Cutaneous Larva Migrans',
    'Viral Infections - Chickenpox',
    'Viral Infections - Shingles',
    'Normal',
]

# Enhanced treatment guide with detailed information
treatment_guide = {
    "Bacterial Infections - Cellulitis": {
        "Description": "A bacterial skin infection causing redness, swelling, and warmth. Can spread rapidly if untreated.",
        "Treatment": [
            "Oral antibiotics (cephalexin 500mg or dicloxacillin 250mg every 6 hours)",
            "Elevate affected area above heart level when possible",
            "Apply warm, moist compresses 3-4 times daily",
            "Pain relievers: ibuprofen 400mg or acetaminophen 500mg as needed",
            "Keep area clean and dry between treatments"
        ],
        "Consult": "Yes – see doctor within 24 hours if symptoms worsen or spread",
        "severity": "moderate",
        "contagious": False
    },
    "Bacterial Infections - Impetigo": {
        "Description": "Highly contagious bacterial infection causing red sores and honey-crusted blisters.",
        "Treatment": [
            "Topical mupirocin ointment 2% applied 3 times daily",
            "Oral antibiotics if widespread: cephalexin or clindamycin",
            "Gently remove crusts with warm water and soap",
            "Avoid touching or scratching lesions",
            "Wash hands frequently and avoid sharing personal items"
        ],
        "Consult": "Recommended for all cases - highly contagious",
        "severity": "mild-moderate",
        "contagious": True
    },
    "Fungal Infections - Athlete's Foot": {
        "Description": "Fungal infection between toes causing itching, scaling, and sometimes blisters.",
        "Treatment": [
            "Topical antifungals: clotrimazole 1% or terbinafine 1% cream twice daily",
            "Keep feet clean and thoroughly dry, especially between toes",
            "Change socks daily, use moisture-wicking materials",
            "Alternate shoes daily to allow drying",
            "Use antifungal powder in shoes and socks"
        ],
        "Consult": "If symptoms persist after 4 weeks of treatment",
        "severity": "mild",
        "contagious": True
    },
    "Fungal Infections - Nail Fungus": {
        "Description": "Fungal infection causing nail discoloration, thickening, and brittleness.",
        "Treatment": [
            "Oral antifungals: terbinafine 250mg daily or itraconazole pulse therapy",
            "Topical antifungal lacquer: ciclopirox applied daily",
            "Keep nails short and file down thick areas",
            "Wear breathable footwear and moisture-wicking socks",
            "Disinfect nail tools after each use"
        ],
        "Consult": "Yes – oral medications require medical supervision",
        "severity": "moderate",
        "contagious": True
    },
    "Fungal Infections - Ringworm": {
        "Description": "Contagious fungal infection appearing as circular, scaly patches with clear centers.",
        "Treatment": [
            "Topical antifungals: clotrimazole, miconazole, or terbinafine twice daily",
            "Continue treatment 2-4 weeks beyond visible clearing",
            "Keep affected area clean and dry",
            "Wash bedding and clothing in hot water",
            "Avoid sharing personal items like towels or clothing"
        ],
        "Consult": "If lesions spread, become infected, or don't improve in 2 weeks",
        "severity": "mild-moderate",
        "contagious": True
    },
    "Parasitic Infections - Cutaneous Larva Migrans": {
        "Description": "Parasitic infection from hookworm larvae creating serpentine, itchy tracks under skin.",
        "Treatment": [
            "Oral albendazole 400mg daily for 3 days OR ivermectin single dose",
            "Topical thiabendazole for localized lesions",
            "Antihistamines for itching: cetirizine 10mg daily",
            "Topical corticosteroids for inflammation",
            "Avoid walking barefoot on beaches or contaminated soil"
        ],
        "Consult": "Essential – requires prescription antiparasitic medication",
        "severity": "moderate",
        "contagious": False
    },
    "Viral Infections - Chickenpox": {
        "Description": "Highly contagious viral infection causing itchy, fluid-filled blisters all over the body.",
        "Treatment": [
            "Antihistamines: diphenhydramine or cetirizine for itching",
            "Calamine lotion applied to lesions 3-4 times daily",
            "Cool oatmeal baths for soothing relief",
            "Acetaminophen for fever (avoid aspirin in children)",
            "Antiviral acyclovir if started within 24 hours of rash onset"
        ],
        "Consult": "Yes – especially for adults, pregnant women, or immunocompromised",
        "severity": "moderate",
        "contagious": True
    },
    "Viral Infections - Shingles": {
        "Description": "Painful skin rash caused by reactivation of varicella-zoster virus along nerve pathways.",
        "Treatment": [
            "Antiviral medications: acyclovir, valacyclovir, or famciclovir within 72 hours",
            "Pain management: gabapentin or pregabalin for nerve pain",
            "Topical anesthetics: lidocaine patches or capsaicin cream",
            "Cool, wet compresses for 15-20 minutes several times daily",
            "NSAIDs for inflammation and pain relief"
        ],
        "Consult": "Yes – early antiviral treatment prevents complications",
        "severity": "moderate-severe",
        "contagious": True
    },
    "Normal": {
        "Description": "Skin appears healthy with no signs of infection or disease.",
        "Treatment": [
            "Maintain regular hygiene with gentle cleansers",
            "Use broad-spectrum sunscreen SPF 30+ daily",
            "Moisturize regularly with fragrance-free products",
            "Stay hydrated with adequate water intake",
            "Regular skin self-examinations for changes"
        ],
        "Consult": "Not necessary for routine care",
        "severity": "none",
        "contagious": False
    }
}

# Global variables for models
mobilenet = None
inceptionv3 = None
DIAGNOSIS_DATA_FILE = 'diagnosis_history.json'

def load_diagnosis_history():
    """Load diagnosis history from JSON file"""
    if not os.path.exists(DIAGNOSIS_DATA_FILE):
        return []
    
    try:
        with open(DIAGNOSIS_DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_diagnosis_record(diagnosis_record):
    """Save a single diagnosis record to JSON file"""
    try:
        # Load existing history
        history = load_diagnosis_history()
        
        # Add new record with auto-increment ID
        max_id = max([record.get('id', 0) for record in history], default=0)
        diagnosis_record['id'] = max_id + 1
        
        # Add to beginning of list (most recent first)
        history.insert(0, diagnosis_record)
        
        # Keep only last 100 records to prevent file from getting too large
        history = history[:100]
        
        # Save back to file
        with open(DIAGNOSIS_DATA_FILE, 'w') as f:
            json.dump(history, f, indent=2, default=str)
            
        logger.info(f"Diagnosis record saved: ID {diagnosis_record['id']}")
        
    except Exception as e:
        logger.error(f"Error saving diagnosis record: {e}")

def get_user_diagnosis_history(user_id):
    """Get diagnosis history for a specific user"""
    try:
        all_history = load_diagnosis_history()
        user_history = [record for record in all_history if record.get('user_id') == str(user_id)]
        return sorted(user_history, key=lambda x: x.get('created_at', ''), reverse=True)
    except Exception as e:
        logger.error(f"Error loading user history: {e}")
        return []

def load_models():
    """Load ML models with comprehensive error handling"""
    global mobilenet, inceptionv3
    
    try:
        path = 'models/MobileNet.h5' if os.path.exists('models/MobileNet.h5') else 'MobileNet.h5'
        
        if os.path.exists(path):
            mobilenet = load_model(path, compile=False)
            logger.info("✅ MobileNet FULL model loaded!")
        else:
            logger.warning("❌ MobileNet.h5 not found")
    except Exception as e:
        logger.error(f"❌ Error loading MobileNet: {e}")
        mobilenet = None

    try:
        path = 'models/InceptionV3.h5' if os.path.exists('models/InceptionV3.h5') else 'InceptionV3.h5'
        
        if os.path.exists(path):
            inceptionv3 = load_model(path, compile=False)
            logger.info("✅ InceptionV3 FULL model loaded!")
        else:
            logger.warning("❌ InceptionV3.h5 not found")
    except Exception as e:
        logger.error(f"❌ Error loading InceptionV3: {e}")
        inceptionv3 = None

def allowed_file(filename):
    """Check if uploaded file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image_for_prediction(img_path):
    """Standardized image preprocessing"""
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise

def predict_with_model(model, img_array, model_name):
    """Generic prediction function with confidence"""
    try:
        predictions = model.predict(img_array, verbose=0)
        predicted_class = np.argmax(predictions, axis=1)[0]
        confidence = float(predictions[0][predicted_class]) * 100
        
        return disease_classes[predicted_class], confidence, predictions[0].tolist()
    except Exception as e:
        logger.error(f"Prediction error with {model_name}: {e}")
        raise

def cleanup_temp_files():
    """Clean up old temporary files"""
    try:
        for filename in os.listdir(TEMP_FOLDER):
            filepath = os.path.join(TEMP_FOLDER, filename)
            if os.path.isfile(filepath):
                file_age = datetime.now().timestamp() - os.path.getctime(filepath)
                if file_age > 3600:  # Remove files older than 1 hour
                    os.remove(filepath)
    except Exception as e:
        logger.error(f"Cleanup error: {e}")

def initialize_app():
    """Initialize application - FIXED for newer Flask versions"""
    with app.app_context():
        logger.info("🚀 Starting Skin Disease Detection System...")
        init_database()  # Initialize database
        load_models()
        cleanup_temp_files()
        logger.info(f"📊 Models loaded: MobileNet={mobilenet is not None}, InceptionV3={inceptionv3 is not None}")
        logger.info("✅ System ready!")

# ============ CORE API ENDPOINTS ============

@app.route("/api/predict", methods=['POST'])
def api_predict():
    """Enhanced prediction endpoint with real data storage - FIXED"""
    prediction = None
    confidence = 0
    all_predictions = []
    treatment_info = {}
    model_name = "MobileNet"
    
    try:
        # Input validation
        if request.content_type.startswith('application/json'):
            data = request.get_json()
            if not data or 'image' not in data or 'model' not in data:
                return jsonify({
                    'success': False,
                    'error': 'Missing required fields: image and model'
                }), 400

            image_data = data['image']
            model_name = data['model']
            
            # Process base64 image
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            try:
                img_data = base64.b64decode(image_data)
                img = Image.open(BytesIO(img_data))
                
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Validate image size
                if len(img_data) > MAX_FILE_SIZE:
                    return jsonify({
                        'success': False,
                        'error': 'Image too large. Maximum size is 16MB.'
                    }), 400
                
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Invalid image data: {str(e)}'
                }), 400
        
        else:
            # Handle form data upload
            if 'image' not in request.files:
                return jsonify({
                    'success': False,
                    'error': 'No image file provided'
                }), 400
            
            file = request.files['image']
            model_name = request.form.get('model', 'MobileNet')
            
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'error': 'No file selected'
                }), 400
            
            if not allowed_file(file.filename):
                return jsonify({
                    'success': False,
                    'error': 'Invalid file type. Allowed types: ' + ', '.join(ALLOWED_EXTENSIONS)
                }), 400
            
            img = Image.open(file.stream)
            if img.mode != 'RGB':
                img = img.convert('RGB')

        # Save temporary image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        temp_filename = f"temp_{model_name}_{timestamp}.jpg"
        img_path = os.path.join(TEMP_FOLDER, temp_filename)
        img.save(img_path, 'JPEG', quality=95)

        # Validate model selection
        if model_name == 'InceptionV3' and inceptionv3 is None:
            return jsonify({
                'success': False,
                'error': 'InceptionV3 model not available'
            }), 503
        elif model_name == 'MobileNet' and mobilenet is None:
            return jsonify({
                'success': False,
                'error': 'MobileNet model not available'
            }), 503
        elif model_name not in ['InceptionV3', 'MobileNet']:
            return jsonify({
                'success': False,
                'error': 'Invalid model. Choose MobileNet or InceptionV3'
            }), 400

        # Process image and predict
        img_array = process_image_for_prediction(img_path)
        
        if model_name == 'InceptionV3':
            prediction, confidence, all_predictions = predict_with_model(inceptionv3, img_array, 'InceptionV3')
        else:
            prediction, confidence, all_predictions = predict_with_model(mobilenet, img_array, 'MobileNet')

        # Get treatment information
        treatment_info = treatment_guide.get(prediction, {
            "Description": "No information available for this condition.",
            "Treatment": ["Consult a healthcare professional for proper diagnosis"],
            "Consult": "Recommended",
            "severity": "unknown",
            "contagious": False
        })

        # ========== SAVE REAL DATA TO JSON FILE (Optional) ==========
        try:
            # Get user info from session
            user = session.get('user', {})
            user_id = user.get('id')
            
            if not user_id:
                # If no user in session, create anonymous user ID
                user_id = f"anonymous_{abs(hash(request.remote_addr))}"
            
            # Create diagnosis record
            diagnosis_record = {
                'user_id': str(user_id),
                'user_email': user.get('email', 'anonymous'),
                'prediction': prediction,
                'confidence': round(confidence, 2),
                'model_used': model_name,
                'treatment': treatment_info,
                'all_predictions': [
                    {
                        'class': disease_classes[i],
                        'probability': round(prob * 100, 2)
                    }
                    for i, prob in enumerate(all_predictions)
                ],
                'created_at': datetime.now().isoformat(),
                'timestamp': datetime.now().isoformat()
            }
            
            # Save diagnosis record (this function we'll define below)
            save_diagnosis_record(diagnosis_record)
            
        except Exception as save_error:
            # Don't let saving error break the prediction
            logger.error(f"Error saving diagnosis record: {save_error}")

        # Cleanup temp file
        try:
            os.remove(img_path)
        except:
            pass

        # Return comprehensive response
        response_data = {
            'success': True,
            'prediction': prediction,
            'confidence': round(confidence, 2),
            'model_used': model_name,
            'treatment': treatment_info,
            'all_predictions': [
                {
                    'class': disease_classes[i],
                    'probability': round(prob * 100, 2)
                }
                for i, prob in enumerate(all_predictions)
            ],
            'timestamp': datetime.now().isoformat(),
            'disclaimer': 'This is an AI prediction for educational purposes only. Always consult healthcare professionals for medical advice.'
        }

        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Prediction API error: {e}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500


# Updated history endpoint
@app.route("/api/history", methods=['GET', 'OPTIONS'])
def get_diagnosis_history():
    """Get user's REAL diagnosis history"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        # Get user from session
        user = session.get('user', {})
        user_id = user.get('id')
        
        if not user_id:
            # If no user in session, try anonymous user
            user_id = f"anonymous_{abs(hash(request.remote_addr))}"
        
        # Get real diagnosis history for this user
        history = get_user_diagnosis_history(user_id)
        
        logger.info(f"Retrieved {len(history)} diagnosis records for user {user_id}")
        
        return jsonify({
            'success': True,
            'history': history,
            'count': len(history)
        })
        
    except Exception as e:
        logger.error(f"History error: {e}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'history': [],
            'count': 0
        }), 500

# Clear history endpoint
@app.route("/api/history/clear", methods=['POST', 'OPTIONS'])
def clear_diagnosis_history():
    """Clear user's diagnosis history from database"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        user = session.get('user', {})
        user_id = user.get('id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'User not found'}), 400
        
        deleted_count = clear_user_history_from_db(str(user_id))
        
        return jsonify({
            'success': True,
            'message': f'Cleared {deleted_count} diagnosis records',
            'deleted_count': deleted_count
        })
        
    except Exception as e:
        logger.error(f"Clear history error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/performance", methods=['GET'])
def get_performance():
    """Get detailed model performance metrics"""
    try:
        return jsonify({
            'success': True,
            'models': [
                {
                    'name': 'MobileNet',
                    'accuracy': {
                        'train': '100%',
                        'test': '97%'
                    },
                    'description': 'Lightweight, fast processing, highly accurate',
                    'parameters': '3.2M',
                    'inference_time': '~50ms',
                    'available': mobilenet is not None,
                    'recommended_for': 'Quick diagnosis, mobile deployment'
                },
                {
                    'name': 'InceptionV3',
                    'accuracy': {
                        'train': '97%',
                        'test': '93%'
                    },
                    'description': 'Deep architecture, comprehensive feature extraction',
                    'parameters': '23.8M',
                    'inference_time': '~200ms',
                    'available': inceptionv3 is not None,
                    'recommended_for': 'Detailed analysis, research applications'
                }
            ],
            'dataset_info': {
                'total_images': 1275,
                'training_images': 983,
                'test_images': 292,
                'classes': len(disease_classes),
                'class_distribution': 'Balanced across 9 conditions'
            }
        })
    except Exception as e:
        logger.error(f"Performance API error: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to get performance data: {str(e)}'
        }), 500

@app.route("/api/diseases", methods=['GET'])
def get_diseases():
    """Get comprehensive disease information"""
    disease_info = []
    for disease in disease_classes:
        info = treatment_guide.get(disease, {})
        disease_info.append({
            'name': disease,
            'description': info.get('Description', 'No description available'),
            'severity': info.get('severity', 'unknown'),
            'contagious': info.get('contagious', False),
            'category': disease.split(' - ')[0] if ' - ' in disease else 'General'
        })
    
    return jsonify({
        'success': True,
        'diseases': disease_info,
        'count': len(disease_classes),
        'categories': {
            'Bacterial Infections': 2,
            'Fungal Infections': 3,
            'Parasitic Infections': 1,
            'Viral Infections': 2,
            'Normal': 1
        }
    })

@app.route("/api/health", methods=['GET'])
def health_check():
    """Comprehensive system health check"""
    return jsonify({
        'success': True,
        'status': 'System operational',
        'version': '2.0.0',
        'models_loaded': {
            'mobilenet': mobilenet is not None,
            'inceptionv3': inceptionv3 is not None
        },
        'system_info': {
            'tensorflow_version': tf.__version__,
            'upload_folder_exists': os.path.exists(UPLOAD_FOLDER),
            'temp_folder_exists': os.path.exists(TEMP_FOLDER),
            'max_file_size_MB': MAX_FILE_SIZE // (1024 * 1024)
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route("/api/models", methods=['GET', 'OPTIONS'])
def get_models():
    """Get available AI models"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        return jsonify({
            'success': True,
            'models': [
                {
                    'name': 'MobileNet',
                    'description': 'Lightweight, fast processing',
                    'accuracy': 97.2,
                    'speed': 'Fast',
                    'available': mobilenet is not None
                },
                {
                    'name': 'InceptionV3', 
                    'description': 'Deep architecture, high accuracy',
                    'accuracy': 93.8,
                    'speed': 'Medium',
                    'available': inceptionv3 is not None
                }
            ]
        })
    except Exception as e:
        logger.error(f"Models error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============ AUTHENTICATION ENDPOINTS ============

@app.route("/api/register", methods=['POST', 'OPTIONS'])
def register():
    """User registration endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        # Mock registration logic (replace with real database logic)
        user_id = abs(hash(data['email'])) % 10000  # Simple ID generation
        
        # Store in session for demo purposes
        session['user'] = {
            'id': user_id,
            'first_name': data['first_name'],
            'last_name': data['last_name'], 
            'email': data['email'],
            'is_onboarding_complete': False,
            'created_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'access_token': f'mock-token-{user_id}-{datetime.now().timestamp()}',
            'user': session['user']
        })
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/login", methods=['POST', 'OPTIONS'])  
def login():
    """User login endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        # Mock login logic (replace with real authentication)
        user_id = abs(hash(email)) % 10000
        
        # Store in session
        session['user'] = {
            'id': user_id,
            'first_name': 'User',
            'last_name': email.split('@')[0].title(), 
            'email': email,
            'is_onboarding_complete': True,
            'last_login': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': f'mock-token-{user_id}-{datetime.now().timestamp()}',
            'user': session['user']
        })
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/logout", methods=['POST', 'OPTIONS'])
def logout():
    """User logout endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Clear session data
        session.clear()
        
        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        })
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============ USER PROFILE ENDPOINTS - FIXED WITH PUT SUPPORT ============

@app.route("/api/profile", methods=['GET', 'POST', 'PUT', 'OPTIONS'])
def user_profile():
    """Get or update user profile - FIXED: Added PUT method support"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if request.method == 'GET':
            # Return user from session or mock data
            user = session.get('user', {
                'id': 1,
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'user@example.com',
                'phone': '+1234567890',
                'date_of_birth': '1990-01-01',
                'is_onboarding_complete': True,
                'profile_complete': 85
            })
            
            return jsonify({
                'success': True,
                'user': user
            })
        
        elif request.method in ['POST', 'PUT']:  # FIXED: Handle both POST and PUT
            data = request.get_json()
            
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            # Update user in session
            if 'user' in session:
                session['user'].update({
                    'first_name': data.get('first_name', session['user'].get('first_name')),
                    'last_name': data.get('last_name', session['user'].get('last_name')),
                    'email': data.get('email', session['user'].get('email')),
                    'phone': data.get('phone'),
                    'date_of_birth': data.get('date_of_birth'),
                    'age': data.get('age'),
                    'gender': data.get('gender'),
                    'updated_at': datetime.now().isoformat()
                })
                
                return jsonify({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'user': session['user']
                })
            else:
                # Create new user if not in session
                user_id = abs(hash(data.get('email', 'default@email.com'))) % 10000
                session['user'] = {
                    'id': user_id,
                    'first_name': data.get('first_name'),
                    'last_name': data.get('last_name'),
                    'email': data.get('email'),
                    'phone': data.get('phone'),
                    'date_of_birth': data.get('date_of_birth'),
                    'age': data.get('age'),
                    'gender': data.get('gender'),
                    'is_onboarding_complete': True,
                    'created_at': datetime.now().isoformat()
                }
                
                return jsonify({
                    'success': True,
                    'message': 'Profile created successfully',
                    'user': session['user']
                })
            
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/onboarding", methods=['POST', 'PUT', 'OPTIONS'])
def complete_onboarding():
    """Complete user onboarding process - FIXED: Added PUT method support"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Store onboarding data in session
        session['onboarding_data'] = {
            'medical_history': data.get('medical_history'),
            'allergies': data.get('allergies'), 
            'current_medications': data.get('current_medications'),
            'emergency_contact': data.get('emergency_contact'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'age': data.get('age'),
            'gender': data.get('gender'),
            'completed_at': datetime.now().isoformat()
        }
        
        # Update user's onboarding status
        if 'user' in session:
            session['user'].update({
                'is_onboarding_complete': True,
                'onboarding_completed_at': datetime.now().isoformat(),
                'first_name': data.get('first_name', session['user'].get('first_name')),
                'last_name': data.get('last_name', session['user'].get('last_name')),
                'age': data.get('age'),
                'gender': data.get('gender')
            })
        else:
            # Create user if not exists
            user_id = abs(hash(data.get('email', 'default@email.com'))) % 10000
            session['user'] = {
                'id': user_id,
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'email': data.get('email', 'user@example.com'),
                'age': data.get('age'),
                'gender': data.get('gender'),
                'is_onboarding_complete': True,
                'onboarding_completed_at': datetime.now().isoformat()
            }
        
        return jsonify({
            'success': True,
            'message': 'Onboarding completed successfully',
            'user': session.get('user', {'is_onboarding_complete': True})
        })
    except Exception as e:
        logger.error(f"Onboarding error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/questionnaire", methods=['POST', 'PUT', 'OPTIONS'])
def save_questionnaire():
    """Save health questionnaire data - FIXED: Added PUT method support"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Store questionnaire data
        questionnaire_data = {
            'symptom_duration': data.get('symptom_duration'),
            'pain_level': data.get('pain_level'),
            'affected_area': data.get('affected_area'),
            'symptoms': data.get('symptoms', []),
            'previous_treatment': data.get('previous_treatment'),
            'submitted_at': datetime.now().isoformat()
        }
        
        session['questionnaire_data'] = questionnaire_data
        
        return jsonify({
            'success': True,
            'message': 'Questionnaire saved successfully',
            'data': questionnaire_data
        })
    except Exception as e:
        logger.error(f"Questionnaire error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/settings", methods=['GET', 'POST', 'PUT', 'OPTIONS'])
def user_settings():
    """Get or update user settings - FIXED: Added PUT method support"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if request.method == 'GET':
            settings = session.get('user_settings', {
                'notifications': {
                    'email': True,
                    'push': False,
                    'reminders': True
                },
                'privacy': {
                    'data_sharing': False,
                    'analytics': True
                },
                'preferences': {
                    'language': 'en',
                    'theme': 'light',
                    'default_model': 'MobileNet'
                }
            })
            
            return jsonify({
                'success': True,
                'settings': settings
            })
        
        elif request.method in ['POST', 'PUT']:  # FIXED: Handle both POST and PUT
            data = request.get_json()
            
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
            session['user_settings'] = data
            
            return jsonify({
                'success': True,
                'message': 'Settings updated successfully',
                'settings': data
            })
            
    except Exception as e:
        logger.error(f"Settings error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============ PASSWORD MANAGEMENT ============

@app.route("/api/forgot-password", methods=['POST', 'OPTIONS'])
def forgot_password():
    """Request password reset"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        
        # Mock password reset (replace with real email sending)
        reset_token = f'reset-token-{abs(hash(email))}-{datetime.now().timestamp()}'
        
        return jsonify({
            'success': True,
            'message': 'Password reset email sent',
            'reset_token': reset_token  # Don't include in production!
        })
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/reset-password", methods=['POST', 'OPTIONS'])
def reset_password():
    """Reset user password"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            return jsonify({'success': False, 'error': 'Token and new password required'}), 400
        
        # Mock password reset validation
        return jsonify({
            'success': True,
            'message': 'Password reset successfully'
        })
    except Exception as e:
        logger.error(f"Reset password error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/change-password", methods=['POST', 'OPTIONS'])
def change_password():
    """Change user password"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'success': False, 'error': 'Current and new password required'}), 400
        
        # Mock password change
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        })
    except Exception as e:
        logger.error(f"Change password error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============ UTILITY ENDPOINTS ============

@app.route("/api/feedback", methods=['POST', 'OPTIONS'])
def submit_feedback():
    """Submit user feedback"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        feedback_data = {
            'rating': data.get('rating'),
            'comment': data.get('comment'),
            'category': data.get('category', 'general'),
            'diagnosis_id': data.get('diagnosis_id'),
            'submitted_at': datetime.now().isoformat()
        }
        
        # Store feedback (replace with database)
        logger.info(f"Feedback received: {feedback_data}")
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully'
        })
    except Exception as e:
        logger.error(f"Feedback error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route("/api/contact", methods=['POST', 'OPTIONS'])
def contact_support():
    """Contact support"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        contact_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'submitted_at': datetime.now().isoformat()
        }
        
        # Process contact request (replace with email sending)
        logger.info(f"Contact request: {contact_data}")
        
        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully'
        })
    except Exception as e:
        logger.error(f"Contact error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============ BASIC WEB ROUTES ============

@app.route("/")
def home():
    """API Status page"""
    return """
    <h1>🏥 Skin Disease Detection API</h1>
    <p><strong>Status:</strong> ✅ Running</p>
    <p><strong>Version:</strong> 2.0.0</p>
    <p><strong>Models:</strong> MobileNet & InceptionV3</p>
    <h2>Quick Links:</h2>
    <ul>
        <li><a href="/api/health">System Health Check</a></li>
        <li><a href="/api/diseases">Disease Information</a></li>
        <li><a href="/api/performance">Model Performance</a></li>
    </ul>
    <p><em>Frontend: <a href="http://localhost:3000">http://localhost:3000</a></em></p>
    """

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'message': 'The requested resource does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

@app.errorhandler(413)
def file_too_large(error):
    return jsonify({
        'success': False,
        'error': 'File too large',
        'message': f'Maximum file size is {MAX_FILE_SIZE // (1024 * 1024)}MB'
    }), 413

# ============ INITIALIZATION FUNCTION ============

def initialize_app():
    """Initialize application - FIXED for newer Flask versions"""
    with app.app_context():
        logger.info("🚀 Starting Skin Disease Detection System...")
        load_models()
        cleanup_temp_files()
        logger.info(f"📊 Models loaded: MobileNet={mobilenet is not None}, InceptionV3={inceptionv3 is not None}")
        logger.info("✅ System ready!")

# ============ STARTUP ============

if __name__ == '__main__':
    print("🚀 Starting COMPLETELY FIXED Skin Disease Detection API...")
    
    # Initialize app before running
    initialize_app()
    
    print(f"📊 Models Status: MobileNet={mobilenet is not None}, InceptionV3={inceptionv3 is not None}")
    print("🌐 Server starting on http://localhost:5000")
    print("🔗 API Health Check: http://localhost:5000/api/health")
    print("📱 React Integration: CORS enabled for localhost:3000")
    print("📋 Available endpoints:")
    print("   • /api/predict      - AI prediction")  
    print("   • /api/register     - User registration")
    print("   • /api/login        - User login")
    print("   • /api/profile      - User profile (GET/POST/PUT)")
    print("   • /api/onboarding   - Complete onboarding (POST/PUT)")
    print("   • /api/questionnaire - Health questionnaire (POST/PUT)")
    print("   • /api/settings     - User settings (GET/POST/PUT)")
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        threaded=True
    )