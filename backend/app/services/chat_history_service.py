from sqlalchemy.orm import Session
from app.models.chat_message import ChatMessage
from app.models.document import Document
from sqlalchemy.sql import func

def save_message(
    db: Session,
    document_id: int,
    role: str,
    message: str,
    feature: str,
    user_id: int,
    source_type: str = None,
    source_name: str = None,
    sources: list = None,
):
    chat = ChatMessage(
        document_id=document_id,
        role=role,
        message=message,
        feature=feature,
        user_id=user_id,
        source_type=source_type,
        source_name=source_name,
        sources=sources,
    )
    db.add(chat)
    db.query(Document).filter(
        Document.id == document_id
    ).update(
        {"updated_at": func.now()}
    )
    db.commit()
    db.refresh(chat)
    return chat


def get_chat_history(
    db: Session,
    document_id: int,
    feature: str,
    user_id: int
):
    return (
        db.query(ChatMessage)
        .filter(
            ChatMessage.document_id == document_id,
            ChatMessage.feature == feature,
            ChatMessage.user_id == user_id
        )
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
