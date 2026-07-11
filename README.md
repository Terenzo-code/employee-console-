# Employee Console

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

## Why the API wasn't working (the database problem)

The `.env` file was empty, so `mongoose.connect(process.env.DATABASE_URI)`
in `config/dbConn.js` had nothing to connect to and it hung/failed
silently. That's the "database problem" mentioned in the old notes — there
was nothing wrong with the connection code itself, it just had no
credentials to use. See **Setup → Backend** below for what to put there.

## Other bugs fixed in the backend

- **`middleware/errorHandler.js`** required `./LogEvents` but the file is
  `logEvents.js`. Windows' filesystem is case-insensitive so this hid the
  bug locally; on Linux/Mac (and most hosting) it throws `MODULE_NOT_FOUND`
  and crashes any request that errors.
- **`middleware/logEvents.js`** created a `Logs` folder but appended log
  lines to a `logs` folder — two different directories. Every log write
  failed with `ENOENT`. Now both use `logs`.
- **`model/Employee.js`** had a typo'd field, `lastnamename`, instead of
  `lastname`. Combined with the bugs below, employee records never saved
  correctly.
- **`controllers/employeesControl.js`**:
  - `getAllEmployees` never actually sent the employee list back — it only
    handled the empty case and otherwise returned nothing, so every
    request hung until it timed out.
  - `createNewEmployee` had two typos (`fistname`, `req.bod.lastname`)
    that made every new employee fail validation or crash.
  - `getEmployee` read the id from `req.body` on a route that only ever
    supplies `req.params.id`, so single-employee lookups always failed.
- **Cookie settings** (`authController.js`, `logoutController.js`) set
  `secure: true` (commented out) with `sameSite: 'None'`. Browsers drop
  such cookies unless the page is served over https, which broke login on
  `http://localhost`. It's now `secure: process.env.NODE_ENV === 'production'`.
- **Access token lifetime** was 30 seconds, which made the app look broken
  within a few seconds of logging in even when everything else worked.
  Bumped to 15 minutes (refresh token stays at a longer-lived 7 days).
- **`config/allowedOrigins.js`** didn't include the React dev server's
  origin, so CORS blocked every request from the frontend. Added
  `http://localhost:5173` (Vite) and `http://localhost:3000`.
- Removed an unused, non-existent `date-fns/locale` import in `server.js`
  and a stray Windows crash-dump file.

`backend/users.json`, `backend/model/users.json`, and
`backend/model/employees.json` are leftovers from an earlier, pre-MongoDB
version of this project. Nothing reads them anymore — MongoDB is the only
datastore now — they're left in place only for reference.

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
