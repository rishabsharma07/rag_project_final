from fastapi import APIRouter, HTTPException

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user import User

from app.schemas.auth_schema import (
    SignupRequest,
    LoginRequest
)

from app.utils.security import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)

router = APIRouter()

# ---------------- SIGNUP ---------------- #

@router.post("/signup")

def signup(request: SignupRequest):

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == request.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        request.password
    )

    new_user = User(
        name=request.name,
        email=request.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created successfully"
    }

# ---------------- LOGIN ---------------- #

@router.post("/login")

def login(request: LoginRequest):

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    if not verify_password(
        request.password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "sub": user.email,
        "name": user.name,
    })

    return {
    "access_token": token,

    "token_type": "bearer",

    "user": {
        "name": user.name,
        "email": user.email,
    }
}