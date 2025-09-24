Dummy DME-API 
- **Backend** (Node.js + Express + MongoDB)
- **Frontend** (HTML + Vanilla JS + CSS)
- **MongoDB** database (Dockerized)
- 
## Features
- User authentication (Register / Login with JWT)
- Manage DMEs (create, view, list)
- Manage Orders (create, update status, list by DME)
- Order status mapped to standardized codes/messages
- Dockerized backend + MongoDB
- Static frontend served via Nginx (Dockerized)
- 
**HOW TO RUN**
**#Environment Variables**
**Create a .env file in DME_API/:

MONGODB_URI=mongodb://root:example@mongo:27017/dme_orders?authSource=admin
PORT=4000
JWT_SECRET=supersecretkey

**Run with Docker Compose**
docker-compose up --build (use this command)
This will start:
  MongoDB at localhost:27017
  Backend API at http://localhost:4000
  Frontend (Nginx) at http://localhost:3000

🔑 **API Endpoints**
**Auth**
POST /api/auth/register → Register new user
POST /api/auth/login → Login (returns JWT)

**DME**
POST /api/dmes → Create new DME
GET /api/dmes → List all DMEs
GET /api/dmes/:id → Get DME by ID

**Orders**
POST /api/orders → Create new order
GET /api/orders/:id → Get order by ID
GET /api/orders/dme/:dmeId → List orders by DME
GET /api/orders/:id → Get order status
PATCH /api/orders/:id → Update order status
