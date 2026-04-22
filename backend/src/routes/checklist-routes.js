const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

let checklistState = persistence.loadChecklistState();

router.get('/', (req, res) => {
  res.json(checklistState);
});

router.post('/', (req, res) => {
  const { id, checked } = req.body;
  if (!id || typeof checked !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  checklistState[id] = checked;
  persistence.saveChecklistState(checklistState);
  res.json({ success: true });
});


module.exports = router;
