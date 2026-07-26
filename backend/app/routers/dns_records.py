from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.dns_record import DNSRecordCreate, DNSRecordResponse, DNSRecordUpdate
from app.services import dns_record as dns_service
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/hosted-zones/{zone_id}/records", tags=["dns_records"])

@router.post("", response_model=DNSRecordResponse)
def create_record(zone_id: int, record_in: DNSRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dns_service.create_dns_record(db, zone_id, record_in, current_user.id)

from app.schemas.common import PaginatedResponse

@router.get("", response_model=PaginatedResponse[DNSRecordResponse])
def list_records(
    zone_id: int,
    search: Optional[str] = None,
    type: Optional[str] = None,
    page: int = 1,
    size: int = 20,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    items, total = dns_service.search_dns_records(db, zone_id, current_user.id, search, type, page, size)
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size
    )

@router.put("/{record_id}", response_model=DNSRecordResponse)
def update_record(
    zone_id: int, 
    record_id: int, 
    record_in: DNSRecordUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return dns_service.update_dns_record(db, zone_id, record_id, record_in, current_user.id)

@router.delete("/{record_id}")
def delete_record(zone_id: int, record_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dns_service.delete_dns_record(db, zone_id, record_id, current_user.id)
    return {"message": "Record deleted"}
