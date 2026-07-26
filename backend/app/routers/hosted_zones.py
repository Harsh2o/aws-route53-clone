from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneResponse, HostedZoneUpdate
from app.services import hosted_zone as hz_service
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/hosted-zones", tags=["hosted_zones"])

@router.post("", response_model=HostedZoneResponse)
def create_hosted_zone(zone_in: HostedZoneCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return hz_service.create_hosted_zone(db, zone_in, current_user)

from app.schemas.common import PaginatedResponse

@router.get("", response_model=PaginatedResponse[HostedZoneResponse])
def list_hosted_zones(
    search: Optional[str] = None,
    page: int = 1,
    size: int = 20,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    items, total = hz_service.search_hosted_zones(db, current_user, search, page, size)
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size
    )

@router.get("/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(zone_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return hz_service.get_hosted_zone(db, zone_id, current_user)

@router.put("/{zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    zone_id: int,
    update_in: HostedZoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return hz_service.update_hosted_zone(db, zone_id, update_in, current_user)

@router.delete("/{zone_id}")
def delete_hosted_zone(zone_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    hz_service.delete_hosted_zone(db, zone_id, current_user)
    return {"message": "Hosted zone deleted"}
