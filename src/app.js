require('dotenv').config();
const express = require('express');
const { PUBLIC_DIR, EXPEDIENTE_DIR } = require('./paths');
const limiter = require('./middleware/rateLimiter');
const authRouter = require('./routes/auth');
const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');

const app = express();

app.use(limiter);
app.use(express.static(PUBLIC_DIR));
app.use('/expediente', express.static(EXPEDIENTE_DIR));
app.use(express.json());
app.use(authRouter);
app.use(pagesRouter);
app.use(apiRouter);

module.exports = app;
