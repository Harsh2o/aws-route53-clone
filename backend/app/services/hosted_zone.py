import random
import string
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneResponse, HostedZoneUpdate
from app.models.user import User

def generate_aws_zone_id() -> str:
    # /hostedzone/Z + random hex uppercase
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=13))
    return f"/hostedzone/Z{suffix}"

def create_hosted_zone(db: Session, zone_in: HostedZoneCreate, user: User) -> HostedZoneResponse:
    # Check if user already has a zone with this name
    existing = db.query(HostedZone).filter(
        HostedZone.user_id == user.id,
        HostedZone.name == zone_in.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Zone with this name already exists")

    new_zone = HostedZone(
        aws_zone_id=generate_aws_zone_id(),
        name=zone_in.name,
        type=zone_in.type,
        description=zone_in.description,
        user_id=user.id
    )
    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)

    # Auto-generate NS and SOA records
    ns_record = DNSRecord(
        zone_id=new_zone.id,
        name=new_zone.name,
        type="NS",
        ttl=172800,
        value="ns-1.awsdns-1.net.\nns-2.awsdns-2.com.\nns-3.awsdns-3.org.\nns-4.awsdns-4.co.uk.",
        system=True
    )
    soa_record = DNSRecord(
        zone_id=new_zone.id,
        name=new_zone.name,
        type="SOA",
        ttl=900,
        value="ns-1.awsdns-1.net. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
        system=True
    )
    db.add_all([ns_record, soa_record])
    db.commit()

    return _to_response(db, new_zone)

def get_hosted_zones(db: Session, user: User):
    zones = db.query(HostedZone).filter(HostedZone.user_id == user.id).all()
    return [_to_response(db, z) for z in zones]

def get_hosted_zone(db: Session, zone_id: int, user: User) -> HostedZoneResponse:
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id, HostedZone.user_id == user.id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return _to_response(db, zone)

def delete_hosted_zone(db: Session, zone_id: int, user: User):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id, HostedZone.user_id == user.id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    db.delete(zone)
    db.commit()

def _to_response(db: Session, zone: HostedZone) -> HostedZoneResponse:
    # record_count is derived
    count = db.query(DNSRecord).filter(DNSRecord.zone_id == zone.id).count()
    return HostedZoneResponse(
        id=zone.id,
        aws_zone_id=zone.aws_zone_id,
        name=zone.name,
        type=zone.type,
        comment=zone.comment,
        description=zone.description,
        record_count=count,
        created_at=zone.created_at.isoformat()
    )

def update_hosted_zone(db: Session, zone_id: int, update_in: HostedZoneUpdate, user: User) -> HostedZoneResponse:
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id, HostedZone.user_id == user.id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    if update_in.description is not None:
        zone.description = update_in.description
    if update_in.comment is not None:
        zone.comment = update_in.comment
        
    db.commit()
    db.refresh(zone)
    return _to_response(db, zone)

def search_hosted_zones(db: Session, user: User, search: str = None, page: int = 1, size: int = 20):
    query = db.query(HostedZone).filter(HostedZone.user_id == user.id)
    if search:
        query = query.filter(HostedZone.name.ilike(f"%{search}%"))
        
    total = query.count()
    offset = (page - 1) * size
    zones = query.offset(offset).limit(size).all()
    
    items = [_to_response(db, z) for z in zones]
    return items, total
