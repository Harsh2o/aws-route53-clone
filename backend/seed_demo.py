import json
import urllib.request
import urllib.error

API_BASE = "http://127.0.0.1:8000/api/v1"

def seed_demo():
    # Login first
    data = json.dumps({"username": "admin", "password": "admin123"}).encode('utf-8')
    req = urllib.request.Request(f"{API_BASE}/auth/login", data=data, headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(req)
        cookie = response.headers.get('Set-Cookie')
        print("Logged in successfully.")
    except urllib.error.URLError as e:
        print(f"Failed to login: {e}")
        return

    headers = {
        'Content-Type': 'application/json',
        'Cookie': cookie
    }

    # Create zone
    zone = {"name": "selection-demo-2.com", "type": "Public", "description": "Demo zone with all record types"}
    req = urllib.request.Request(f"{API_BASE}/hosted-zones", data=json.dumps(zone).encode('utf-8'), headers=headers)
    try:
        response = urllib.request.urlopen(req)
        created_zone = json.loads(response.read().decode())
        zone_id = created_zone['id']
        print(f"Created zone: {zone['name']} (ID: {zone_id})")
    except urllib.error.URLError as e:
        print(f"Failed to create zone {zone['name']}: {e}")
        return

    # Records to create
    records = [
        {"name": "selection-demo-2.com", "type": "A", "ttl": 300, "value": "192.168.1.10"},
        {"name": "ipv6.selection-demo-2.com", "type": "AAAA", "ttl": 300, "value": "2001:0db8:85a3:0000:0000:8a2e:0370:7334"},
        {"name": "www.selection-demo-2.com", "type": "CNAME", "ttl": 300, "value": "selection-demo-2.com."},
        {"name": "selection-demo-2.com", "type": "TXT", "ttl": 300, "value": "\"v=spf1 include:_spf.google.com ~all\""},
        {"name": "selection-demo-2.com", "type": "MX", "ttl": 300, "value": "mail.selection-demo-2.com.", "priority": 10},
        {"name": "dev.selection-demo-2.com", "type": "NS", "ttl": 86400, "value": "ns-123.awsdns-11.com."},
        {"name": "10.1.168.192.in-addr.arpa", "type": "PTR", "ttl": 300, "value": "server1.selection-demo-2.com."},
        {"name": "_sip._tcp.selection-demo-2.com", "type": "SRV", "ttl": 300, "value": "sipserver.selection-demo-2.com.", "priority": 10, "weight": 5, "port": 5060, "target": "sipserver.selection-demo-2.com."},
        {"name": "selection-demo-2.com", "type": "CAA", "ttl": 300, "value": "letsencrypt.org", "flags": 0, "tag": "issue"}
    ]

    for record in records:
        req = urllib.request.Request(f"{API_BASE}/hosted-zones/{zone_id}/records", data=json.dumps(record).encode('utf-8'), headers=headers)
        try:
            response = urllib.request.urlopen(req)
            print(f"Created record: {record['name']} ({record['type']})")
        except urllib.error.URLError as e:
            print(f"Failed to create record {record['name']}: {e}")

if __name__ == "__main__":
    seed_demo()
