const { Router } = require('express');
const climate = require('../automation/climate');

const router = Router();

router.get('/config', (req, res) => {
  res.json(climate.getConfig());
});

router.post('/config', (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid config' });
  }
  const config = climate.saveConfig(req.body);
  res.json({ ok: true, config });
});

router.get('/status', (req, res) => {
  res.json(climate.status());
});

router.get('/log', (req, res) => {
  res.json(climate.getLog());
});

router.post('/run-now', async (req, res) => {
  const result = await climate.tick(new Date(), { force: true });
  res.json({ ok: true, result });
});

module.exports = router;
