from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.roadmap import router as roadmap_router
from app.api.quiz import router as quiz_router
from app.api.agent import router as agent_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.dashboard import router as dashboard_router
from app.api.documents import router as documents_router




from app.models.document import Document
from app.models.quiz_history import QuizHistory
from app.models.roadmap import Roadmap
from app.models.chat_history import ChatHistory
from app.models.user import User


from app.database.database import (
    Base,
    engine
)

Base.metadata.create_all(
    bind=engine
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(roadmap_router)
app.include_router(quiz_router)
app.include_router(agent_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(documents_router)



@app.get("/")
def home():
    return {
        "message": "AI Career Copilot Backend Running"
    }
