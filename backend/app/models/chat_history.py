from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    Text
)

from datetime import datetime

from app.database.database import Base

class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    question = Column(
        Text,
        nullable=False
    )

    response = Column(
        Text,
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )