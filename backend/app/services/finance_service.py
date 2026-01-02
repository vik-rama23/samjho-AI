# from app.services.qa_service import answer_from_domain
# from app.services.ai_service import explain_finance_with_ai
# from app.core.logger import logger

# DISCLAIMER = (
#     "This explanation is for informational purposes only. "
#     "It is not financial or tax advice. Please consult a qualified professional."
# )


# class FinanceDocsMissing(Exception):
#     """Raised when finance documents are required but missing"""
#     pass


# def explain_finance(data: dict, strict_mode: bool = False):
#     """
#     Finance explanation service.

#     Features:
#     - Document-based finance (RAG)
#     - Safe AI fallback
#     - Optional strict mode
#     - Logging
#     - Confidence score
#     """

#     question = data.get("question")
#     if not question:
#         raise ValueError("Finance question is required")

#     explanation = answer_from_domain(question, domain="finance")

#     if explanation.startswith("No documents uploaded"):
#         logger.warning("Finance fallback triggered (no finance documents)")

#         if strict_mode:
#             raise FinanceDocsMissing(
#                 "Finance documents are required to answer this question"
#             )

#         # Fallback to general finance AI
#         explanation = explain_finance_with_ai({
#             "question": question,
#             "additional_data": data
#         })

#         source = "general_finance_ai"
#         confidence = 0.55
#     else:
#         source = "finance_documents"
#         confidence = 0.90

#     return {
#         "explanation": explanation,
#         "disclaimer": DISCLAIMER,
#         "source": source,
#         "confidence": confidence
#     }


from app.services.qa_service import answer_from_domain
from app.services.answer_schema import normalize_answer


def explain_finance(question: str):
    result = answer_from_domain(question, domain="finance")
    return normalize_answer(result)
