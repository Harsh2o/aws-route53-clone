import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request, Depends
from app.database import get_db
from app.models.user import User
from app.models.session import Session as DBSession
from app.schemas.auth import UserCreate, UserLogin
from app.config import settings

def hash_password(password: str) -> str:
    # Basic sha256 for simplicity, though bcrypt is better in prod
    return hashlib.sha256(password.encode()).hexdigest()

def create_user(db: Session, user_in: UserCreate) -> User:
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user = User(
        username=user_in.username,
        hashed_password=hash_password(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login(db: Session, user_in: UserLogin) -> DBSession:
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or user.hashed_password != hash_password(user_in.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    session = DBSession(
        token=token,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def logout(db: Session, token: str):
    session = db.query(DBSession).filter(DBSession.token == token).first()
    if session:
        db.delete(session)
        db.commit()

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = db.query(DBSession).filter(
        DBSession.token == token,
        DBSession.expires_at > datetime.now(timezone.utc)
    ).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    return session.user
