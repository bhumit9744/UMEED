# ==========================================
# UMEED UNIFIED TRIAGE SYSTEM (ROBUST)
# ==========================================

import os
import joblib
import numpy as np
from Backend.services.priority_service import calculate_priority

# -----------------------------
# 1️⃣ Load Models
# -----------------------------

# Get the path to the 'Backend' folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define the models path
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load models using the full path
pregnant_model = joblib.load(os.path.join(MODELS_DIR, "pregnant_triage_model.pkl"))
child_model = joblib.load(os.path.join(MODELS_DIR, "child_triage_model.pkl"))
general_model = joblib.load(os.path.join(MODELS_DIR, "general_triage_model.pkl"))

# -----------------------------
# 2️⃣ Strict Feature Lists
# (Must match EXACT training order)
# -----------------------------

PREGNANT_FEATURES = [
    "age", "trimester", "gravida",
    "systolic_bp", "diastolic_bp",
    "body_temperature", "blood_sugar",
    "edema", "headache", "blurred_vision",
    "abdominal_pain", "breathlessness",
    "known_hypertension", "known_diabetes",
    "missed_followups"
]

CHILD_FEATURES = [
    "age_months", "gender", "weight",
    "body_temperature", "persistent_cough",
    "fever_symptom", "diarrhea", "vomiting",
    "lethargy", "convulsions",
    "immunization_complete", "missed_followups"
]

GENERAL_FEATURES = [
    "age", "gender",
    "systolic_bp", "diastolic_bp",
    "blood_sugar", "body_temperature",
    "weight", "chest_pain",
    "breathlessness", "persistent_cough",
    "weight_loss", "fever_symptom",
    "known_diabetes", "known_hypertension",
    "known_tb", "missed_followups"
]

# -----------------------------
# 3️⃣ Safety Override
# -----------------------------

def safety_override(data, predicted_class):

    if data.get("systolic_bp", 0) > 180:
        return 2

    if data.get("blood_sugar", 0) > 350:
        return 2

    if data.get("body_temperature", 0) > 103:
        return 2

    if data.get("convulsions", 0) == 1:
        return 2

    return predicted_class


# -----------------------------
# 4️⃣ Prepare Input Safely
# -----------------------------

def prepare_input(data, feature_list):

    processed = []

    for f in feature_list:
        value = data.get(f, 0)

        try:
            value = float(value)
        except:
            value = 0

        processed.append(value)

    return np.array([processed])


# -----------------------------
# 5️⃣ Model Router
# -----------------------------

def route_model(data):

    if data.get("pregnant_flag", 0) == 1:
        return pregnant_model, PREGNANT_FEATURES, "pregnant"

    if "age_months" in data and data["age_months"] <= 36:
        return child_model, CHILD_FEATURES, "child"

    return general_model, GENERAL_FEATURES, "general"


# -----------------------------
# 6️⃣ Main Prediction Function
# -----------------------------

def triage_predict(patient_data):

    model, feature_list, category = route_model(patient_data)

    input_array = prepare_input(patient_data, feature_list)

    probabilities = model.predict_proba(input_array)[0]
    predicted_class = int(np.argmax(probabilities))

    final_class = safety_override(patient_data, predicted_class)

    override_flag = final_class != predicted_class

    priority_score = calculate_priority(final_class, patient_data)

    risk_map = {0: "Low", 1: "Moderate", 2: "High"}

    recommendation_map = {
        0: "Routine follow-up (30 days)",
        1: "Follow-up within 7 days",
        2: "Immediate PHC Referral"
    }

    response = {
        "category": category,
        "risk_class": final_class,
        "risk_label": risk_map[final_class],
        "priority_score": priority_score,
        "override_triggered": override_flag,
        "probabilities": {
            "low": round(float(probabilities[0]), 3),
            "moderate": round(float(probabilities[1]), 3),
            "high": round(float(probabilities[2]), 3)
        },
        "recommended_action": recommendation_map[final_class]
    }

    return response