from fastapi import (
    APIRouter,
    UploadFile,
    File,
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

from app.models.resume_analysis import (
    ResumeAnalysis
)

from app.auth.auth_bearer import (
    JWTBearer
)

from app.services.ai_service import (
    ask_ai
)

from pypdf import PdfReader

import tempfile

router = APIRouter()

# ---------------- ANALYZE RESUME ---------------- #

@router.post(
    "/analyze-resume"
)

async def analyze_resume(

    file: UploadFile = File(...),

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

    # ---------------- SAVE TEMP PDF ---------------- #

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        content = await file.read()

        temp_file.write(content)

        temp_path = temp_file.name

    # ---------------- EXTRACT PDF TEXT ---------------- #

    try:

        reader = PdfReader(
            temp_path
        )

        resume_text = ""

        for page in reader.pages:

            text = page.extract_text()

            if text:

                resume_text += text + "\n"

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to read PDF"
        )

    # ---------------- VALIDATE TEXT ---------------- #

    if not resume_text.strip():

        raise HTTPException(
            status_code=400,
            detail="No text found in resume"
        )

    # ---------------- CREATE AI PROMPT ---------------- #

    prompt = f"""
Analyze this resume carefully.

Resume:

{resume_text}

Return the response in clean markdown format.

Include these sections:

# ATS Score
Give an ATS compatibility score out of 100 with short explanation.

# Resume Summary
Brief summary of the candidate profile.

# Strengths
Mention key strengths.

# Improvement Suggestions
Mention resume improvements, formatting fixes, missing details, and skill improvements.

# Resume-Based Interview Questions
Generate technical and HR interview questions based on the resume projects, skills, and technologies.

Keep the response structured and professional.
"""
    # ---------------- AI ANALYSIS ---------------- #

    analysis = ask_ai(
        prompt
    )

    if not analysis:

        raise HTTPException(
            status_code=500,
            detail="AI analysis failed"
        )

    # ---------------- SAVE TO DB ---------------- #

    new_analysis = ResumeAnalysis(

        resume_text=resume_text,

        analysis=analysis,

        user_id=user.id
    )

    db.add(
        new_analysis
    )

    db.commit()

    db.refresh(
        new_analysis
    )

    # ---------------- RESPONSE ---------------- #

    return {

        "analysis":
            analysis,

        "analysis_id":
            new_analysis.id
    }