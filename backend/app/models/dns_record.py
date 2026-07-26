from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Index
from sqlalchemy.orm import relationship
from app.database import Base

class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # A, AAAA, CNAME, etc.
    ttl = Column(Integer, nullable=False, default=300)
    value = Column(String, nullable=False) # Can be multi-line string for multiple values
    routing_policy = Column(String, default="Simple")
    system = Column(Boolean, default=False, nullable=False) # True for auto-generated NS/SOA

    zone = relationship("HostedZone", back_populates="dns_records")

    __table_args__ = (
        Index('ix_dns_records_zone_id_name', 'zone_id', 'name'),
        Index('ix_dns_records_zone_id_type', 'zone_id', 'type'),
    )
