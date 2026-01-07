from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.government_job import GovernmentJob

router = APIRouter()

@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(GovernmentJob).order_by(
        GovernmentJob.id.desc()
    ).all()

    return [
        {
            "id": j.id,
            "title": j.title,
            "authority": j.authority,
            "official_link": j.official_link,
            "published": j.published,
            "source":j.source,
            "description":j.description,
            "level":j.level
        }
        for j in jobs
    ]
