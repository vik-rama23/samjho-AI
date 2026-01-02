def evaluate_user_against_rules(user: dict, rules: dict) -> dict:
    # Age check
    if "age" in rules:
        min_age = rules["age"].get("min")
        max_age = rules["age"].get("max")

        if min_age and user["age"] < min_age:
            return {"status": "Not Eligible", "reason": "Age below minimum"}

        if max_age and user["age"] > max_age:
            return {"status": "Not Eligible", "reason": "Age above maximum"}

    # Income check
    if "annual_income" in rules:
        max_income = rules["annual_income"].get("max")
        if max_income and user["annual_income"] > max_income:
            return {
                "status": "Not Eligible",
                "reason": "Income exceeds limit"
            }

    return {"status": "Eligible", "reason": "All criteria satisfied"}
