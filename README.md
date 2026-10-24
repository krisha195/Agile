# GearGuard — Equipment Maintenance Management System

GearGuard is a full-stack equipment maintenance and asset protection platform designed for industrial and organizational facilities. It provides role-based access control, preventative and corrective maintenance request tracking, equipment inventory management, multi-technician team coordination, kanban status boards, and scheduled calendar tracking.

---

## Tech Stack

- **Frontend:** React 19, React Router v7, `@hello-pangea/dnd` (Kanban), `@testing-library/react`, `@testing-library/jest-dom`
- **Backend:** Node.js (v20), Express.js, Mongoose, JWT Authentication, Multer (file uploads), bcryptjs
- **Database:** MongoDB
- **Testing:** Jest, Supertest, React Testing Library
- **CI/CD:** GitHub Actions (automated testing, build verification, and continuous deployment trigger)

---

## Project Structure

```text
├── .github/
│   ├── pull_request_template.md    # Agile PR review checklist & guidelines
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI/CD pipeline definition
├── backend/
│   ├── config/                      # MongoDB database connection
│   ├── controllers/                 # Auth, Equipment, Request, and Team controllers
│   ├── middleware/                  # JWT auth, role authorization, multer upload
│   ├── models/                      # Mongoose schemas (User, Equipment, Request, Team)
│   ├── routes/                      # Express route handlers
│   ├── tests/                       # Automated Jest + Supertest suites (49 tests)
│   ├── app.js                       # Decoupled Express app configuration
│   ├── server.js                    # Server bootstrap and HTTP listener
│   ├── jest.config.js               # Backend Jest test runner configuration
│   └── .env.example                 # Backend environment variable template
├── frontend/
│   ├── public/                      # Static assets and index.html
│   ├── src/
│   │   ├── __mocks__/               # Jest mocks (react-router-dom)
│   │   ├── components/              # ProtectedRoute, RoleProtectedRoute
│   │   ├── pages/                   # Dashboard, Equipment, Teams, Requests, Auth
│   │   ├── services/                # Axios/Fetch API client services
│   │   └── tests/                   # Automated React Testing Library suites (28 tests)
│   └── .env.example                 # Frontend environment variable template
├── .env.example                     # Unified environment template
├── .gitignore                       # Git ignore rules for secrets and build artifacts
├── package.json                     # Root npm script orchestrator
└── README.md                        # Project documentation and Agile guide
```

---

