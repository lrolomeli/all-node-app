const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

// GET /api/budget
router.get('/', (req, res) => {
  res.json(persistence.loadBudgetData());
});

// POST /api/budget
router.post('/', (req, res) => {
  const budgetData = req.body;

  if (!budgetData || typeof budgetData !== 'object') {
    return res.status(400).json({ error: 'Invalid budget data' });
  }

  persistence.saveBudgetData(budgetData);
  res.json({ success: true });
});

// DELETE /api/budget/:type/:id
router.delete('/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const budgetData = persistence.loadBudgetData();

  if (!budgetData[type]) {
    return res.status(400).json({ error: 'Invalid budget type' });
  }

  budgetData[type] = budgetData[type].filter((item) => item.id !== id);
  persistence.saveBudgetData(budgetData);

  res.json({ success: true });
});

module.exports = router;