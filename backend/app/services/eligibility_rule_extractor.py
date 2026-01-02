from app.services.ai_service import _call_gpt
import json


def extract_rules_from_document(document_text: str) -> dict:
    """
    ONE-TIME extraction of structured eligibility rules from document text.
    """

    prompt = f"""
        Extract eligibility rules from the document below.
        Return STRICT JSON only.

        Document:
        {document_text}

        JSON format example:
        {{
        "age": {{"min": 18, "max": 25}},
        "annual_income": {{"max": 800000}},
        "category_relaxation": ["SC", "ST"]
        }}
    """

    response = _call_gpt(prompt)

    try:
        return json.loads(response)
    except Exception:
        raise ValueError("Failed to extract valid eligibility rules JSON")
