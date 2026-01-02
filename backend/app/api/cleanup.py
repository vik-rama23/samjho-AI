import shutil
import os
from fastapi import APIRouter


VECTOR_BASE = "vectors"
router = APIRouter()

def delete_user_vectors(user_id: int, domain: str | None = None):
    """
    Deletes vector stores for a user.
    If domain is None -> delete all domains
    """
    user_path = os.path.join(VECTOR_BASE, f"user_{user_id}")

    if not os.path.exists(user_path):
        return

    if domain:
        domain_path = os.path.join(user_path, domain)
        if os.path.exists(domain_path):
            shutil.rmtree(domain_path)
    else:
        shutil.rmtree(user_path)
