import json
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.chat_message import ChatMessage


def save_message(
    db: Session,
    document_id: int,
    role: str,
    message: str,
    feature: str,
    user_id: int,
    source_mode: str = "document",
    source_type=None,
    source_name=None,
    sources=None
):
    chat = ChatMessage(
        document_id=document_id,
        role=role,
        message=str(message),
        feature=feature,
        user_id=user_id,
        source_type=source_type,
        source_name=source_name,
        sources=json.dumps(sources) if sources else None,
        source_mode=source_mode,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat_history(db, document_id, feature, user_id, source_mode=None):
    query = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.feature == feature,
            ChatMessage.user_id == user_id,
        )
    )

    if source_mode is None:
        query = query.filter(ChatMessage.source_mode.is_(None))
    else:
        query = query.filter(ChatMessage.source_mode == source_mode)

    rows = (
        query
        .order_by(ChatMessage.created_at.desc())
        .all()
    )

    rows = list(reversed(rows))
    return [
        {
            "role": r.role,
            "answer": r.message,
            "source_type": r.source_type,
            "source_name": r.source_name,
            "sources": json.loads(r.sources) if r.sources else [],
            "created_at": r.created_at,
        }
        for r in rows
    ]
