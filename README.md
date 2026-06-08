# 🎪 EventHub — Event Registration System

A full-stack event registration platform that allows organizers to create and manage events while enabling attendees to discover and register online. Built with modern technologies and deployed to production.

> Supports **SDG 11** (Sustainable Cities and Communities) by facilitating community engagement and cultural activities.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [event-registration-ivory.vercel.app](https://event-registration-ivory.vercel.app) |
| ⚙️ Backend API | [event-registration-2-vhmb.onrender.com](https://event-registration-2-vhmb.onrender.com) |

### 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🎪 Organizer | organizer2@test.com | password123 |
| 🎟️ Attendee | attendee2@test.com | password123 |

---

## ✨ Features

### 🎟️ For Attendees
- Browse and search published events
- Filter events by category, city, or keyword
- View event details with real-time capacity info
- Register for events (auto waitlist when full)
- View and manage registrations from personal dashboard
- Cancel registrations anytime

### 🎪 For Organizers
- Create events with image upload
- Publish, unpublish, edit, or delete events
- View full attendee list per event
- Mark attendance for confirmed registrants
- Dashboard with event stats and registration counts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | HTTP client |
| Supabase Storage | Image uploads |
| Dayjs | Date formatting |

### Backend
| Technology | Purpose |
|------------|---------|
| NestJS | Node.js framework |
| Prisma ORM | Database access |
| PostgreSQL (Neon) | Database |
| JWT + Passport | Authentication |
| Bcrypt | Password hashing |
| Supabase | File storage |
| Multer | File handling |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon | Serverless PostgreSQL |
| Supabase | Image storage |
| Docker | Containerization |
| GitHub | Version control |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Next.js Frontend (Vercel)       │
│   event-registration-ivory.vercel   │
└──────────────────┬──────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────┐
│     NestJS REST API (Render)        │
│   Controllers → Services → Prisma  │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│     PostgreSQL Database (Neon)      │
│   Users, Events, Registrations     │
└─────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Event-Registration/
├── docker-compose.yml
├── .env.example
│
├── event-registration-api/          # NestJS Backend
│   ├── Dockerfile
│   ├── src/
│   │   ├── auth/                    # JWT Authentication
│   │   ├── events/                  # Events CRUD
│   │   ├── registrations/           # Registration logic
│   │   ├── categories/              # Event categories
│   │   ├── upload/                  # Supabase image upload
│   │   └── prisma/                  # Database service
│   └── prisma/
│       ├── schema.prisma            # Database schema
│       └── seed.ts                  # Seed categories
│
└── event-registration-frontend/     # Next.js Frontend
    ├── Dockerfile
    └── src/
        ├── app/
        │   ├── page.tsx             # Homepage
        │   ├── login/               # Login page
        │   ├── register/            # Register page
        │   ├── events/[id]/         # Event details
        │   ├── attendee/dashboard/  # Attendee dashboard
        │   └── organizer/           # Organizer pages
        ├── components/
        ├── context/
        ├── services/
        └── lib/
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user | Public |
| POST | `/auth/login` | Login user | Public |

### Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events` | List published events | Public |
| GET | `/events/:id` | Get event details | Public |
| POST | `/events` | Create event | Organizer |
| PATCH | `/events/:id` | Update event | Organizer |
| DELETE | `/events/:id` | Delete event | Organizer |
| GET | `/events/my-events` | Organizer's events | Organizer |

### Registrations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/registrations` | Register for event | Attendee |
| GET | `/registrations` | My registrations | Attendee |
| GET | `/registrations/event/:id` | Event attendees | Organizer |
| DELETE | `/registrations/:id` | Cancel registration | Attendee |
| PATCH | `/registrations/:id/attendance` | Mark attendance | Organizer |

### Other
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | List categories | Public |
| POST | `/upload/image` | Upload image | Authenticated |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- Docker & Docker Compose (optional)
- PostgreSQL or [Neon](https://neon.tech) account
- [Supabase](https://supabase.com) account

### Option 1 — Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/HamdiNur/Event-Registration.git
cd Event-Registration

# Copy and fill in environment variables
cp .env.example .env

# Build and run both services
docker-compose up --build
```

- Frontend → http://localhost:3000
- Backend → http://localhost:3001

### Option 2 — Manual Setup

#### Backend

```bash
cd event-registration-api
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

#### Frontend

```bash
cd event-registration-frontend
npm install
cp .env.example .env.local
npm run dev
```

---

##  Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3001
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🐳 Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

---

## 👨‍💻 Author

**Hamdi Nur**
- GitHub: [@HamdiNur](https://github.com/HamdiNur)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

