Dummy DME-API 
- **Backend** (Node.js + Express + MongoDB)
- **Frontend** (HTML + Vanilla JS + CSS)
- **MongoDB** database (Dockerized)
  
## Features
- User authentication (Register / Login with JWT + Refresh Tokens)
- Token refresh mechanism for secure session management
- Manage DMEs (create, view, list)
- Manage Orders (create, update status, list by DME)
- Order status mapped to standardized codes/messages
- Dockerized backend + MongoDB
- Static frontend served via Nginx (Dockerized)
  
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
POST /api/auth/register → Register new user (returns JWT + refresh token)

POST /api/auth/login → Login (returns JWT + refresh token)

POST /api/auth/refresh → Refresh access token using refresh token

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

## Token Refresh Mechanism

The API now supports JWT token refresh for enhanced security:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens
- **Refresh Endpoint**: `POST /api/auth/refresh`

### Usage Example:
```bash
# Login to get both tokens
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'

# Response includes both tokens:
{
  "message": "Logged in",
  "token": "eyJ...", // Access token (15 min)
  "refreshToken": "eyJ...", // Refresh token (7 days)
  "user": {...}
}

# When access token expires, use refresh token:
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJ..."}'

# Response includes new tokens:
{
  "message": "Token refreshed successfully",
  "token": "eyJ...", // New access token
  "refreshToken": "eyJ...", // New refresh token
  "user": {...}
}
```
