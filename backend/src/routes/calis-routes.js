const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

router.get('/rutina', (req, res) => {
  const csv = persistence.loadCalisthenicsRutina();
  res.type('text/csv; charset=utf-8').send(csv);
});

router.get('/progress', (req, res) => {
  res.json(persistence.loadCalisthenicsProgress());
});

router.post('/progress', (req, res) => {
  const { level, currentSession } = req.body;
  if (typeof level !== 'number' || typeof currentSession !== 'number') {
    return res.status(400).json({ error: 'level and currentSession must be numbers' });
  }
  persistence.saveCalisthenicsProgress({ level, currentSession });
  res.json({ success: true });
});

module.exports = router;
