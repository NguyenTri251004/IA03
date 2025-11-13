# IA03 — User Registration Demo

This repository contains a simple user registration demo: a Node/Express backend with MongoDB and a React frontend (Vite + Tailwind/UI primitives).

Quick setup (Windows / PowerShell)

1) Prerequisites
- Node.js (16+)
- npm
- Docker (optional, recommended for a local MongoDB)

2) Backend setup

- Copy environment example and edit values:
```powershell
cd d:\WebNangCao\IA03\backend
copy .env.example .env
# Edit .env and set MONGO_URI and FRONTEND_URL (or use the defaults)
```

- Run a local MongoDB with Docker (recommended for development):
```powershell
docker run -d --name ia03-mongo -p 27017:27017 mongo:6.0
```
(If you prefer MongoDB Atlas, set `MONGO_URI` to your Atlas connection string in `backend/.env`.)

- Install and start backend:
```powershell
cd d:\WebNangCao\IA03\backend
npm install
npm run dev    # starts nodemon server (reads .env)
```
Default backend port: 4000 (set in `backend/.env`). Backend will log a warning and fall back to `mongodb://127.0.0.1:27017/ia03` if `MONGO_URI` is not set.

3) Frontend setup

- Configure frontend environment (Vite):
```powershell
cd d:\WebNangCao\IA03\frontend
# If .env doesn't exist, create it and set the API URL:
# VITE_API_URL=http://localhost:4000
```
- Install and run frontend:
```powershell
npm install
npm run dev
```
Open the app at the Vite URL (typically http://localhost:5173).

4) How to test
- Register: Visit `http://localhost:5173/register` and submit an email/password. The backend endpoint is `POST /user/register`.
- Login: Visit `http://localhost:5173/login` (UI only). The login form currently submits to `/user/login` and shows success/failure alerts if backend is running.

5) Troubleshooting
- DB connection errors:
  - If you see `ECONNREFUSED 127.0.0.1:27017`, start a local MongoDB (Docker or service) or set `MONGO_URI` to a working Atlas URI.
  - Make sure the backend `FRONTEND_URL` matches your frontend origin (usually `http://localhost:5173`) to avoid CORS blocks.
- Wrong API port:
  - Ensure `VITE_API_URL` in `frontend/.env` points to the backend (default `http://localhost:4000`).
- Vite dependency pre-bundle errors:
  - Run `npm install` in `frontend` to ensure dependencies like `axios` and `react-router-dom` are installed.

6) Notes and next steps
- Passwords are hashed with `bcryptjs` on registration.
- No persistent login (JWT/session) is implemented — login currently returns a success message and user info.
- To improve UX: replace `alert()` with a toast library (e.g., `sonner`) and add JWT-based authentication.

If you want, I can:
- Start the backend and run a live registration test from this environment.
- Add a short script to create a test user.

Enjoy — tell me if you'd like me to run the dev servers and validate the registration flow end-to-end.
