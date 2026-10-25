# ⚙️ GearGuard — Enterprise Equipment Maintenance Management System

<div align="center">

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/krisha195/Agile/actions)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js 20](https://img.shields.io/badge/Backend-Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

**A full-stack, enterprise-grade solution for tracking industrial equipment, managing cross-functional maintenance teams, and automating work-order lifecycles with real-time Kanban and Calendar workflows.**

<br/>

<!-- Quick Navigation Buttons -->
<p align="center">
  <a href="#-quick-start-with-docker">
    <img src="https://img.shields.io/badge/🚀_Quick_Start-Docker_Setup-2563EB?style=for-the-badge" alt="Quick Start" />
  </a>
  &nbsp;
  <a href="#-core-features">
    <img src="https://img.shields.io/badge/✨_Features-Explore-7C3AED?style=for-the-badge" alt="Features" />
  </a>
  &nbsp;
  <a href="#-api-endpoints-overview">
    <img src="https://img.shields.io/badge/📡_API-Endpoints-059669?style=for-the-badge" alt="API Endpoints" />
  </a>
  &nbsp;
  <a href="#-automated-testing--cicd">
    <img src="https://img.shields.io/badge/🧪_Testing-CI%2FCD_Guide-D97706?style=for-the-badge" alt="Testing" />
  </a>
  &nbsp;
  <a href="#-manual-development-setup">
    <img src="https://img.shields.io/badge/💻_Manual-Local_Setup-4B5563?style=for-the-badge" alt="Manual Setup" />
  </a>
</p>

</div>

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Manual Development Setup](#-manual-development-setup)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Automated Testing & CI/CD](#-automated-testing--cicd)
- [Project Directory Structure](#-project-directory-structure)

---

## 🔭 Project Overview

**GearGuard** is engineered to eliminate industrial machinery downtime through structured preventive and corrective maintenance. Developed within an Agile methodology, it bridges the gap between field operators who report issues and maintenance engineers who inspect, service, and sign off on equipment repairs.

### Key Value Highlights:
* 🛡️ **Zero Downtime Ambition:** Real-time visibility into machine health, status, and service schedules.
* 📋 **Multi-Stage Workflows:** Track requests from `New` ➔ `In Progress` ➔ `Repaired` ➔ `Scrapped`.
* 👥 **Role-Based Governance:** Built-in Role-Based Access Control (RBAC) protecting critical administrative functions.
* 🐳 **Containerized & Production Ready:** Includes isolated Docker containers with automated Nginx reverse proxying and persistent volumes.

---

## 🏛️ System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │               Web Browser               │
                    └────────────────────┬────────────────────┘
                                         │ (Port 3000 / 80)
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │        Frontend (Nginx + React)         │
                    │   - Serves Single Page App (SPA)        │
                    │   - Reverse-proxies /api/ and /uploads/ │
                    └────────────────────┬────────────────────┘
                                         │ Internal Network
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │       Backend (Node.js + Express)       │
                    │   - RESTful API & Business Logic        │
                    │   - JWT Auth & Role Middleware          │
                    │   - Multer Multipart Image Uploads      │
                    └──────────┬───────────────────┬──────────┘
                               │                   │
                               ▼                   ▼
                     ┌──────────────────┐ ┌──────────────────┐
                     │ MongoDB Database │ │ Uploads Volume   │
                     │ (Port 27017)     │ │ (Disk Storage)   │
                     └──────────────────┘ └──────────────────┘
```

---

## ✨ Core Features

| Feature | Description |
|:---|:---|
| **🔐 Role-Based Access Control** | Tailored privileges for **Admin**, **Manager**, **Technician**, and standard **User** roles with token-based JWT protection. |
| **🏭 Asset & Equipment Tracking** | Comprehensive inventory records with serial numbers, warranty dates, location, department, and live status indicators. |
| **👥 Maintenance Teams** | Organize technicians into specialized units (Mechanical, Electrical, Facilities) with assigned team leaders. |
| **📌 Interactive Kanban Board** | Drag-and-drop / stage-advancing interface to visualize bottlenecks and reassign repair requests. |
| **📅 Preventative Calendar** | Visual monthly schedule for upcoming recurring inspections and scheduled downtime. |
| **📊 Analytics & KPI Dashboard** | Live operational metrics: open request counts, MTTR indicators, team workloads, and exportable reports. |
| **🛠️ Standalone Admin Monitor** | Dedicated administrative micro-dashboard ([`dashboard/`](file:///dashboard)) for monitoring server health. |

---

## 🚀 Quick Start with Docker

The fastest way to launch the entire GearGuard application with Database, Backend, and Frontend configured:

### 1. Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20+ recommended)
* [Docker Compose](https://docs.docker.com/compose/) (v2+ included with Docker Desktop)

### 2. Launch the Stack
Run the following command in the project root:

```bash
docker compose up --build
```

### 3. Access Services

| Service | URL | Purpose |
|:---|:---|:---|
| **Frontend Application** | [http://localhost:3000](http://localhost:3000) | Main React Web Portal |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | Express API Server |
| **MongoDB Instance** | `localhost:27017` | Database Container |

To run in the background (detached mode):
```bash
docker compose up -d
```

To stop all services and persist data:
```bash
docker compose down
```

---

## 💻 Manual Development Setup

If you prefer to run services locally without Docker:

### 1. Prerequisites
* **Node.js**: v20 or higher (`node -v`)
* **npm**: v10 or higher (`npm -v`)
* **MongoDB**: Local MongoDB instance running on `localhost:27017` or a MongoDB Atlas URI

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from template
cp ../.env.example .env

# Start development server with live reload
npm run dev
```
> Backend runs at: `http://localhost:5000`

### 3. Frontend Setup
Open a second terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```
> Frontend runs at: `http://localhost:3000`

---

## ⚙️ Environment Configuration

Refer to [`.env.example`](file:///.env.example) for environment settings:

```ini
# Backend Environment
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your_jwt_secret_key_here

# Frontend Environment
REACT_APP_API_URL=http://localhost:5000
```

---

## 📡 API Endpoints Overview

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user account
* `POST /api/auth/login` — Authenticate and receive JWT token
* `GET  /api/auth/me` — Get profile information of authenticated user
* `GET  /api/auth/users` — List system users *(Admin/Manager)*

### 🏭 Equipment Management (`/api/equipment`)
* `GET    /api/equipment` — Retrieve paginated list of equipment
* `POST   /api/equipment` — Register new machinery
* `GET    /api/equipment/:id` — Inspect equipment specifications & history
* `PUT    /api/equipment/:id` — Update equipment record
* `DELETE /api/equipment/:id` — Decommission equipment

### 👥 Team Management (`/api/teams`)
* `GET    /api/teams` — List all maintenance teams
* `POST   /api/teams` — Create a new technician team
* `GET    /api/teams/:id` — Get team details & member roster
* `PUT    /api/teams/:id` — Update team allocation

### 📋 Maintenance Requests (`/api/requests`)
* `GET    /api/requests` — Query maintenance work orders
* `POST   /api/requests` — Submit new request *(Supports multipart image upload)*
* `GET    /api/requests/:id` — Request audit history & stages
* `PUT    /api/requests/:id` — Update status (`New` ➔ `In Progress` ➔ `Repaired`)

---

## 🧪 Automated Testing & CI/CD

This repository enforces quality and security through a **4-stage automated GitHub Actions CI/CD pipeline** ([`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml)):

```
  ┌─────────────────┐       ┌─────────────────┐
  │ Security Audit  │       │  Backend Tests  │
  │   (npm audit)   │       │ (Node Test/TAP) │
  └─────────────────┘       └────────┬────────┘
                                     │
  ┌─────────────────┐                │
  │ Frontend Tests  │                │
  │  (Jest / RTL)   │                │
  └────────┬────────┘                │
           └────────────┬────────────┘
                        ▼
            ┌───────────────────────┐
            │ Production Build &    │
            │ Artifact Archiving    │
            └───────────────────────┘
```

### Running Tests Locally:

* **Backend Tests:**
  ```bash
  cd backend
  npm test
  ```
* **Frontend Tests:**
  ```bash
  cd frontend
  npm test -- --watchAll=false
  ```

---

## 📁 Project Directory Structure

```text
├── .github/
│   └── workflows/ci.yml        # GitHub Actions CI/CD configuration
├── backend/
│   ├── config/db.js            # MongoDB Mongoose connection
│   ├── controllers/            # Route controllers (Auth, Equipment, Request, Team)
│   ├── middleware/             # Auth, RBAC, and Multer file upload handlers
│   ├── models/                 # Mongoose schemas (User, Equipment, Request, Team)
│   ├── routes/                 # REST API endpoints
│   ├── tests/                  # Backend unit test suites
│   ├── Dockerfile              # Production Node.js Dockerfile
│   └── server.js               # Express application entrypoint
├── frontend/
│   ├── public/                 # Static assets & HTML template
│   ├── src/
│   │   ├── components/         # ProtectedRoute & shared UI components
│   │   ├── pages/              # Views (Dashboard, Equipment, Teams, Requests)
│   │   ├── services/           # Axios & Fetch API service layer
│   │   ├── App.js              # React Router view definitions
│   │   └── App.test.js         # Frontend test suite
│   ├── Dockerfile              # Multi-stage production Nginx Dockerfile
│   └── nginx.conf              # SPA routing & reverse proxy configuration
├── dashboard/                  # Standalone administrative monitor tool
├── docker-compose.yml          # Full-stack Docker orchestration
├── .env.example                # Sample environment template
└── README.md                   # Project documentation
```

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute as needed for academic or production purposes.
