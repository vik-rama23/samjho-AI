FINANCE_KEYWORDS = [
    "tax", "salary", "emi", "loan", "interest", "insurance", "80c", "80d"
]

def is_finance_question(question: str) -> bool:
    q = question.lower()
    return any(k in q for k in FINANCE_KEYWORDS)
