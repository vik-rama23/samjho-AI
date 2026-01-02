from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.services.qa_service import answer_from_domain
from app.services.chat_history_service import (
    save_message,
    get_chat_history
)
from app.utils.domain_mapper import map_domain_to_feature
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/ask")
def ask_question(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document_id = payload.get("document_id")
    question = payload.get("question")

    if not document_id or not question:
        raise HTTPException(
            status_code=400,
            detail="document_id and question required"
        )

    doc = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    feature = map_domain_to_feature(doc.domain)

    save_message(
        db=db,
        document_id=document_id,
        role="user",
        message=question,
        feature=feature,
        user_id=current_user.id,
    )

    result = answer_from_domain(
        question=question,
        domain=doc.domain
    )

    # Normalize result (safety)
    answer_text = (
        result.get("answer")
        if isinstance(result, dict)
        else str(result)
    )

    save_message(
        db=db,
        document_id=document_id,
        role="assistant",
        message=answer_text,
        feature=feature,
        user_id=current_user.id,
        source_type=result.get("source_type"),
        source_name=result.get("source_name"),
        sources=result.get("sources"),
    )

    return {
        "answer": answer_text,
        "source_type": result.get("source_type"),
        "source_name": result.get("source_name"),
        "sources": result.get("sources", []),
        "feature": feature,
        "document_id": document_id,
    }


@router.get("/history")
def get_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    feature = map_domain_to_feature(doc.domain)

    messages = get_chat_history(
        db=db,
        document_id=document_id,
        feature=feature,
        user_id=current_user.id,
    )
    return {
        "document_id": document_id,
        "feature": feature,
        "messages": [
            {
                "role": m.role,
                "message": m.message,
                "created_at": m.created_at,
                "source_type": m.source_type,
                "source_name": m.source_name,
                "sources": m.sources,
            }
            for m in messages
        ]
    }
