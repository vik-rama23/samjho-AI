import tempfile
import os

from fastapi import HTTPException
from app.database import SessionLocal
from app.models.document import Document
from app.utils.text_extractor import extract_text_from_pdf
from app.services.vector_service import build_vectors
from app.constant.upload_limits import (
    MAX_DOCS_PER_USER,
    MAX_TOTAL_SIZE_BYTES
)

async def upload_document(
    file,
    title: str,
    domain: str,
    source: str,
    category: str,
    year: int,
    user_id: int
):
    db = SessionLocal()
    existing_docs = db.query(Document).filter(
        Document.user_id == user_id,
        Document.is_active == 1
    ).all()

    if len(existing_docs) >= MAX_DOCS_PER_USER:
        raise HTTPException(
            status_code=400,
            detail="You can upload a maximum of 10 documents."
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    # Some existing documents may have `file_size` as None; treat as 0
    current_total_size = sum(int(d.file_size or 0) for d in existing_docs)

    if current_total_size + file_size > MAX_TOTAL_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Total document size cannot exceed 15 MB."
        )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        path = tmp.name

    try:
    
        text = extract_text_from_pdf(path)

        if not text:
            raise HTTPException(
                status_code=400,
                detail=(
                    "This PDF appears to be scanned or image-based. "
                    "Please upload a text-based PDF."
                )
            )

        document = Document(
            title=title,
            domain=domain,
            source=source,
            category=category,
            year=year,
            content=text,
            user_id=user_id,
            file_size=file_size
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        chunks = build_vectors(text, document.id, domain)

        return {
            "document_id": document.id,
            "domain": domain,
            "chunks": chunks
        }

    finally:
        try:
            os.remove(path)
        except Exception:
            pass
