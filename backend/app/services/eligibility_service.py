# from app.services.eligibility_rule_repository import get_latest_eligibility_rules
# from app.utils.eligibility_evaluator import evaluate_user_against_rules
# from app.services.ai_service import _call_gpt


# def check_eligibility(user_data: dict):
#     rules = get_latest_eligibility_rules()

#     decision = evaluate_user_against_rules(user_data, rules)

#     prompt = f"""
#         Explain the eligibility result in simple Indian language.

#         Status: {decision['status']}
#         Reason: {decision['reason']}
#         User Input: {user_data}
#     """

#     explanation = _call_gpt(prompt)

#     return {
#         "status": decision["status"],
#         "reason": decision["reason"],
#         "explanation": explanation
#     }

from app.services.qa_service import answer_from_domain
from app.services.answer_schema import normalize_answer


def check_eligibility(question: str):
    result = answer_from_domain(question, domain="eligibility")
    return normalize_answer(result)
