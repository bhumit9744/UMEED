# Backend/services/visit_service.py

import uuid
from app.config.supabase_client import supabase
from Backend.services.triage_service import triage_predict


def split_sections(data):
    vitals_keys = [
        "systolic_bp", "diastolic_bp",
        "body_temperature", "blood_sugar",
        "weight"
    ]

    symptom_keys = [
        "headache", "blurred_vision", "abdominal_pain",
        "breathlessness", "persistent_cough",
        "diarrhea", "vomiting", "lethargy",
        "convulsions", "chest_pain", "weight_loss",
        "fever_symptom", "edema"
    ]

    compliance_keys = [
        "missed_followups",
        "immunization_complete"
    ]

    vitals = {k: data.get(k) for k in vitals_keys if k in data}
    symptoms = {k: data.get(k) for k in symptom_keys if k in data}
    compliance = {k: data.get(k) for k in compliance_keys if k in data}

    return vitals, symptoms, compliance


def save_visit(patient_data, asha_id, member_id):

    # 1️⃣ Run ML
    triage_result = triage_predict(patient_data)

    # 2️⃣ Split sections
    vitals, symptoms, compliance = split_sections(patient_data)

    # 3️⃣ Prepare DB record
    visit_record = {
        "member_id": member_id,
        "asha_id": asha_id,
        "visit_type": "home_visit",
        "program_tag": "umeed_triage",

        "vitals": vitals,
        "symptoms": symptoms,
        "compliance": compliance,

        "risk_class": triage_result["risk_class"],
        "risk_label": triage_result["risk_label"],
        "priority_score": triage_result["priority_score"],
        "referral_flag": triage_result["risk_class"] == 2,
        "override_triggered": triage_result["override_triggered"],

        "prob_low": triage_result["probabilities"]["low"],
        "prob_moderate": triage_result["probabilities"]["moderate"],
        "prob_high": triage_result["probabilities"]["high"],

        "visit_data": patient_data
    }

    # 4️⃣ Insert into Supabase
    response = supabase.table("visits").insert(visit_record).execute()

    return {
        "triage_result": triage_result,
        "db_response": response.data
    }