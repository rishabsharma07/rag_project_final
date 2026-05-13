import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import (
    SessionLocal
)

from app.models.user import User

from app.models.document import (
    Document
)

from app.rag.pdf_loader import (
    load_pdf
)

from app.rag.chunker import (
    chunk_text
)

from app.rag.embeddings import (
    create_embeddings
)

from app.rag.vector_store import (
    store_embeddings
)

from app.auth.auth_bearer import (
    JWTBearer
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"

# CREATE FOLDER IF NOT EXISTS

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@router.post(
    "/upload"
)

async def upload_pdf(

    file: UploadFile = File(...),

    payload = Depends(
        JWTBearer()
    )
):

    db: Session = SessionLocal()

    # ---------------- GET USER ---------------- #

    email = payload.get("sub")

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ---------------- SAVE FILE ---------------- #

    file_path = (
        f"{UPLOAD_FOLDER}/"
        f"{file.filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # ---------------- LOAD PDF ---------------- #

    text = load_pdf(
        file_path
    )

    # ---------------- CHUNK TEXT ---------------- #

    chunks = chunk_text(
        text
    )

    # ---------------- CREATE EMBEDDINGS ---------------- #

    embeddings = create_embeddings(
        chunks
    )

    # ---------------- STORE IN VECTOR DB ---------------- #

    store_embeddings(
    chunks,
    embeddings,
    user.id
)

    # ---------------- SAVE DOCUMENT IN POSTGRES ---------------- #

    new_document = Document(

        filename=file.filename,

        user_id=user.id
    )

    db.add(
        new_document
    )

    db.commit()

    db.refresh(
        new_document
    )

    return {

        "message":
            "PDF uploaded successfully",

        "document_id":
            new_document.id,

        "filename":
            new_document.filename,

        "chunks":
            len(chunks)
    }