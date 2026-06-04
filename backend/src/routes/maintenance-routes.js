const { Router } = require('express');
const maintenance = require('../db/maintenance');

const router = Router();

router.get('/', (req, res) => {
  res.json(maintenance.getAll());
});

router.get('/stats', (req, res) => {
  const { type, start, end, month } = req.query;
  if (type) return res.json(maintenance.getByType(type));
  if (start && end) return res.json(maintenance.getByDateRange(start, end));
  if (month) return res.json(maintenance.getMonthlyCount(month));
  res.json(maintenance.getCountByType());
});

router.post('/', (req, res) => {
  const record = req.body;
  if (!record || !record.itemType || !record.itemName || !record.date || !record.time || !record.description) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  res.json(maintenance.add(record));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json(maintenance.remove(id));
});

module.exports = router;
