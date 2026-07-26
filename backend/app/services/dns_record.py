import ipaddress
import re
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.dns_record import DNSRecord
from app.models.hosted_zone import HostedZone
from app.schemas.dns_record import DNSRecordCreate
from typing import List

def validate_and_compile_value(data: DNSRecordCreate) -> str:
    # normalize value to a list of strings
    values = data.value if isinstance(data.value, list) else [data.value]
    
    t = data.type.upper()
    compiled = []

    for v in values:
        if t == "A":
            try:
                ipaddress.IPv4Address(v)
            except:
                raise HTTPException(400, f"Invalid IPv4: {v}")
            compiled.append(v)
            
        elif t == "AAAA":
            try:
                ipaddress.IPv6Address(v)
            except:
                raise HTTPException(400, f"Invalid IPv6: {v}")
            compiled.append(v)
            
        elif t in ("CNAME", "NS", "PTR"):
            # Basic domain check
            if not re.match(r'^[a-zA-Z0-9\-\.\*]+$', v):
                raise HTTPException(400, f"Invalid domain name: {v}")
            compiled.append(v)
            
        elif t == "MX":
            if data.priority is None:
                raise HTTPException(400, "MX requires 'priority'")
            compiled.append(f"{data.priority} {v}")
            
        elif t == "SRV":
            if data.priority is None or data.weight is None or data.port is None:
                raise HTTPException(400, "SRV requires 'priority', 'weight', and 'port'")
            # value here is assumed to be the target if target isn't provided separately
            target = data.target if data.target else v
            compiled.append(f"{data.priority} {data.weight} {data.port} {target}")
            
        elif t == "CAA":
            if data.flags is None or data.tag is None:
                raise HTTPException(400, "CAA requires 'flags' and 'tag'")
            compiled.append(f'{data.flags} {data.tag} "{v}"')
            
        elif t == "TXT":
            compiled.append(f'"{v}"' if not v.startswith('"') else v)
            
        elif t == "SOA":
            # For simplicity, we just pass the raw value
            compiled.append(v)
            
        else:
            compiled.append(v)

    return "\n".join(compiled)

def create_dns_record(db: Session, zone_id: int, record_in: DNSRecordCreate, user_id: int) -> DNSRecord:
    _verify_zone(db, zone_id, user_id)
    
    # Validation logic here
    final_value = validate_and_compile_value(record_in)
    
    rec = DNSRecord(
        zone_id=zone_id,
        name=record_in.name,
        type=record_in.type.upper(),
        ttl=record_in.ttl,
        value=final_value,
        routing_policy=record_in.routing_policy,
        system=False
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def get_dns_records(db: Session, zone_id: int, user_id: int) -> List[DNSRecord]:
    _verify_zone(db, zone_id, user_id)
    return db.query(DNSRecord).filter(DNSRecord.zone_id == zone_id).all()

def delete_dns_record(db: Session, zone_id: int, record_id: int, user_id: int):
    _verify_zone(db, zone_id, user_id)
    rec = db.query(DNSRecord).filter(DNSRecord.id == record_id, DNSRecord.zone_id == zone_id).first()
    if not rec:
        raise HTTPException(404, "Record not found")
    if rec.system:
        raise HTTPException(400, "Cannot delete system-generated records")
    
    db.delete(rec)
    db.commit()

def search_dns_records(db: Session, zone_id: int, user_id: int, search: str = None, type_filter: str = None, page: int = 1, size: int = 20):
    _verify_zone(db, zone_id, user_id)
    query = db.query(DNSRecord).filter(DNSRecord.zone_id == zone_id)
    
    if search:
        query = query.filter(DNSRecord.name.ilike(f"%{search}%"))
    if type_filter:
        query = query.filter(DNSRecord.type == type_filter.upper())
        
    total = query.count()
    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()
    
    return items, total

def update_dns_record(db: Session, zone_id: int, record_id: int, record_in, user_id: int) -> DNSRecord:
    _verify_zone(db, zone_id, user_id)
    rec = db.query(DNSRecord).filter(DNSRecord.id == record_id, DNSRecord.zone_id == zone_id).first()
    
    if not rec:
        raise HTTPException(404, "Record not found")
    if rec.system:
        raise HTTPException(400, "Cannot update system-generated records")
        
    if record_in.ttl is not None:
        rec.ttl = record_in.ttl
    if record_in.routing_policy is not None:
        rec.routing_policy = record_in.routing_policy
        
    if record_in.value is not None:
        # To reuse validation, let's construct a temp DNSRecordCreate
        from app.schemas.dns_record import DNSRecordCreate
        temp_create = DNSRecordCreate(
            name=rec.name,
            type=rec.type,
            ttl=rec.ttl,
            value=record_in.value,
            routing_policy=rec.routing_policy,
            priority=record_in.priority,
            weight=record_in.weight,
            port=record_in.port,
            target=record_in.target,
            flags=record_in.flags,
            tag=record_in.tag
        )
        rec.value = validate_and_compile_value(temp_create)
        
    db.commit()
    db.refresh(rec)
    return rec

def _verify_zone(db: Session, zone_id: int, user_id: int):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id, HostedZone.user_id == user_id).first()
    if not zone:
        raise HTTPException(404, "Hosted zone not found")
