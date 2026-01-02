from app.database import SessionLocal
from sqlalchemy import text


def save_eligibility_rules(document_id: int, rules: dict):
    db = SessionLocal()
    query = text("""
        INSERT INTO eligibility_rules (document_id, rules_json)
        VALUES (:document_id, :rules)
    """)

    db.execute(query, {
        "document_id": document_id,
        "rules": rules
    })
    db.commit()


def get_latest_eligibility_rules() -> dict:
    db = SessionLocal()
    query = text("""
        SELECT rules_json
        FROM eligibility_rules
        ORDER BY created_at DESC
        LIMIT 1
    """)

    result = db.execute(query).fetchone()
    if not result:
        raise ValueError("No eligibility rules found")
        
    return result[0]
