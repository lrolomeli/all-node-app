const db = require('./init');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS maintenance_records (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_maintenance_date ON maintenance_records(date);
  CREATE INDEX IF NOT EXISTS idx_maintenance_type ON maintenance_records(item_type);
`;

function init() {
  return db.init('maintenance').then(() => {
    db.exec('maintenance', SCHEMA);
  });
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

module.exports = {
  init,

  getAll() {
    return db.queryAll('maintenance', 'SELECT * FROM maintenance_records ORDER BY date DESC').map(r => ({
      id: r.id,
      itemType: r.item_type,
      itemName: r.item_name,
      date: r.date,
      time: r.time,
      description: r.description,
      createdAt: r.created_at,
    }));
  },

  add(record) {
    const id = nextId();
    db.run('maintenance', 'INSERT INTO maintenance_records (id, item_type, item_name, date, time, description) VALUES (?, ?, ?, ?, ?, ?)', [
      id, record.itemType, record.itemName, record.date, record.time, record.description,
    ]);
    return this.getAll();
  },

  remove(id) {
    db.run('maintenance', 'DELETE FROM maintenance_records WHERE id = ?', [id]);
    return this.getAll();
  },

  getByType(itemType) {
    return db.queryAll('maintenance', 'SELECT * FROM maintenance_records WHERE item_type = ? ORDER BY date DESC', [itemType]).map(r => ({
      id: r.id,
      itemType: r.item_type,
      itemName: r.item_name,
      date: r.date,
      time: r.time,
      description: r.description,
      createdAt: r.created_at,
    }));
  },

  getByDateRange(startDate, endDate) {
    return db.queryAll('maintenance', 'SELECT * FROM maintenance_records WHERE date BETWEEN ? AND ? ORDER BY date DESC', [startDate, endDate]).map(r => ({
      id: r.id,
      itemType: r.item_type,
      itemName: r.item_name,
      date: r.date,
      time: r.time,
      description: r.description,
      createdAt: r.created_at,
    }));
  },

  getCountByType() {
    return db.queryAll('maintenance', 'SELECT item_type as type, COUNT(*) as count FROM maintenance_records GROUP BY item_type ORDER BY count DESC');
  },

  getMonthlyCount(yearMonth) {
    return db.queryAll('maintenance', `
      SELECT item_type as type, COUNT(*) as count
      FROM maintenance_records
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY item_type
      ORDER BY count DESC
    `, [yearMonth]);
  },
};
