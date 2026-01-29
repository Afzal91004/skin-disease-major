from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    age = db.Column(db.String(16))
    gender = db.Column(db.String(16))

class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    symptom_duration = db.Column(db.String(128))
    previous_treatment = db.Column(db.String(128))
    pain_level = db.Column(db.String(8))
    affected_area = db.Column(db.String(128))
    symptoms = db.Column(db.String(256))

class DiagnosisResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    prediction = db.Column(db.String(128))
    confidence = db.Column(db.Float)
    model = db.Column(db.String(32))
    timestamp = db.Column(db.String(64))
