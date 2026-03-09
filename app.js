require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me-123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Make session user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// Home redirect
app.get('/', (req, res) => {
  res.redirect(req.session.user ? '/dashboard' : '/login');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
