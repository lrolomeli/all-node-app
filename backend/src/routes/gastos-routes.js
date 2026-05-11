const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

router.get('/', (req, res) => {
  res.json(persistence.loadGastosData());
});

router.post('/', (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  persistence.saveGastosData(data);
  res.json({ success: true });
});

module.exports = router;
