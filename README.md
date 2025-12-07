# NexImprove-Task


## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User dashboard with profile view
- Demo API integrations
- PostgreSQL database
- Prisma ORM with migrations
- Dockerized backend and database
- Persistent data storage

---

## Architecture

NexImprove follows a client-server architecture using containerized backend services and a persistent database. Components communicate over REST and TCP within a Docker network.
```
Frontend (React)
│
▼
Backend API (Node.js + Express + Prisma)
│
▼
PostgreSQL Database (Docker volume)
```

---

## Docker Architecture

The system uses multiple containers managed by Docker Compose:

- `db`: PostgreSQL database
- `backend`: Node.js API server

Containers communicate using an internal Docker network. The backend resolves the database using the hostname `db`.

### docker-compose.yml
```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: onboarding_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: backend
    environment:
      - DATABASE_URL=postgresql://admin:admin@db:5432/onboarding_db?schema=public
      - JWT_SECRET=your-secret-key
      - PORT=5000
    depends_on:
      - db
    ports:
      - "5000:5000"
    command: npm run dev

volumes:
  pgdata:
```

---

## Technology Stack

### Frontend
- React.js
- Vite
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcrypt

### Database
- PostgreSQL

### Infrastructure
- Docker
- Docker Compose

---

## Security Architecture

NexImprove implements layered security practices to safeguard user data, access, and system integrity.

### Authentication
- JWT-based authentication
- Access tokens signed with secure secret
- Optional refresh token flow

### Password Security
- Password hashing using bcrypt
- Salting and secure comparison
- No plaintext storage

### API Security
- Auth middleware validates tokens
- Protected routes for sensitive data
- Least-privilege access patterns

### Database Security
- Database isolated in Docker container
- Private internal network access
- Data persistence via volumes

### Environment Security
- Secrets stored in environment variables
- `.env` excluded from version control
- No secrets in source code

### Input Validation
- Sanitization for user inputs
- SQL injection protection via ORM
- XSS and injection-safe API routing

### Production Recommendations
- HTTPS enforcement
- Reverse proxy with Nginx
- Rate limiting
- Centralized logging
- Secret vaulting
- Automated security patches

---

## Project Structure
```
NexImprove/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your/repo.git
cd NexImprove
```

### 2. Create Environment Variables

Create `.env` in backend:
```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/onboarding_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=5000
CLOUDINARY_URL="cloudinary://your-api-key:your-api-secret@your-cloud-name"
MY_GMAIL="your-email@gmail.com"
MY_PASS="your-app-password"
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Setup Database
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Application

**Option 1: Local Development**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Docker**
```bash
docker-compose up --build
```

### 6. Access Application

Backend API:
```
http://localhost:5000
```

Frontend:
```
http://localhost:5173
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/verify       - Verify JWT token
```

### User
```
GET  /api/user/profile      - Get user profile
PUT  /api/user/profile      - Update user profile
GET  /api/user/dashboard    - Get dashboard data
```

### Demo Data
```
GET /api/demo/users         - Get demo users
GET /api/demo/products      - Get demo products
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://admin:admin@localhost:5432/onboarding_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-here` |
| `PORT` | Backend server port | `5000` |
| `MY_GMAIL` | Email for notifications | `youremail@gmail.com` |
| `MY_PASS` | Email app password | `your-app-password` |

---

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Development

### Run Backend in Development Mode
```bash
cd backend
npm run dev
```

### Run Frontend in Development Mode
```bash
cd frontend
npm run dev
```

### View Database with Prisma Studio
```bash
cd backend
npx prisma studio
```
