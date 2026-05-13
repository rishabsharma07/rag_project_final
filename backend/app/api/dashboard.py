from fastapi import (
    APIRouter,
    Depends,
    HTTPException
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

from app.models.document import (
    Document
)

from app.models.quiz_history import (
    QuizHistory
)

from app.models.roadmap import (
    Roadmap
)

from app.auth.auth_bearer import (
    JWTBearer
)

router = APIRouter()

@router.get(
    "/dashboard"
)

def get_dashboard_stats(

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

    # ---------------- DOCUMENT COUNT ---------------- #

    document_count = db.query(
        Document
    ).filter(
        Document.user_id == user.id
    ).count()

    # ---------------- QUIZ COUNT ---------------- #

    quiz_count = db.query(
        QuizHistory
    ).filter(
        QuizHistory.user_id == user.id
    ).count()

    # ---------------- ROADMAP COUNT ---------------- #

    roadmap_count = db.query(
        Roadmap
    ).filter(
        Roadmap.user_id == user.id
    ).count()

    # ---------------- RECENT ACTIVITY ---------------- #

    recent_activity = []

    latest_documents = db.query(
        Document
    ).filter(
        Document.user_id == user.id
    ).order_by(
        Document.uploaded_at.desc()
    ).limit(3).all()

    for doc in latest_documents:

        recent_activity.append({

            "title":
                f"Uploaded {doc.filename}",

            "time":
                str(doc.uploaded_at)
        })

    latest_roadmaps = db.query(
        Roadmap
    ).filter(
        Roadmap.user_id == user.id
    ).order_by(
        Roadmap.created_at.desc()
    ).limit(2).all()

    for roadmap in latest_roadmaps:

        recent_activity.append({

            "title":
                f"Generated {roadmap.role} roadmap",

            "time":
                str(roadmap.created_at)
        })

    # ---------------- RESPONSE ---------------- #
    average_score = 0

    if quiz_count > 0:

        average_score = 75
    return {

        "documents":
            document_count,

        "quizzes_taken":
            quiz_count,

        "average_score":
            average_score,

        "roadmap_progress":
            roadmap_count * 10,

        "suggestions": [

            "Practice quizzes daily",

            "Revise weak topics",

            "Upload more learning PDFs"
        ],

        "recent_activity":
            recent_activity
    }