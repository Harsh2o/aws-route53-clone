import json
import urllib.request
import urllib.error

API_BASE = "http://127.0.0.1:8000/api/v1"

def seed_zones():
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

    zones = [
        {"name": "example.com", "type": "Public", "description": "Production website"},
        {"name": "internal.example.com", "type": "Private", "description": "Internal services"},
        {"name": "demo.dev", "type": "Public", "description": "Demo environment"}
    ]

    for zone in zones:
        req = urllib.request.Request(f"{API_BASE}/hosted-zones", data=json.dumps(zone).encode('utf-8'), headers=headers)
        try:
            response = urllib.request.urlopen(req)
            print(f"Created zone: {zone['name']}")
        except urllib.error.URLError as e:
            print(f"Failed to create zone {zone['name']}: {e}")

if __name__ == "__main__":
    seed_zones()
