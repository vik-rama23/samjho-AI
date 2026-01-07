from sqlalchemy.orm import Session
from app.models.government_job import GovernmentJob


def get_active_jobs(
    db: Session,
    job_type: str | None = None,
    state: str | None = None,
):
    query = db.query(GovernmentJob).filter(
        GovernmentJob.is_active == True
    )

    if job_type:
        query = query.filter(GovernmentJob.job_type == job_type)

    if state:
        query = query.filter(GovernmentJob.state == state)

    return query.order_by(
        GovernmentJob.created_at.desc()
    ).all()
