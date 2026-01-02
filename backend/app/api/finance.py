# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# from app.database import get_db
# from app.models.document import Document
# from app.services.qa_service import answer_from_domain
# from app.services.chat_history_service import (
#     save_message,
#     get_chat_history
# )

# from app.dependencies.auth import get_current_user
# from app.models.user import User

# router = APIRouter()
# FEATURE = "finance"


# @router.post("/ask")
# def ask_finance(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     document_id = payload.get("document_id")
#     question = payload.get("question")

#     if not document_id or not question:
#         raise HTTPException(
#             status_code=400,
#             detail="document_id and question required"
#         )

#     doc = db.query(Document).filter(
#         Document.id == document_id,
#         Document.user_id == current_user.id
#     ).first()

#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     save_message(db, document_id, "user", question, FEATURE, current_user.id)
#     answer = answer_from_domain(question, domain=doc.domain)
#     save_message(
#         db,
#         document_id, 
#         "assistant", 
#         answer, 
#         FEATURE, 
#         current_user.id,  
#         source_type=answer.get("source_type"),
#         source_name=answer.get("source_name"),
#         sources=answer.get("sources"),
#     )
#     return {
#         "answer": answer,
#         "source_type": "document",
#         "source_name": "Uploaded Document",
#         "sources": []
#     }


# @router.get("/history")
# def finance_history(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     messages = get_chat_history(db, document_id, FEATURE, current_user.id)

#     return {
#         "feature": FEATURE,
#         "messages": [
#             {
#                 "role": m.role,
#                 "message": m.message,
#                 "source_type": m.source_type,
#                 "source_name": m.source_name,
#                 "sources": json.loads(m.sources) if m.sources else [],
#              }
#             for m in messages
#         ]
#     }


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.document import Document
from app.models.user import User
from app.services.chat_history_service import get_chat_history
from app.services.finance_service import explain_finance

router = APIRouter()

FEATURE = "finance"

@router.get("/history")
def get_finance_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
        Document.domain == "finance"
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Finance document not found")

    messages = get_chat_history(
        db=db,
        document_id=document_id,
        feature=FEATURE,
        user_id=current_user.id
    )

    return {
        "document_id": document_id,
        "feature": FEATURE,
        "messages": messages
    }


@router.post("/ask")
def ask_finance(payload: dict):
    return explain_finance(payload.get("question"))
