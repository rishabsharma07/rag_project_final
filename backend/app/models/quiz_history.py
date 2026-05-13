from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database.database import Base

class QuizHistory(Base):

    __tablename__ = "quiz_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    topic = Column(
        String,
        nullable=False
    )

    difficulty = Column(
        String,
        nullable=False
    )

    score = Column(
        Integer,
        default=0
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )