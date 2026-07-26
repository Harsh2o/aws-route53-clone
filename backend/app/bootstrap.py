from sqlalchemy.orm import Session
from app.models.user import User
from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.services.auth import get_password_hash

def bootstrap_database(db: Session):
    # Check if database is already populated
    if db.query(User).first():
        return

    # Create admin user
    admin_user = User(
        username="admin",
        hashed_password=get_password_hash("admin123")
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # Create demo hosted zone
    zone = HostedZone(
        user_id=admin_user.id,
        name="selection-demo-2.com",
        type="Public",
        description="Demo zone with all record types",
        aws_zone_id="Z0123456789ABCDEF"
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)

    # We skip creating the default NS/SOA via the service layer because we want explicit control
    # to perfectly replicate the demo state.

    demo_records = [
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="A", ttl=300, value="192.168.1.10", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="ipv6.selection-demo-2.com", type="AAAA", ttl=300, value="2001:0db8:85a3:0000:0000:8a2e:0370:7334", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="www.selection-demo-2.com", type="CNAME", ttl=300, value="selection-demo-2.com.", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="TXT", ttl=300, value='"v=spf1 include:_spf.google.com ~all"', routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="MX", ttl=300, value="10 mail.selection-demo-2.com.", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="NS", ttl=172800, value="ns-1536.awsdns-00.co.uk.\nns-0.awsdns-00.com.\nns-1024.awsdns-00.org.\nns-512.awsdns-00.net.", routing_policy="Simple", system=True),
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="SOA", ttl=900, value="ns-1536.awsdns-00.co.uk. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400", routing_policy="Simple", system=True),
        DNSRecord(zone_id=zone.id, name="dev.selection-demo-2.com", type="NS", ttl=86400, value="ns-123.awsdns-11.com.", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="10.1.168.192.in-addr.arpa", type="PTR", ttl=300, value="server1.selection-demo-2.com.", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="_sip._tcp.selection-demo-2.com", type="SRV", ttl=300, value="10 5 5060 sipserver.selection-demo-2.com.", routing_policy="Simple", system=False),
        DNSRecord(zone_id=zone.id, name="selection-demo-2.com", type="CAA", ttl=300, value='0 issue "letsencrypt.org"', routing_policy="Simple", system=False),
    ]

    for record in demo_records:
        db.add(record)
    
    zone.record_count = len(demo_records)
    db.commit()
