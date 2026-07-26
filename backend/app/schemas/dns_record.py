from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional, List, Union
import ipaddress
import re

class DNSRecordCreate(BaseModel):
    name: str
    type: str = Field(..., pattern="^(A|AAAA|CNAME|MX|NS|PTR|SOA|SRV|TXT|CAA)$")
    ttl: int = Field(300, ge=0, le=2147483647)
    value: Union[str, List[str]]
    routing_policy: str = "Simple"
    
    priority: Optional[int] = Field(None, ge=0, le=65535)
    weight: Optional[int] = Field(None, ge=0, le=65535)
    port: Optional[int] = Field(None, ge=0, le=65535)
    target: Optional[str] = None
    flags: Optional[int] = Field(None, ge=0, le=255)
    tag: Optional[str] = None
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9\-\.\*\_]+$', v):
            raise ValueError("Invalid DNS name format")
        return v

    @field_validator('value')
    @classmethod
    def validate_value_type(cls, v, info: ValidationInfo):
        # We handle detailed validation in the service layer where we build the canonical value string
        return v

class DNSRecordResponse(BaseModel):
    id: int
    zone_id: int
    name: str
    type: str
    ttl: int
    value: str
    routing_policy: str
    system: bool

    model_config = {"from_attributes": True}

class DNSRecordUpdate(BaseModel):
    ttl: Optional[int] = Field(None, ge=0, le=2147483647)
    value: Optional[Union[str, List[str]]] = None
    routing_policy: Optional[str] = None
    
    priority: Optional[int] = Field(None, ge=0, le=65535)
    weight: Optional[int] = Field(None, ge=0, le=65535)
    port: Optional[int] = Field(None, ge=0, le=65535)
    target: Optional[str] = None
    flags: Optional[int] = Field(None, ge=0, le=255)
    tag: Optional[str] = None
