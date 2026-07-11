# Collaborative Travel Planner

By Noah Hemon, Antoine Iglesias-Tallon, Nassim Ainine

## Setup

Each service needs its own `.env` file (never committed):

| Service | Example file | Required variables |
|---|---|---|
| `frontend/` | `.env.example` | `VITE_GOOGLE_CLIENT_ID`, `VITE_API_BASE_URL` |
| `backend/` | `.env.example` | `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `PORT`, `FRONTEND_URL` |
| `service-a/` | `.env.exemple` | `MONGO_URI` |
| `service-b/` | `.env.exemple` | `WEATHER_API_KEY`, `DATABASE_URL` |

`GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend) must be the same value.

Install dependencies:
```
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd service-a && npm install && cd ..
cd service-b && npm install && cd ..
npm install
```

## Run

```
npm run dev
```
Starts `service-a`, `service-b`, the backend gateway, and the frontend together in one terminal.
