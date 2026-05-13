from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import (
    Session
)

from pydantic import (
    BaseModel
)

from app.database.database import (
    SessionLocal
)

from app.models.user import (
    User
)

from app.models.roadmap import (
    Roadmap
)

from app.services.ai_service import (
    ask_ai
)

from app.auth.auth_bearer import (
    JWTBearer
)

router = APIRouter()

# ---------------- REQUEST SCHEMA ---------------- #

class RoadmapRequest(
    BaseModel
):

    role: str

    weak_topics: list[str]

    timeline: str

# ---------------- ROADMAP ROUTE ---------------- #

@router.post(
    "/roadmap"
)

def generate_roadmap(

    request: RoadmapRequest,

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

    # ---------------- CREATE PROMPT ---------------- #

    prompt = f"""
    Create a personalized placement preparation roadmap.

    Target Role:
    {request.role}

    Weak Topics:
    {", ".join(request.weak_topics)}

    Timeline:
    {request.timeline}

    Include:
    - weekly study plan
    - important topics
    - revision strategy
    - interview preparation tips
    """

    # ---------------- AI RESPONSE ---------------- #

    response = ask_ai(
        prompt
    )

    # ---------------- SAVE ROADMAP ---------------- #

    new_roadmap = Roadmap(

        role=request.role,

        roadmap_text=response,

        user_id=user.id
    )

    db.add(
        new_roadmap
    )

    db.commit()

    db.refresh(
        new_roadmap
    )

    return {

        "roadmap":
            response,

        "roadmap_id":
            new_roadmap.id
    }