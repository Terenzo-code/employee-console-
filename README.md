# Employee Console

🔗 **Live demo:** https://employee-console.vercel.app
> Note: the backend runs on a free Render instance, which sleeps after 15
> minutes of no traffic. The first request after that can take 30–60
> seconds to wake back up — if the roster looks stuck loading on first
> visit, that's why, just give it a moment.

A small internal tool for managing an employee roster, with username/password
accounts, role-based permissions, and JWT auth (short-lived access token +
httpOnly refresh cookie).

```
backend/    Node.js + Express + MongoDB API (existing, now fixed)
frontend/   React (Vite) client (new)
```

## What the app does

- Anyone can **register** an account and **log in**.
- Logged-in users can view the **employee roster**.
- **Editors** and **Admins** can add and edit employees.
- Only **Admins** can delete employees.
- Roles live on the user document in MongoDB (`User`, `Editor`, `Admin`),
  and are baked into the JWT on login so the frontend can show/hide
  controls and the backend can enforce them independently.

Auth flow: login returns a short-lived access token (kept in memory in
React, never localStorage) plus an httpOnly `jwt` refresh cookie. When the
access token expires, or the page is refreshed and memory is empty, the
frontend calls `GET /refresh` to silently mint a new access token from the
cookie. `POST /logout` clears the cookie and invalidates the stored
refresh token server-side.

## Setup

### Backend

```
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URI` — a MongoDB connection string. Easiest option is a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster;
  grab the connection string from "Connect → Drivers".
- `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` — two different random
  strings. Generate each with:
  ```
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

Then run it:
```
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```
It listens on `http://localhost:3500` by default.

There's no self-serve way to make the *first* Admin — every route that
grants roles requires an existing Admin. Register a user normally, then
open it in MongoDB (Atlas's "Browse Collections" works fine) and set
`roles: { User: 2001, Editor: 1984, Admin: 5150 }` on that document by hand.
After that, promoting more users can be done the same way, or you can add
an admin-only endpoint for it later.

### Frontend

```
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:3500, edit if needed
npm run dev
```
Opens on `http://localhost:5173`. Make sure the backend is running first.

## Project structure (frontend)

```
src/
  api/axios.js          two axios instances: public + "private" (auth-aware)
  context/AuthProvider   holds { accessToken, username, roles } in memory
  hooks/
    useAuth              read the auth context
    useRefreshToken       calls GET /refresh
    useAxiosPrivate       attaches Bearer token, retries once on 401/403
    useLogout             calls GET /logout, clears local state
  components/
    Layout, Nav           shell + top nav
    PersistLogin           tries a silent refresh on hard page reloads
    RequireAuth             route guard, optionally role-gated
  pages/
    Home, Login, Register, Employees, Unauthorized, Missing
```

## Roles reference

| Role   | Value | Can view roster | Add / edit | Delete |
|--------|-------|:---:|:---:|:---:|
| User   | 2001  | ✅ | – | – |
| Editor | 1984  | ✅ | ✅ | – |
| Admin  | 5150  | ✅ | ✅ | ✅ |

These match `backend/config/roles_list.js` — if you change one, change both.
