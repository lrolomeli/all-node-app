const { Router } = require('express');
const persistence = require('../data/persistence');

const LIST_PASSWORD = process.env.SHOPPING_LIST_PASSWORD || 'hermosos';

const router = Router();

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

router.get('/', (req, res) => {
  res.json(persistence.loadShoppingListData());
});

router.post('/', (req, res) => {
  const { action, id, text, password } = req.body || {};

  if (password !== LIST_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const data = persistence.loadShoppingListData();

  switch (action) {
    case 'add': {
      const t = (text || '').trim();
      if (!t) return res.status(400).json({ error: 'Text is required' });
      data.items.push({
        id: nextId(),
        text: t,
        checked: false,
        createdAt: new Date().toISOString(),
      });
      break;
    }
    case 'toggle': {
      const item = data.items.find(i => i.id === id);
      if (!item) return res.status(400).json({ error: 'Invalid item' });
      item.checked = !item.checked;
      break;
    }
    case 'edit': {
      const item = data.items.find(i => i.id === id);
      if (!item) return res.status(400).json({ error: 'Invalid item' });
      const t = (text || '').trim();
      if (!t) return res.status(400).json({ error: 'Text is required' });
      item.text = t;
      break;
    }
    case 'remove': {
      const idx = data.items.findIndex(i => i.id === id);
      if (idx === -1) return res.status(400).json({ error: 'Invalid item' });
      data.items.splice(idx, 1);
      break;
    }
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }

  persistence.saveShoppingListData(data);
  res.json(data);
});

module.exports = router;
