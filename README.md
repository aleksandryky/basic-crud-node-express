# Sign Up & Login with Node.js and Express

A simple signup and login flow using Express, sessions, and a JSON file for user storage. No database required—great for learning.

## What’s included

- **Sign up form**: name, email, password, phone, details
- **Login form**: email and password
- **Dashboard**: shown only when logged in
- **Logout**: clears session and redirects to login
- Passwords are hashed with **bcrypt**
- Users are stored in `data/users.json`

## Step-by-step setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

Or with auto-restart on file changes:

```bash
npm run dev
```

### 3. Use the app in the browser

- Open **http://localhost:3000**
- You’ll be redirected to the **login** page (no account yet).
- Click **“Sign up”** and fill in:
  - **Name** (required)
  - **Email** (required)
  - **Password** (required)
  - **Phone** (optional)
  - **Details** (optional)
- Submit the form → you’re signed up and logged in, and redirected to the **dashboard**.
- Click **“Log out”** → you’re redirected to the login page.
- Use the same **email** and **password** on the **login** form to log in again.

## Project structure

```
├── app.js              # Express app, session, routes
├── middleware/
│   └── auth.js         # requireAuth – protect dashboard
├── routes/
│   └── auth.js         # GET/POST /signup, /login
├── data/
│   ├── userStore.js    # Read/write users (findByEmail, createUser)
│   └── users.json      # Stored users (created on first signup)
└── views/
    ├── partials/
    │   └── header.ejs  # Shared HTML head and styles
    ├── signup.ejs      # Sign up form
    ├── login.ejs       # Login form
    └── dashboard.ejs   # Welcome page (after login)
```

## Flow summary

1. **Sign up** (`GET /signup` → form, `POST /signup` → validate, hash password, save user, set session, redirect to `/dashboard`).
2. **Login** (`GET /login` → form, `POST /login` → find user, compare password, set session, redirect to `/dashboard`).
3. **Dashboard** (`GET /dashboard` → only if `req.session.user` exists; otherwise redirect to `/login`).
4. **Logout** (`GET /logout` → destroy session, redirect to `/login`).

## Next steps (optional)

- Add a real database (e.g. SQLite or MongoDB) instead of `users.json`.
- Use environment variables for `session.secret` and port (e.g. in a `.env` file).
- Add validation (e.g. email format, password strength) and flash messages.
