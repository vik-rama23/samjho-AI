from fastapi import APIRouter, Depends
from app.services.cleanup_service import cleanup_old_documents
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/cleanup")
def cleanup_documents(current_user=Depends(get_current_user)):
    # Optional: restrict to admin later
    deleted = cleanup_old_documents(days=10)

    return {
        "deleted_documents": deleted,
        "status": "cleanup completed"
    }
