from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from pydantic import (
    BaseModel
)

from sqlalchemy.orm import (
    Session
)

from app.database.database import (
    SessionLocal
)

from app.models.user import (
    User
)

from app.models.chat_history import (
    ChatHistory
)

from app.auth.auth_bearer import (
    JWTBearer
)

from app.rag.rag_pipeline import (
    ask_rag
)

router = APIRouter()

class ChatRequest(
    BaseModel
):

    query: str

@router.post(
    "/chat"
)

def chat_with_ai(

    request: ChatRequest,

    payload = Depends(
        JWTBearer()
    )
):

    db: Session = SessionLocal()

    # ---------------- GET USER ---------------- #

    email = payload.get(
        "sub"
    )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    # ---------------- AI RESPONSE ---------------- #

    response = ask_rag(
        request.query,
        user.id
    )

    # ---------------- SAVE CHAT ---------------- #

    new_chat = ChatHistory(

        question=request.query,

        response=response,

        user_id=user.id
    )

    db.add(
        new_chat
    )

    db.commit()

    db.refresh(
        new_chat
    )

    return {
        "response": response
    }
# ---------------- GET CHAT HISTORY ---------------- #

@router.get(
    "/chat-history"
)

def get_chat_history(

    payload = Depends(
        JWTBearer()
    )
):

    db: Session = SessionLocal()

    email = payload.get(
        "sub"
    )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    chats = db.query(ChatHistory).filter(
        ChatHistory.user_id == user.id
    ).order_by(
        ChatHistory.created_at.asc()
    ).all()

    messages = []

    for chat in chats:

        messages.append({
            "role": "user",
            "content": chat.question
        })

        messages.append({
            "role": "assistant",
            "content": chat.response
        })

    return {
        "messages": messages
    }