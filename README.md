# IA04 — JWT Authentication System

A complete React + Node.js authentication system with JWT access tokens, refresh tokens, protected routes, and form validation.

## Features

✅ JWT-based authentication (access + refresh tokens)
✅ Secure token storage (memory + localStorage)
✅ Automatic token refresh on expiry
✅ Protected routes with authentication checks
✅ React Hook Form with Zod validation
✅ React Query for API state management
✅ Axios interceptors for token management
✅ MongoDB user persistence
✅ Password encryption with bcryptjs

## Quick Setup (Windows / PowerShell)

### 1) Prerequisites
- Node.js (16+)
- npm
- MongoDB Atlas account or local MongoDB

### 2) Backend Setup

```powershell
cd src\backend
npm install
npm install jsonwebtoken  # If not already installed
```

Configure `.env`:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ia04
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
```

Start backend:
```powershell
npm run dev
```

Backend runs on `http://localhost:4000`

### 3) Frontend Setup

```powershell
cd src\frontend
npm install
```

Configure `.env`:
```env
VITE_API_URL=http://localhost:4000
```

Start frontend:
```powershell
npm run dev
```

Frontend runs on `http://localhost:5173`

## Testing the Authentication Flow

### Register
1. Visit `http://localhost:5173/register`
2. Enter name, email, password
3. Click "Đăng ký"
4. Redirect to login

### Login
1. Enter registered email/password
2. Click "Đăng nhập"
3. Receive accessToken + refreshToken
4. Redirect to dashboard

### Protected Route
1. Dashboard shows user info (name, email, account creation date)
2. If token expires, automatic refresh occurs
3. User stays logged in

### Logout
1. Click "Đăng xuất" on dashboard
2. Tokens cleared
3. Redirect to login

## API Endpoints

### Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/register` | `{name, email, password}` | User object |
| POST | `/auth/login` | `{email, password}` | `{accessToken, refreshToken, user}` |
| POST | `/auth/refresh-token` | `{refreshToken}` | `{accessToken, refreshToken}` |
| POST | `/auth/logout` | `{refreshToken}` | Success message |
| GET | `/auth/user` | Authorization header | User object |

## Token Flow

```
1. User registers/logs in
   ↓
2. Backend generates accessToken (15m) + refreshToken (7d)
   ↓
3. Frontend stores: accessToken in memory, refreshToken in localStorage
   ↓
4. Axios interceptor attaches accessToken to every request
   ↓
5. If accessToken expires, interceptor:
   - Sends refreshToken to backend
   - Gets new accessToken
   - Retries original request
   ↓
6. If refreshToken invalid/expired:
   - User logged out
   - Redirect to login
```

## Tech Stack

### Backend
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS + Helmet

### Frontend
- React 19
- React Router 7
- React Query 5
- React Hook Form 7
- Axios
- Tailwind CSS
- Sonner (notifications)
- Zod (validation)

## Project Structure

```
src/
├── backend/
│   ├── src/
│   │   ├── controllers/userController.js
│   │   ├── middleware/auth.js
│   │   ├── models/User.js
│   │   ├── routes/user.js
│   │   └── utils/db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/axiosClient.js
    │   ├── components/ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── hooks/useAuth.js
    │   ├── pages/{Login,Register,Home}.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── .env
    └── vite.config.js
```

## Key Files Explained

### Backend

**`middleware/auth.js`**
- `generateAccessToken()` - Create short-lived token
- `generateRefreshToken()` - Create long-lived token
- `verifyToken` - Middleware to verify access tokens

**`controllers/userController.js`**
- `register()` - Create new user
- `login()` - Authenticate user, issue tokens
- `refreshToken()` - Issue new accessToken
- `getUserProfile()` - Get user data (protected)
- `logout()` - Invalidate refresh token

### Frontend

**`context/AuthContext.jsx`**
- Manages token state
- Provides auth functions to app
- Registers auth state with Axios

**`hooks/useAuth.js`**
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useUser()` - Fetch user profile
- `useRegister()` - Registration mutation
- `useAuth()` - Access auth context

**`api/axiosClient.js`**
- Request interceptor: Attach access token
- Response interceptor: Handle 401 + refresh token

**`components/ProtectedRoute.jsx`**
- Redirect to login if not authenticated
- Show loading state

## Security Features

1. ✅ Passwords hashed with bcryptjs (10 salt rounds)
2. ✅ Access tokens short-lived (15 minutes)
3. ✅ Refresh tokens long-lived (7 days)
4. ✅ Refresh token rotation (new token each refresh)
5. ✅ CORS restricted to frontend origin
6. ✅ Helmet security headers
7. ✅ JWT secrets in environment variables

## Deployment

### Frontend (Netlify / Vercel)

1. Build:
```bash
npm run build
```

2. Deploy & set environment:
   - `VITE_API_URL=<backend-url>`

### Backend (Render / Railway / Heroku)

1. Push to GitHub
2. Connect to deployment platform
3. Set environment variables:
   - `MONGO_URI=<production-db>`
   - `JWT_SECRET=<strong-random-key>`
   - `FRONTEND_URL=<frontend-domain>`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Check `FRONTEND_URL` in backend `.env` |
| 401 Unauthorized | Token expired, check refresh token in localStorage |
| Can't login | Verify email/password in database |
| User not found | Register first, then login |
| Token not refreshing | Ensure refresh token exists in localStorage |

## Production Checklist

- [ ] Generate strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for all connections
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Implement rate limiting on login
- [ ] Monitor failed login attempts
- [ ] Use httpOnly cookies for refresh tokens (optional)
- [ ] Enable CORS only for trusted domains
- [ ] Set up database backups

## Next Steps

- Add email verification on registration
- Implement "Remember Me" functionality
- Add social login (Google, GitHub)
- Implement password reset
- Add 2FA (Two-Factor Authentication)
- Rate limiting on auth endpoints
- Account lockout after failed attempts

---

**Happy coding!** 🚀
