from pydantic import BaseModel, Field, field_validator
from typing import Optional

class HostedZoneCreate(BaseModel):
    name: str  # domain name like example.com
    type: str = 'Public'  # Public or Private
    description: Optional[str] = None
    
    @field_validator('type')
    @classmethod
    def check_type(cls, v):
        if v not in ('Public', 'Private'):
            raise ValueError('type must be Public or Private')
        return v

class HostedZoneUpdate(BaseModel):
    description: Optional[str] = None
    comment: Optional[str] = None  # keep flexible

class HostedZoneResponse(BaseModel):
    id: int
    aws_zone_id: str
    name: str
    type: str
    description: Optional[str] = None
    record_count: int
    created_at: str  # ISO format string
    
    model_config = {'from_attributes': True}
