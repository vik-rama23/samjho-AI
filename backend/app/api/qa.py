from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.document import Document
from app.models.user import User
from app.services.qa_service import answer_from_domain
from app.services.chat_history_service import save_message, get_chat_history
from app.utils.domain_mapper import map_domain_to_feature

router = APIRouter()


@router.post("/ask")
def ask_question(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document_id = payload.get("document_id")
    question = payload.get("question")

    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(404, "Document not found")

    feature = map_domain_to_feature(doc.domain)

    save_message(db, document_id, "user", question, feature, current_user.id)

    result = answer_from_domain(question, doc.domain)

    save_message(
        db=db,
        document_id=document_id,
        role="assistant",
        message=result["answer"],
        feature=feature,
        user_id=current_user.id,
        source_type=result["source_type"],
        source_name=result["source_name"],
        sources=result["sources"],
    )

    return result


@router.get("/history")
def history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    feature = map_domain_to_feature(doc.domain)

    return get_chat_history(db, document_id, feature, current_user.id)
