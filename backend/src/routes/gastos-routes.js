const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

router.get('/', (req, res) => {
  res.json(persistence.loadGastosData());
});

router.post('/', (req, res) => {
  const { action, amount, description, transactionId } = req.body || {};
  const data = persistence.loadGastosData();

  switch (action) {
    case 'spend': {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      if (amt > data.balance) return res.status(400).json({ error: 'Insufficient balance' });
      data.balance -= amt;
      data.transactions.push({
        id: nextId(),
        type: 'expense',
        amount: amt,
        description: (description || '').trim() || 'Gasto',
        date: new Date().toISOString(),
      });
      break;
    }
    case 'deposit': {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      data.balance += amt;
      data.transactions.push({
        id: nextId(),
        type: 'deposit',
        amount: amt,
        description: (description || '').trim() || 'Depósito',
        date: new Date().toISOString(),
      });
      break;
    }
    case 'refund': {
      const tx = data.transactions.find(t => t.id === transactionId);
      if (!tx) return res.status(400).json({ error: 'Invalid transaction' });
      if (tx.type === 'expense') data.balance += tx.amount;
      else if (tx.type === 'deposit') data.balance -= tx.amount;
      else return res.status(400).json({ error: 'Invalid transaction type' });
      data.transactions = data.transactions.filter(t => t.id !== transactionId);
      break;
    }
    case 'reset':
      data.balance = 0;
      data.transactions = [];
      data.paidMondays = [];
      break;
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }

  persistence.saveGastosData(data);
  res.json(data);
});

module.exports = router;
