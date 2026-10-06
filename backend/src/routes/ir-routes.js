const { Router } = require('express');
const { espRequest } = require('../esp');

const router = Router();

function buildQuery(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function espError(res, err) {
  res.status(503).json({ error: 'ESP unreachable', detail: err.message });
}

router.get('/status', async (req, res) => {
  try {
    res.json(await espRequest('/api/ac/status'));
  } catch (err) {
    espError(res, err);
  }
});

router.get('/list', async (req, res) => {
  try {
    res.json(await espRequest('/api/ir/list'));
  } catch (err) {
    espError(res, err);
  }
});

router.post('/send', async (req, res) => {
  const name = req.body?.name || req.query.name;
  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }
  try {
    const data = await espRequest(`/api/ac/send?${buildQuery({ name })}`);
    res.status(data.ok ? 200 : 404).json(data);
  } catch (err) {
    espError(res, err);
  }
});

router.post('/ac/on', async (req, res) => {
  try {
    res.json(await espRequest('/api/ac/on'));
  } catch (err) {
    espError(res, err);
  }
});

router.post('/ac/off', async (req, res) => {
  try {
    res.json(await espRequest('/api/ac/off'));
  } catch (err) {
    espError(res, err);
  }
});

router.all('/ac/set', async (req, res) => {
  const params = { ...req.query, ...(req.body || {}) };
  const query = buildQuery(params);
  try {
    res.json(await espRequest(`/api/ac/set${query ? `?${query}` : ''}`));
  } catch (err) {
    espError(res, err);
  }
});

router.all('/nec', async (req, res) => {
  const params = { ...req.query, ...(req.body || {}) };
  if (params.addr === undefined || params.cmd === undefined) {
    return res.status(400).json({ error: 'addr and cmd required' });
  }
  try {
    res.json(await espRequest(`/api/ir/nec?${buildQuery({ addr: params.addr, cmd: params.cmd })}`));
  } catch (err) {
    espError(res, err);
  }
});

module.exports = router;
