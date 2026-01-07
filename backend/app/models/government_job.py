from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base

class GovernmentJob(Base):
    __tablename__ = "government_jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    authority = Column(String(255))
    level = Column(String(50))  # Central / State
    source = Column(String(100))
    official_link = Column(String(1000), unique=True, index=True)
    published = Column(String(100))
    created_at = Column(DateTime)
    is_active = Column(Integer, default=1)
    description = Column(Text, nullable=True)
