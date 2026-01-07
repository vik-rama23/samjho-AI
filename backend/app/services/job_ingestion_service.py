from app.services.india_gov_rss_service import fetch_rss_jobs
from app.models.government_job import GovernmentJob
import asyncio
from app.database import SessionLocal


def ingest_rss_jobs():
    jobs = fetch_rss_jobs()
    db = SessionLocal()
    saved = 0

    for job in jobs:
        exists = db.query(GovernmentJob).filter(
            GovernmentJob.official_link == job["official_link"]
        ).first()

        if exists:
            continue

        db.add(GovernmentJob(**job))
        saved += 1

    db.commit()
    return saved
    
if __name__ == "__main__":
    asyncio.run(ingest_rss_jobs())
