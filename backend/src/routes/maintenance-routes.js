const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

router.get('/', (req, res) => {
  res.json(persistence.loadMaintenanceData());
});

router.post('/', (req, res) => {
  const record = req.body;
  if (!record || !record.itemType || !record.itemName || !record.date || !record.time || !record.description) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const records = persistence.loadMaintenanceData();
  records.push(record);
  persistence.saveMaintenanceData(records);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let records = persistence.loadMaintenanceData();
  records = records.filter((r) => r.id !== id);
  persistence.saveMaintenanceData(records);
  res.json({ success: true });
});

module.exports = router;
