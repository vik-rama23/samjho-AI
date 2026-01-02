from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.services.document_service import upload_document
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.utils.vector_cleanup import delete_user_vectors 

router = APIRouter()

@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    title: str = Form(...),
    domain: str = Form(...),
    source: str = Form(None),
    category: str = Form(None),
    year: int = Form(None),
    current_user: User = Depends(get_current_user)
):
    return await upload_document(
        file, title, domain, source, category, year, current_user.id
    )


@router.get("/")
def list_documents(db: Session = Depends(get_db),  current_user: User = Depends(get_current_user)):
    documents = (
        db.query(Document)
        .filter(Document.is_active == 1, Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return {
        "documents": [
            {
                "id": doc.id,
                "title": doc.title,
                "domain": doc.domain,
                "created_at": doc.created_at,
                "updated_at": doc.updated_at,
            }
            for doc in documents
        ]
    }

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    domain = document.domain

    db.delete(document)
    db.commit()
    delete_user_vectors(current_user.id, domain)

    return {
        "message": "Document deleted successfully",
        "document_id": document_id
    }

