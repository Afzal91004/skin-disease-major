# database.py
import sqlite3
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

DATABASE_FILE = 'skinvista.db'

def init_database():
    """Initialize the database with required tables"""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        # Create diagnosis_history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS diagnosis_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                user_email TEXT,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                model_used TEXT NOT NULL,
                treatment TEXT,  -- JSON string
                all_predictions TEXT,  -- JSON string
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                image_path TEXT
            )
        ''')
        
        # Create users table (if you want to store user data)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

def save_diagnosis_to_db(diagnosis_record):
    """Save diagnosis record to database"""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO diagnosis_history 
            (user_id, user_email, prediction, confidence, model_used, treatment, all_predictions, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            diagnosis_record['user_id'],
            diagnosis_record.get('user_email', ''),
            diagnosis_record['prediction'],
            diagnosis_record['confidence'],
            diagnosis_record['model_used'],
            json.dumps(diagnosis_record.get('treatment', {})),
            json.dumps(diagnosis_record.get('all_predictions', [])),
            diagnosis_record['created_at']
        ))
        
        record_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logger.info(f"Diagnosis saved to database with ID: {record_id}")
        return record_id
        
    except Exception as e:
        logger.error(f"Error saving diagnosis to database: {e}")
        return None

def get_user_history_from_db(user_id, limit=50):
    """Get user's diagnosis history from database"""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, user_id, user_email, prediction, confidence, model_used, 
                   treatment, all_predictions, created_at
            FROM diagnosis_history 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        rows = cursor.fetchall()
        conn.close()
        
        history = []
        for row in rows:
            try:
                treatment = json.loads(row[6]) if row[6] else {}
                all_predictions = json.loads(row[7]) if row[7] else []
            except json.JSONDecodeError:
                treatment = {}
                all_predictions = []
            
            history.append({
                'id': row[0],
                'user_id': row[1],
                'user_email': row[2],
                'prediction': row[3],
                'confidence': row[4],
                'model_used': row[5],
                'treatment': treatment,
                'all_predictions': all_predictions,
                'created_at': row[8]
            })
        
        return history
        
    except Exception as e:
        logger.error(f"Error fetching user history: {e}")
        return []

def clear_user_history_from_db(user_id):
    """Clear user's diagnosis history from database"""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM diagnosis_history WHERE user_id = ?', (user_id,))
        deleted_count = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        logger.info(f"Cleared {deleted_count} records for user {user_id}")
        return deleted_count
        
    except Exception as e:
        logger.error(f"Error clearing user history: {e}")
        return 0
