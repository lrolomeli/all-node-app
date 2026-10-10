const { Router } = require('express');
const gastos = require('../db/gastos');

const router = Router();

router.get('/', (req, res) => {
  res.json(gastos.getSummary());
});

router.get('/monthly', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const spending = gastos.getMonthlySpending(month);
  const categories = gastos.getCategoryBreakdown(month);
  res.json({ month, spending, categories });
});

router.get('/range', (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end required' });
  const data = gastos.getSpendingByDateRange(start, end);
  res.json(data);
});

router.post('/', (req, res) => {
  const { action, amount, description, transactionId, startDate, date: paidDate, amount: paidAmount } = req.body || {};

  switch (action) {
    case 'spend': {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      return res.json(gastos.spend(amt, (description || '').trim() || 'Gasto'));
    }
    case 'deposit': {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      return res.json(gastos.deposit(amt, (description || '').trim() || 'Depósito'));
    }
    case 'refund': {
      if (!transactionId) return res.status(400).json({ error: 'transactionId required' });
      const result = gastos.refund(transactionId);
      if (!result) return res.status(400).json({ error: 'Invalid transaction' });
      return res.json(result);
    }
    case 'reset':
      return res.json(gastos.reset());
    case 'setStartDate':
      return res.json(gastos.setStartDate(startDate));
    case 'addPaidMonday':
      return res.json(gastos.addPaidMonday(paidDate, paidAmount || 0));
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }
});

module.exports = router;