## Getting Started & Installation

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm (version 10 or higher)
- MongoDB instance (MongoDB Atlas or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/krisha195/Agile.git
cd Agile
```

### 2. Install Dependencies
You can install dependencies for both frontend and backend using the root command:
```bash
npm run install:all
```
Or manually in each subdirectory:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Environment Configuration

Copy the example environment files to `.env` in the appropriate locations:

### Backend Configuration (`backend/.env`):
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend Configuration (`frontend/.env`):
```ini
# In local development when running separate frontend and backend servers:
REACT_APP_API_URL=http://localhost:5000

# In production with unified Express hosting, this can be omitted to use same-origin.
```

> **Security Rule:** Never commit `.env` files or hardcoded credentials to version control. The repository `.gitignore` automatically blocks `.env*` files (except `.env.example`).

---

## Running the Application Locally

### Running Backend
```bash
cd backend
npm run dev     # Starts server with nodemon on port 5000
# or
npm start       # Starts production server with node server.js
```

### Running Frontend
```bash
cd frontend
npm start       # Starts React development server on port 3000
```

### Unified Express Serving
When `npm run build` has been executed inside `frontend/`, the Express backend serves the static production build directly on `http://localhost:5000`.

---

## Automated Testing

GearGuard includes a comprehensive automated test suite covering unit, integration, and security/role validation across both tiers. Automated tests use isolated mocks and never connect to production MongoDB.

### Test Execution Commands

| Scope | Command | Description |
|---|---|---|
| **All Tests** | `npm test` | Runs both backend and frontend automated test suites |
| **Backend Tests** | `npm run test:backend` | Runs 49 backend API & authorization tests |
| **Frontend Tests** | `npm run test:frontend` | Runs 28 frontend component & routing tests |
| **Frontend Watch** | `npm --prefix frontend run test:watch` | Runs frontend tests in interactive watch mode |

### Test Suite Coverage

#### 1. Backend Automated Tests (Jest & Supertest — 49 tests)
- **Authentication & Roles (`tests/auth.test.js` - 15 tests):**
  - User registration (success 201, duplicate email 400, database failure 500)
  - User login (valid credentials 200, non-existent email 401, incorrect password 401)
  - Protected route validation (missing token 401, expired token 401, valid token 200)
  - Role-based authorization: `User` and `Technician` access rejected with 403 on `/api/auth/users`; `Admin` and `Manager` granted 200 access
  - Admin user creation: non-admin rejected with 403, invalid role rejected with 400, success creates user with 201
- **Equipment Management (`tests/equipment.test.js` - 11 tests):**
  - Authentication guard on all endpoints (401 unauthenticated)
  - Equipment listing with category, status, and department query filters
  - Single item lookup (200 found, 404 not found)
  - Equipment creation (201 success, 500 on duplicate serial number)
  - Equipment updates (200 success, 404 missing item)
  - Equipment deletion (200 success, 404 missing item)
- **Maintenance Requests (`tests/requests.test.js` - 11 tests):**
  - Fetching requests with population and `openOnly=true` status filtering
  - Single request retrieval (200 found, 404 not found)
  - Request creation with automatic equipment team inheritance
  - Validation error handling on missing required fields (400)
  - Request status transition (`Repaired` sets `completedDate`, invalid status returns 400)
  - Request deletion (200 success, 404 missing item)
  - Scheduled maintenance retrieval formatted for calendar view
- **Teams Management (`tests/teams.test.js` - 9 tests):**
  - Team listing with member population
  - Team creation and validation (400 on missing required fields)
  - Team lookup, update, and deletion (including 404 handling)
  - Member assignment to teams (success 200, duplicate member prevention 400)
- **Base Application & Health (`tests/app.test.js` - 3 tests):**
  - `/api/health` healthcheck endpoint (200 status with JSON uptime)
  - Static frontend serving (200 status)
  - Global 404 handler for unknown API routes

#### 2. Frontend Automated Tests (React Testing Library — 28 tests)
- **Authentication Service (`src/tests/authService.test.js` - 7 tests):**
  - Token persistence and localStorage state management
  - JWT expiration detection (invalidates expired session and cleans storage)
  - Login API integration and error handling
  - Logout session cleanup and redirection
- **Route Guards & Role Protection (`src/tests/ProtectedRoute.test.js` - 5 tests):**
  - Unauthenticated access redirection to `/login`
  - Authenticated access grant to protected pages
  - Role protection: users without required roles redirected to `/unauthorized`
  - Role protection: users with matching roles allowed to view pages
- **Login Page (`src/tests/Login.test.js` - 4 tests):**
  - Input field and button rendering
  - Form validation for required fields
  - Successful login flow, localStorage token storage, and redirection
  - Error alert display on invalid credentials
- **Registration Page (`src/tests/Register.test.js` - 4 tests):**
  - 2-step registration workflow
  - Step 1 validation (Full Name, Username, Department)
  - Step 2 validation (Work Email, Password matching)
  - Success screen verification
- **Error Pages (`src/tests/NotFound.test.js` & `src/tests/Unauthorized.test.js` - 6 tests):**
  - 404 Page Not Found rendering and navigation actions
  - 403 Access Denied rendering and navigation actions

---

## Continuous Integration (CI) Workflow

The GitHub Actions workflow is defined in `.github/workflows/ci.yml`. It triggers on every push and pull request targeting the `main` branch.

### CI Jobs Structure
```mermaid
graph TD
    A[Push / Pull Request to main] --> B[Backend Tests<br/>Node 20 | Jest + Supertest]
    A --> C[Frontend Tests<br/>Node 20 | React Testing Library]
    A --> D[Frontend Production Build<br/>Node 20 | React Scripts]
    B --> E{All Checks Pass?}
    C --> E
    D --> E
    E -->|Yes on main push| F[Continuous Deployment Trigger<br/>Deploy Webhook]
    E -->|Failure| G[Pipeline Fails & Blocks Merge]
```

1. **`backend-tests`**:
   - Checks out code with `actions/checkout@v4`
   - Sets up Node.js 20 with npm caching
   - Runs `npm ci` and `npm test` inside `./backend`
   - Fails immediately if any backend test fails
2. **`frontend-tests`**:
   - Checks out code with `actions/checkout@v4`
   - Sets up Node.js 20 with npm caching
   - Runs `npm ci` and `npm test` inside `./frontend` with `CI: true`
   - Fails immediately if any frontend test fails
3. **`frontend-build`**:
   - Checks out code with `actions/checkout@v4`
   - Sets up Node.js 20 with npm caching
   - Runs `npm ci` and `npm run build` inside `./frontend` with `CI: true`
   - Ensures production bundle compiles cleanly with zero unhandled errors

---

## Continuous Deployment (CD) Strategy

### Recommended Non-Docker Deployment: Render or Railway
For a full-stack Node.js + React + MongoDB application without Docker, the most practical and reliable architecture is:

1. **Unified Web Service on Render:**
   - **Build Command:** `npm run install:all && npm run build:frontend`
   - **Start Command:** `npm run start:backend`
   - Express serves both the API endpoints (`/api/*`) and the compiled React single-page app (`frontend/build`).
   - MongoDB Atlas provides the hosted cloud database.
2. **Automated Deploy Hook via GitHub Actions:**
   - In Render, generate a Deploy Hook URL (`https://api.render.com/deploy/srv-xxxx?key=yyyy`).
   - Add this URL as a GitHub Repository Secret: `DEPLOY_HOOK_URL`.
   - The `deploy` job in `.github/workflows/ci.yml` automatically triggers this hook whenever all CI test and build checks pass on `main`.
   - If the secret is not configured yet, the pipeline logs a warning and exits cleanly without failing previous verification checks.

### Required Production Secrets
Configure these in your hosting provider's dashboard (e.g., Render Environment Settings):
- `MONGODB_URI`: Production MongoDB Atlas connection string.
- `JWT_SECRET`: High-entropy random cryptographic key for signing tokens.
- `PORT`: Automatically provided by hosting platform (default 5000).
- `NODE_ENV`: Set to `production`.

---

## Git Branching & Pull Request Workflow

### Recommended Agile Branching Model
- **`main` Branch:** Protected production-ready branch. Direct pushes to `main` should be restricted.
- **`feature/*` Branches:** Feature and test development (e.g., `feature/automated-tests`).
- **`bugfix/*` Branches:** Dedicated branches for bug resolutions.

### Recommended GitHub Branch Protection Rules
In your GitHub repository settings under **Settings > Branches > Branch protection rules** for `main`:
1. Check **Require a pull request before merging**.
   - Require at least 1 approval.
2. Check **Require status checks to pass before merging**:
   - Require `Backend Tests (Node.js 20)`
   - Require `Frontend Tests (Node.js 20)`
   - Require `Frontend Production Build`
3. Check **Require branches to be up to date before merging**.
4. Check **Do not allow bypassing the above settings**.

---

## Agile Project Submission & Screenshot Guide

To capture documentation evidence for your Agile project submission:

1. **Pull Request & Branch Workflow Evidence:**
   - Push your feature branch:
     ```bash
     git push -u origin feature/automated-tests
     ```
   - Open GitHub repository: `https://github.com/krisha195/Agile`.
   - Click **Compare & pull request**.
   - Complete the Pull Request template checklist and create the PR.
   - Screenshot the open Pull Request showing the description, commits, and files changed.
2. **GitHub Actions CI Evidence:**
   - Go to the **Actions** tab on GitHub (`https://github.com/krisha195/Agile/actions`).
   - Click on the running/completed workflow run for your commit or PR.
   - Screenshot the workflow graph showing green checkmarks for:
     - `Backend Tests (Node.js 20)`
     - `Frontend Tests (Node.js 20)`
     - `Frontend Production Build`
   - Click into each job to show the passed test count (49 backend tests, 28 frontend tests).
3. **Local Test Execution Evidence:**
   - Run `npm test` from the root directory in your terminal and take a clear screenshot showing all 11 test suites passing.
