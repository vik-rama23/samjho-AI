from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import shutil
import os

from app.models.document import Document
from app.models.chat_message import ChatMessage
from app.database import SessionLocal

VECTOR_BASE_PATH = "vectors"

def cleanup_old_documents(days: int = 10):
    db: Session = SessionLocal()

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    old_docs = (
        db.query(Document)
        .filter(Document.created_at < cutoff_date)
        .all()
    )

    deleted_count = 0

    for doc in old_docs:
        # 1️⃣ Delete chat history
        db.query(ChatMessage).filter(
            ChatMessage.document_id == doc.id
        ).delete()

        # 2️⃣ Delete vectors
        vector_path = os.path.join(
            VECTOR_BASE_PATH,
            doc.domain,
            str(doc.id)
        )

        if os.path.exists(vector_path):
            shutil.rmtree(vector_path, ignore_errors=True)

        # 3️⃣ Delete document
        db.delete(doc)
        deleted_count += 1

    db.commit()
    db.close()

    return deleted_count
