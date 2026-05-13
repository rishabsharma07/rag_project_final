from app.database.database import engine
from app.models.user import User
from app.database.database import Base

Base.metadata.create_all(bind=engine)

print("Database tables created")