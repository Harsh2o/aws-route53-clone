from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.services.auth import hash_password

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if not db.query(User).filter(User.username == "admin").first():
        admin = User(
            username="admin",
            hashed_password=hash_password("admin123")
        )
        db.add(admin)
        db.commit()
        print("Seeded admin user (admin / admin123)")
    else:
        print("Admin user already exists")
    
    db.close()

if __name__ == "__main__":
    seed_data()
