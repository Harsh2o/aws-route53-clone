from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest

from app.main import app
from app.database import Base, get_db
from app.models.user import User
from app.models.session import Session as DBSession
from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord

# Use an in-memory SQLite DB for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Welcome to Route53 Clone Backend"}

def test_auth_flow():
    # Register
    res = client.post("/api/v1/auth/register", json={"username": "testuser", "password": "password123"})
    assert res.status_code == 200
    assert res.json()["username"] == "testuser"
    
    # Login
    res = client.post("/api/v1/auth/login", json={"username": "testuser", "password": "password123"})
    assert res.status_code == 200
    assert "session_token" in res.cookies
    
    # Get Me
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 200
    assert res.json()["username"] == "testuser"

def test_hosted_zone_flow():
    # Register & Login
    client.post("/api/v1/auth/register", json={"username": "hzuser", "password": "password123"})
    client.post("/api/v1/auth/login", json={"username": "hzuser", "password": "password123"})
    
    # Create Hosted Zone
    res = client.post("/api/v1/hosted-zones", json={
        "name": "example.com",
        "type": "Public",
        "description": "Test zone"
    })
    assert res.status_code == 200
    zone = res.json()
    assert zone["name"] == "example.com"
    assert zone["record_count"] == 2 # NS and SOA auto-generated
    zone_id = zone["id"]
    
    # List Hosted Zones
    res = client.get("/api/v1/hosted-zones")
    assert res.status_code == 200
    assert res.json()["total"] == 1
    
    # Check Auto-generated Records (NS/SOA)
    res = client.get(f"/api/v1/hosted-zones/{zone_id}/records")
    assert res.status_code == 200
    records = res.json()["items"]
    assert len(records) == 2
    types = [r["type"] for r in records]
    assert "NS" in types
    assert "SOA" in types
    
    # Add A Record
    res = client.post(f"/api/v1/hosted-zones/{zone_id}/records", json={
        "name": "www.example.com",
        "type": "A",
        "ttl": 300,
        "value": "192.168.1.1"
    })
    assert res.status_code == 200
    assert res.json()["value"] == "192.168.1.1"
    
    # Add MX Record (needs priority)
    res = client.post(f"/api/v1/hosted-zones/{zone_id}/records", json={
        "name": "example.com",
        "type": "MX",
        "ttl": 300,
        "value": "mail.example.com",
        "priority": 10
    })
    assert res.status_code == 200
    assert res.json()["value"] == "10 mail.example.com"
