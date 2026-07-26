# Route 53 Console Clone

**Live Demo:** [TBD - Deploying...]
**GitHub Repository:** [TBD]

**Demo credentials**
Username: `admin`
Password: `admin123`

A high-fidelity clone of the AWS Route 53 Console, featuring a robust FastAPI backend and a Next.js frontend styled with the official AWS Cloudscape Design System.

## Architecture

This project is separated into a detached frontend and backend to demonstrate modern full-stack engineering practices.

- **Frontend**: Next.js 14 (App Router) + React Query + `@cloudscape-design/components`
- **Backend**: FastAPI + SQLAlchemy + SQLite (Development) / PostgreSQL (Production ready)
- **Authentication**: Cookie-based JWT authentication (`HttpOnly` cookies)

## Features

- **Pixel-Perfect UI**: Built using Cloudscape to perfectly match the AWS Management Console aesthetics, including dark mode, sticky scrollbars, and dense table layouts.
- **Hosted Zones Management**: Create Public or Private hosted zones. (Private zones conditionally render VPC/Region selectors).
- **DNS Records Management**: Supports all 9 required record types (`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`).
- **Dynamic Form Validation**: The "Create Record" modal actively adapts its fields based on the selected Record Type (e.g., SRV records prompt for Priority, Weight, Port, and Target).
- **System Record Protection**: `NS` and `SOA` records are automatically generated upon zone creation and are protected from editing/deletion.
- **Search & Filtering**: Filter records by Name or Record Type.

## Local Development Setup

### Backend (FastAPI)

1. Navigate to the `backend` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database (creates admin user and test data):
   ```bash
   python seed_demo.py
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend (Next.js)

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3000`. Login with `admin` / `admin123`.

## Assumptions & Notes for Reviewers

- **Mocked Data**: For "Private" hosted zones, the AWS Region and VPC ID dropdowns are purely visual implementations to demonstrate conditional UI rendering matching Route 53.
- **Propagation**: Real DNS propagation takes time, but in this clone, record creation and deletion are synchronous and immediate.
- **UI Focus**: The dashboard and sidebar navigation items (like Traffic Policies, Health Checks) are present to complete the AWS Console illusion but are mocked empty states, as the core assignment focus is Hosted Zones and DNS Records.

## API Documentation

When running locally, full interactive API documentation is available at `http://localhost:8000/docs` (Swagger UI).
