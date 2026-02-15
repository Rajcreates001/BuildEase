# Buildease - AI Powered Construction Platform (MERN Stack)

A full-stack MERN (MongoDB, Express, React, Node.js) application for construction project management, featuring AI-powered design tools, budget calculators, marketplace, and contractor-customer matching.

## Project Structure

```
Buildease-MERN/
├── backend/              # Express.js API server (Deploy on Render)
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth middleware (JWT)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── seed/             # Database seeder
│   └── server.js         # Entry point
│
├── frontend/             # React + Vite app (Deploy on Vercel)
│   ├── src/
│   │   ├── api/          # Axios API layer
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   └── pages/        # Page components
│   ├── vercel.json       # Vercel config
│   └── vite.config.js    # Vite config
│
└── README.md
```

## Features

### Customer Dashboard
- **AI Designer & Budget Calculator** – Generate design concepts with cost estimates
- **Materials Marketplace** – Browse Indian & foreign construction brands
- **Hire Builders** – Post projects and find verified contractors
- **Track Project** – Real-time progress tracking with milestones
- **AI Budget Predictor** – Predict contractor quotes
- **Billing** – Transaction history

### Contractor Dashboard
- **Portfolio** – Showcase completed projects
- **View Projects** – Browse and bid on open projects
- **Manage Workers** – Add, assign, and track workforce
- **AI Quotation Tool** – Generate detailed project quotes
- **Payouts** – Earnings and billing

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios  |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB (Atlas)                      |
| Auth       | JWT (JSON Web Tokens), bcrypt        |
| Deploy     | Vercel (frontend), Render (backend)  |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Buildease-MERN
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file from example
cp .env.example .env
# Edit VITE_API_URL if needed (defaults to http://localhost:5000/api)

# Start development server
npm run dev
```

### 4. Test Accounts (after seeding)
| Role       | Email                    | Password     |
|------------|--------------------------|--------------|
| Customer   | alex@buildease.com       | password123  |
| Contractor | prestige@buildease.com   | password123  |

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `MONGODB_URI` – Your MongoDB Atlas connection string
   - `JWT_SECRET` – A strong random string
   - `NODE_ENV` – `production`
   - `CLIENT_URL` – Your Vercel frontend URL (e.g., `https://buildease.vercel.app`)

### Frontend → Vercel

1. Import your repository on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add **Environment Variable**:
   - `VITE_API_URL` – Your Render backend URL + `/api` (e.g., `https://buildease-api.onrender.com/api`)

---

## API Endpoints

### Auth
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | /api/auth/register   | Register new user      |
| POST   | /api/auth/login      | Login user             |
| GET    | /api/auth/me         | Get current user       |
| PUT    | /api/auth/profile    | Update profile         |

### Projects
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/projects               | List all projects        |
| GET    | /api/projects/my            | Get user's projects      |
| POST   | /api/projects               | Create project           |
| POST   | /api/projects/:id/bid       | Submit bid               |
| PUT    | /api/projects/:id/progress  | Update progress          |

### Marketplace
| Method | Endpoint                | Description            |
|--------|-------------------------|------------------------|
| GET    | /api/marketplace        | List items             |
| POST   | /api/marketplace/orders | Create order           |
| GET    | /api/marketplace/orders | Get user orders        |

### Contractors
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| GET    | /api/contractors     | List contractors       |
| GET    | /api/contractors/:id | Get contractor profile |

### Workers
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/workers      | List workers       |
| POST   | /api/workers      | Add worker         |
| PUT    | /api/workers/:id  | Update worker      |
| DELETE | /api/workers/:id  | Delete worker      |

### Budget
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | /api/budget/estimate  | Calculate estimate    |
| POST   | /api/budget/quotation | Generate quotation    |
| POST   | /api/budget/prediction| Budget prediction     |
| GET    | /api/budget/rates     | Get market rates      |

---

## License

MIT
