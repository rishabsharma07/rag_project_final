import os

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

from app.auth.auth_bearer import (
    JWTBearer
)

router = APIRouter()

# ---------------- GET DOCUMENTS ---------------- #

@router.get(
    "/documents"
)

def get_documents(

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

    # ---------------- FETCH DOCUMENTS ---------------- #

    documents = db.query(Document).filter(
        Document.user_id == user.id
    ).all()

    return [

        {
            "id": doc.id,

            "filename": doc.filename
        }

        for doc in documents
    ]

# ---------------- DELETE DOCUMENT ---------------- #

@router.delete(
    "/documents/{document_id}"
)

def delete_document(

    document_id: int,

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

    # ---------------- FIND DOCUMENT ---------------- #

    document = db.query(Document).filter(

        Document.id == document_id,

        Document.user_id == user.id

    ).first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # ---------------- DELETE FILE ---------------- #

    file_path = (
        f"uploads/"
        f"{document.filename}"
    )

    if os.path.exists(
        file_path
    ):

        os.remove(
            file_path
        )

    # ---------------- DELETE DATABASE ENTRY ---------------- #

    db.delete(
        document
    )

    db.commit()

    return {

        "message":
            "Document deleted successfully"
    }