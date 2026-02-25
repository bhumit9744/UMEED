def calculate_priority(risk_class, data):

    score = 0

    # Risk weight
    if risk_class == 2:
        score += 80
    elif risk_class == 1:
        score += 40
    else:
        score += 10

    # Missed followups
    missed = data.get("missed_followups", 0)

    if missed > 4:
        score += 25
    elif missed > 2:
        score += 15

    # Pregnancy trimester 3 boost
    if data.get("trimester", 0) == 3:
        score += 20

    return score