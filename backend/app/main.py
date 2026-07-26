from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, hosted_zones, dns_records
from app.database import Base, engine, SessionLocal
from app.bootstrap import bootstrap_database

# Create tables manually if alembic is not fully configured yet
Base.metadata.create_all(bind=engine)

# Auto-seed for ephemeral environments (Render free tier)
db = SessionLocal()
try:
    bootstrap_database(db)
finally:
    db.close()

app = FastAPI(title="Route53 Clone API")

import os

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "https://example.com"], # Vercel URL should be passed via env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(hosted_zones.router)
app.include_router(dns_records.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Route53 Clone Backend"}
