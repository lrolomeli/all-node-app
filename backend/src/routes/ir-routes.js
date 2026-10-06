const { Router } = require('express');
const { espRequest } = require('../esp');
const acState = require('../data/ac-state');

const router = Router();

function buildQuery(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

router.get('/status', (req, res) => {
  res.json(acState.serialize());
});

router.all('/ac/set', async (req, res) => {
  const partial = { ...(req.query || {}), ...(req.body || {}) };
  const candidate = acState.preview(partial);

  try {
    const query = buildQuery(acState.toEspParams(candidate));
    await espRequest(`/api/ac/set?${query}`);
  } catch (err) {
    return res.status(503).json({
      ok: false,
      error: 'ESP unreachable',
      detail: err.message,
      state: acState.serialize(),
    });
  }

  acState.commit(candidate);
  res.json({ ok: true, state: acState.serialize() });
});

module.exports = router;
