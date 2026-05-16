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

class ProgressRequest(
    BaseModel
):

    steps: list

# ---------------- NORMALIZE STEPS ---------------- #

def normalize_steps(text: str):

    return [
        {
            "title": line.strip(),
            "done": False
        }
        for line in text.split("\n")
        if line.strip()
        and "---" not in line
        and "|" not in line
    ]
# ---------------- GENERATE ROADMAP ---------------- #

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

    prompt = f"""
    Create a personalized placement preparation roadmap.

    Target Role:
    {request.role}
    Weak Topics:
    {", ".join(request.weak_topics)}

    Timeline:
    {request.timeline}

    IMPORTANT RULES:

    1. Return ONLY plain text
    2. Do NOT use markdown
    3. Do NOT use tables
    4. Do NOT use pipe symbols like |
    5. Each roadmap step should be on a new line

    Example:

    Week 1: Learn DBMS basics
    Week 2: Practice SQL queries
    Week 3: Study Operating Systems
    """

    response = ask_ai(
        prompt
    )

    if not response:

        raise HTTPException(
            status_code=500,
            detail="Failed to generate roadmap"
        )

    steps = normalize_steps(
        response
    )

    new_roadmap = Roadmap(

        role=request.role,
        roadmap_text=response,

        steps=steps,

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

        "roadmap": response,

        "steps": steps,

        "roadmap_id": new_roadmap.id
    }
# ---------------- GET ROADMAPS ---------------- #

@router.get(
    "/roadmaps"
)

def get_roadmaps(

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

    roadmaps = db.query(
        Roadmap
    ).filter(
        Roadmap.user_id == user.id
    ).order_by(
        Roadmap.created_at.desc()
    ).all()
    return [

        {
            "id": roadmap.id,

            "role": roadmap.role,

            "roadmap_text": roadmap.roadmap_text,

            "steps": roadmap.steps,

            "created_at": roadmap.created_at
        }

        for roadmap in roadmaps
    ]

# ---------------- UPDATE PROGRESS ---------------- #

@router.put(
    "/roadmap-progress/{roadmap_id}"
)

def update_roadmap_progress(

    roadmap_id: int,

    request: ProgressRequest,

    payload = Depends(
        JWTBearer()
    )
):

    db: Session = SessionLocal()
    roadmap = db.query(
        Roadmap
    ).filter(
        Roadmap.id == roadmap_id
    ).first()

    if not roadmap:

        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    roadmap.steps = request.steps

    db.commit()

    return {
        "message": "Progress updated"
    }