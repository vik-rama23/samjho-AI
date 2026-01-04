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
    source_type=None,
    source_name=None,
    sources=None
):

    count = (
        db.query(func.count(ChatMessage.id))
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.feature == feature,
            ChatMessage.user_id == user_id,
        )
        .scalar()
    )

    if count < 10:
        chat = ChatMessage(
            document_id=document_id,
            role=role,
            message=str(message),
            feature=feature,
            user_id=user_id,
            source_type=source_type,
            source_name=source_name,
            sources=json.dumps(sources) if sources else None,
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat

    # If there are already 10 messages, update the most recent one instead
    last_message = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.feature == feature,
            ChatMessage.user_id == user_id,
        )
        .order_by(ChatMessage.created_at.desc())
        .first()
    )

    if last_message:
        last_message.role = role
        last_message.message = str(message)
        last_message.source_type = source_type
        last_message.source_name = source_name
        last_message.sources = json.dumps(sources or [])
        last_message.created_at = func.now()

        db.commit()
        db.refresh(last_message)
        return last_message

    return None


def get_chat_history(db, document_id, feature, user_id):
    rows = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.feature == feature,
            ChatMessage.user_id == user_id
        )
        .order_by(ChatMessage.created_at.asc())
        .limit(10)
        .all()
    )

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
