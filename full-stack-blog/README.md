# Page One — Full-Stack Blog with Authentication

A responsive blog application with a React/Vite client and an Express, MongoDB, and Mongoose API. Readers can browse public stories; registered authors can publish, edit, and delete their own posts.

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer) and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Install

From PowerShell, open the project folder and install all workspace dependencies:

```powershell
cd .\full-stack-blog
npm install
```

## Configure MongoDB and the session secret

The starter `server/.env` uses the local MongoDB URI. If MongoDB is installed as a Windows service, start it from an elevated PowerShell window if needed:

```powershell
Start-Service MongoDB
```

If you use MongoDB Atlas, replace `MONGODB_URI` in `server/.env` with your Atlas connection string (including the database name). Do not commit this file.

Create a random 96-character JWT signing secret and write the local development settings to `server/.env`:

```powershell
$secret = node -e "process.stdout.write(require('crypto').randomBytes(48).toString('hex'))"
@(
  "MONGODB_URI=mongodb://127.0.0.1:27017/full-stack-blog"
  "JWT_SECRET=$secret"
  "PORT=5000"
  "CLIENT_URL=http://localhost:5173"
  "NODE_ENV=development"
) | Set-Content .\server\.env
```

For Atlas, change the `MONGODB_URI` line in `server/.env` after running the command. Keep the JWT secret private and use a distinct secret in production.

## Run both apps

```powershell
npm run dev
```

- Frontend: <http://localhost:5173>
- API health check: <http://localhost:5000/api/health>

To run either app separately:

```powershell
npm run dev:client
npm run dev:server
```

Run only one API server per port. If the configured port already serves this app's health endpoint, another server start reports that the API is already running and does not start a second instance.

Create an account in the browser to publish a story. In development, the API accepts either `localhost` or `127.0.0.1` for the configured frontend origin. The frontend session uses an HTTP-only JWT cookie; in production, configure HTTPS and set `CLIENT_URL` to the exact frontend origin. For a cross-site frontend/API deployment, set `COOKIE_SAME_SITE=none` on the API (requires HTTPS).

## Production client build

```powershell
npm run build
```

## API overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account and start a session |
| `POST` | `/api/auth/login` | Public | Start a session |
| `POST` | `/api/auth/logout` | Public | Clear the session cookie |
| `GET` | `/api/auth/me` | Authenticated | Get the current user |
| `GET` | `/api/blogs` | Public | List recent stories |
| `GET` | `/api/blogs/:id` | Public | Get one story |
| `GET` | `/api/blogs/mine` | Authenticated | List the current user's stories |
| `POST` | `/api/blogs` | Authenticated | Publish a story |
| `PATCH` | `/api/blogs/:id` | Owner only | Edit a story |
| `DELETE` | `/api/blogs/:id` | Owner only | Delete a story |

Passwords are hashed with bcrypt. The JWT is held in an HTTP-only cookie; protected writes also check the request origin. Blog update/delete queries include both the post ID and authenticated author ID, so client-side controls are not the authorization boundary. Authentication endpoints are rate limited, API inputs are validated, and security headers are enabled.