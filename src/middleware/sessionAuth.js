const crypto = require('crypto');

const sessions = new Map();

function sessionTtlMs() {
  const n = Number(process.env.SESSION_TTL_MS);
  return Number.isFinite(n) && n > 0 ? n : 24 * 60 * 60 * 1000;
}

function createSession() {
  const token = crypto.randomBytes(32).toString('base64url');
  const ttl = sessionTtlMs();
  const expiresAt = Date.now() + ttl;
  sessions.set(token, expiresAt);
  setTimeout(() => sessions.delete(token), ttl);
  return token;
}

function isSessionValid(token) {
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp || Date.now() > exp) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function sessionMiddleware(req, res, next) {
  const sessionToken = req.headers['x-session-token'] || req.query.session;
  if (!isSessionValid(sessionToken)) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Use a valid session; obtain one with POST /api/auth/exchange and an invite token',
    });
  }
  next();
}

module.exports = {
  createSession,
  sessionMiddleware,
  isSessionValid,
};
