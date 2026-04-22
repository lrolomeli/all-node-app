const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

router.get('/', (req, res) => {
  res.json(persistence.loadScheduleData());
});

router.post('/', (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  persistence.saveScheduleData(req.body);
  res.json({ success: true });
});

module.exports = router;
