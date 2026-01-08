from sqlalchemy import Column, BigInteger, Text, Enum, ForeignKey, DateTime, String, JSON, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

# class ChatMessage(Base):
#     __tablename__ = "chat_messages"

#     id = Column(BigInteger, primary_key=True, index=True)
#     document_id = Column(
#         BigInteger,
#         ForeignKey("documents.id", ondelete="CASCADE"),
#         nullable=False
#     )
#     user_id = Column(BigInteger, nullable=False, index=True)
#     feature = Column(
#         Enum("qa", "finance", "eligibility", name="chat_feature"),
#         nullable=False,
#         default="qa"
#     )
#     role = Column(
#         Enum("user", "assistant", name="chat_role"),
#         nullable=False
#     )



class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(BigInteger, primary_key=True, index=True)

    document_id = Column(BigInteger, ForeignKey("documents.id", ondelete="CASCADE"))
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))

    role = Column(Enum("user", "assistant"), nullable=False)
    message = Column(Text, nullable=False)
    feature = Column(String(50), nullable=False)
    source_mode = Column(Enum('document', 'internet'), nullable=False)
    source_type = Column(String(20), nullable=True)     # document / internet / none
    source_name = Column(String(255), nullable=True)    # doc title
    sources = Column(JSON, nullable=True)               # list of URLs

    created_at = Column(TIMESTAMP, server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
