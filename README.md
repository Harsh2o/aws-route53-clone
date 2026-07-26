<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS Logo" width="100" />
  <h1>AWS Route 53 Console Clone</h1>
  <p>A high-fidelity, full-stack clone of the Amazon Web Services (AWS) Route 53 Management Console.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Cloudscape-Design-232F3E?style=for-the-badge&logo=amazon-aws" alt="Cloudscape" />
    <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </div>
</div>

<br />

> **Live Demo:** [View Live Application Here](#) *(Replace with Vercel Link)*
> 
> **Demo Credentials:** 
> - **Username:** `admin` 
> - **Password:** `admin123`

---

## 🎯 Project Overview

This project is a comprehensive full-stack clone of the **AWS Route 53 Console**. Built as part of a highly rigorous engineering assessment, it demonstrates modern full-stack development practices, deep architectural planning, and an uncompromising commitment to pixel-perfect UI replication using the official **AWS Cloudscape Design System**.

## ✨ Key Features

- **Pixel-Perfect AWS UI**: Faithfully replicates the exact look, feel, and layout of the real AWS Management Console (including Dark Mode, Dashboard, and Login flows).
- **Hosted Zones Management**: Create, view, and delete Public or Private hosted zones with dynamic conditional rendering for VPC assignments.
- **DNS Records Management**: Comprehensive support for 9 DNS record types (`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`).
- **Dynamic Form Validation**: The "Create Record" modal intelligently adapts its input fields based on the selected Record Type (e.g., dynamically requiring Priority/Weight/Port for SRV records).
- **System Record Protection**: `NS` and `SOA` records are automatically generated and strictly protected from manual editing or deletion, mimicking real DNS behavior.
- **Robust Authentication**: Secure, stateful cookie-based JWT authentication (`HttpOnly` cookies) using OAuth2 Password Bearer flow.
- **Advanced State Management**: Utilizes React Query for flawless data synchronization, caching, and loading states.

## 🏗️ Architecture & Tech Stack

This repository is structured as a decoupled monorepo:

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** AWS Cloudscape Design System
- **State Management:** TanStack React Query v5
- **Styling:** CSS Modules & Global overrides

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite (Dev) / PostgreSQL (Production)
- **ORM:** SQLAlchemy with Pydantic schemas
- **Auth:** JWT (JSON Web Tokens) with Bcrypt password hashing

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (Creates the admin user and test data)
python seed_demo.py

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
*The backend API will be running at `http://localhost:8000`.*
*Interactive API Documentation (Swagger) is available at `http://localhost:8000/docs`.*

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will be running at `http://localhost:3000`.*

---

## 📝 Design Decisions & Assumptions

- **Mocked AWS Infrastructure**: For "Private" hosted zones, the AWS Region and VPC ID dropdowns are purely visual implementations to demonstrate conditional UI rendering matching Route 53.
- **Synchronous Operations**: Real DNS propagation takes time, but in this clone, record creation and deletion are handled synchronously for immediate user feedback.
- **UI Placeholders**: Dashboard metrics and some sidebar navigation items (like Traffic Policies) are visually present to complete the authentic AWS Console illusion, focusing the functional implementation specifically on Hosted Zones and DNS management.

---

<div align="center">
  <i>Built with passion and precision.</i>
</div>
