from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
from sqlalchemy import DateTime

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    aws_zone_id = Column(String, unique=True, index=True, nullable=False) # e.g. /hostedzone/Z123ABC
    name = Column(String, nullable=False)
    comment = Column(String, nullable=True)
    type = Column(String, default="Public", nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="hosted_zones")
    dns_records = relationship("DNSRecord", back_populates="zone", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('user_id', 'name', name='uq_user_zone_name'),
    )
