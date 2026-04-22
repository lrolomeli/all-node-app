require('dotenv').config();
const express = require('express');
const limiter = require('./middleware/rateLimiter');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();

app.use(limiter);
app.use(express.json());
app.use(authRouter);
app.use(apiRouter);

module.exports = app;
