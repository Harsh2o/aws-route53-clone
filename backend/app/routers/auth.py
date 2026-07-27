from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserCreate, UserLogin, UserResponse
from app.services import auth as auth_service
from app.models.user import User

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    return auth_service.create_user(db, user_in)

@router.post("/login")
def login(user_in: UserLogin, response: Response, db: Session = Depends(get_db)):
    session = auth_service.login(db, user_in)
    response.set_cookie(
        key="session_token",
        value=session.token,
        httponly=True,
        samesite="none",
        secure=True # Required for cross-site cookies
    )
    return {"message": "Logged in successfully", "token": session.token}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("session_token")
    if token:
        auth_service.logout(db, token)
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), current_user: User = Depends(auth_service.get_current_user)):
    return current_user
