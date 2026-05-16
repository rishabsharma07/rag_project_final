from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
    JSON
)

from datetime import datetime

from app.database.database import Base

class Roadmap(Base):

    __tablename__ = "roadmaps"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    role = Column(
        String,
        nullable=False
    )

    roadmap_text = Column(
        Text,
        nullable=False
    )

    # NEW
    steps = Column(
        JSON,
        nullable=True
    )

    progress = Column(
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