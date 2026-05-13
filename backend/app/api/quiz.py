import json

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

from app.models.quiz_history import (
    QuizHistory
)

from app.services.ai_service import (
    ask_ai
)

from app.auth.auth_bearer import (
    JWTBearer
)

router = APIRouter()

# ---------------- REQUEST SCHEMA ---------------- #

class QuizRequest(
    BaseModel
):

    topic: str

    difficulty: str

    num_questions: int = 10

# ---------------- QUIZ ROUTE ---------------- #

@router.post(
    "/quiz"
)

def generate_quiz(

    request: QuizRequest,

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

    # ---------------- PROMPT ---------------- #

    prompt = f"""
    Generate {request.num_questions}
    multiple choice questions
    on the topic:
    {request.topic}

    Difficulty Level:
    {request.difficulty}

    Return ONLY valid JSON.

    Format:

    {{
      "questions": [
        {{
          "question": "Question text",
          "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "correct_answer": "Option A",
          "explanation": "Short explanation"
        }}
      ]
    }}

    IMPORTANT:
    - Do NOT add markdown
    - Do NOT add explanations outside JSON
    - Return ONLY JSON
    """

    # ---------------- AI RESPONSE ---------------- #

    response = ask_ai(
        prompt
    )

    # ---------------- CLEAN RESPONSE ---------------- #

    cleaned = response.strip()

    cleaned = cleaned.replace(
        "```json",
        ""
    )

    cleaned = cleaned.replace(
        "```",
        ""
    )

    cleaned = cleaned.strip()

    # ---------------- PARSE JSON ---------------- #

    try:

        quiz_data = json.loads(
            cleaned
        )

    except Exception as e:

        print("\n\n========== AI RAW RESPONSE ==========\n")

        print(cleaned)

        print("\n========== JSON ERROR ==========\n")

        print(str(e))

        raise HTTPException(
            status_code=500,
            detail="Invalid AI quiz response"
        )

    # ---------------- VALIDATE STRUCTURE ---------------- #

    if (
        "questions" not in quiz_data
        or
        not isinstance(
            quiz_data["questions"],
            list
        )
    ):

        raise HTTPException(
            status_code=500,
            detail="Quiz format invalid"
        )

    # ---------------- SAVE QUIZ HISTORY ---------------- #

    new_quiz = QuizHistory(

        topic=request.topic,

        difficulty=request.difficulty,

        score=75,

        user_id=user.id
    )

    db.add(
        new_quiz
    )

    db.commit()

    db.refresh(
        new_quiz
    )

    # ---------------- RETURN QUIZ ---------------- #

    return quiz_data