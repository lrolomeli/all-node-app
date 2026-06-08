const express = require('express');
const session = require("express-session");

const limiter = require('./middleware/rateLimiter');
const { sessionMiddleware } = require("./middleware/auth");

const authRoutes = require("./routes/auth-routes");
const sensorRoutes = require('./routes/sensor-routes');

const calis_r = require('./routes/calis-routes');
const chkl_r = require('./routes/checklist-routes');
const mntc_r = require('./routes/maintenance-routes');
const sch_r = require('./routes/schedule-routes');
const gastos_r = require('./routes/gastos-routes');
const shopping_r = require('./routes/shopping-list-routes');

const app = express();

app.use(limiter);
app.use(express.json());

// 🔐 session setup
app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// =========================
// ✅ PUBLIC ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/shopping-list', shopping_r);

// =========================
// 🔒 DEFAULT DENY
// =========================
app.use('/api', sessionMiddleware);

// =========================
// 🔒 PROTECTED ROUTES
// =========================
app.use('/api/calisthenics', calis_r);
app.use('/api/checklist', chkl_r);
app.use('/api/maintenance', mntc_r);
app.use('/api/schedule', sch_r);
app.use('/api/gastos', gastos_r);

module.exports = app;