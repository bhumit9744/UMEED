import uuid
from app.config.supabase_client import supabase
from Backend.services.visit_service import save_visit


# ==========================================================
# 🔹 DATABASE SEEDING
# ==========================================================

def seed():
    print("\n--- Seeding Database ---")

    # 1️⃣ Create ASHA
    asha_res = supabase.table("asha_profile").insert({
    "worker_id": str(uuid.uuid4()),   # 🔥 FIX
    "name": "Test Asha",
    "phone": "9999999999",
    "district": "Test District",
    "block": "Test Block",
    "village": "Test Village"
}).execute()

    asha_id = asha_res.data[0]["id"]

    # 2️⃣ Create Family
    family_res = supabase.table("families").insert({
        "asha_id": asha_id,
        "village": "Test Village",
        "address": "Test Address"
    }).execute()

    family_id = family_res.data[0]["id"]

    # 3️⃣ Create Member
    member_res = supabase.table("members").insert({
    "family_id": family_id,
    "name": "Test Member",
    "gender": "female",
    "category": "general"
}).execute()

    member_id = member_res.data[0]["id"]

    print("Seed Successful.")
    return asha_id, member_id


# ==========================================================
# 🔹 RUN FULL TRIAGE PIPELINE
# ==========================================================

def run_tests():

    ASHA_ID, MEMBER_ID = seed()

    # -------------------------
    # 🔹 TEST 1: Pregnant
    # -------------------------
    pregnant_input = {
        "pregnant_flag": 1,
        "age": 28,
        "trimester": 2,
        "gravida": 1,
        "systolic_bp": 150,
        "diastolic_bp": 95,
        "body_temperature": 99,
        "blood_sugar": 120,
        "edema": 1,
        "headache": 1,
        "blurred_vision": 0,
        "abdominal_pain": 0,
        "breathlessness": 0,
        "known_hypertension": 0,
        "known_diabetes": 0,
        "missed_followups": 1
    }

    print("\n===== PREGNANT TEST =====")
    result = save_visit(pregnant_input, ASHA_ID, MEMBER_ID)
    print(result["triage_result"])


    # -------------------------
    # 🔹 TEST 2: Child
    # -------------------------
    child_input = {
        "age_months": 18,
        "gender": 1,
        "weight": 9,
        "body_temperature": 102,
        "persistent_cough": 1,
        "fever_symptom": 1,
        "diarrhea": 1,
        "vomiting": 0,
        "lethargy": 0,
        "convulsions": 0,
        "immunization_complete": 0,
        "missed_followups": 0
    }

    print("\n===== CHILD TEST =====")
    result = save_visit(child_input, ASHA_ID, MEMBER_ID)
    print(result["triage_result"])


    # -------------------------
    # 🔹 TEST 3: General
    # -------------------------
    general_input = {
        "age": 55,
        "gender": 1,
        "systolic_bp": 180,
        "diastolic_bp": 110,
        "blood_sugar": 300,
        "body_temperature": 101,
        "weight": 70,
        "chest_pain": 1,
        "breathlessness": 1,
        "persistent_cough": 0,
        "weight_loss": 0,
        "fever_symptom": 0,
        "known_diabetes": 1,
        "known_hypertension": 1,
        "known_tb": 0,
        "missed_followups": 1
    }

    print("\n===== GENERAL TEST =====")
    result = save_visit(general_input, ASHA_ID, MEMBER_ID)
    print(result["triage_result"])


# ==========================================================
# 🔹 MAIN
# ==========================================================

if __name__ == "__main__":
    run_tests()