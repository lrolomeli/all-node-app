const db = require('./init');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('expense', 'deposit')),
    amount REAL NOT NULL,
    description TEXT DEFAULT '',
    date DATETIME NOT NULL
  );
  CREATE TABLE IF NOT EXISTS paid_mondays (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    amount REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`;

function init() {
  return db.init('gastos').then(() => {
    db.exec('gastos', SCHEMA);
  });
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getBalance() {
  const deposits = db.queryOne('gastos', "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'deposit'");
  const expenses = db.queryOne('gastos', "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'");
  return (deposits?.total || 0) - (expenses?.total || 0);
}

function getStartDate() {
  const row = db.queryOne('gastos', "SELECT value FROM settings WHERE key = 'startDate'");
  return row ? row.value : null;
}

function getAllTransactions() {
  return db.queryAll('gastos', 'SELECT * FROM transactions ORDER BY date ASC');
}

function getAllPaidMondays() {
  return db.queryAll('gastos', 'SELECT * FROM paid_mondays ORDER BY date ASC');
}

module.exports = {
  init,

  getSummary() {
    return {
      balance: getBalance(),
      startDate: getStartDate(),
      transactions: getAllTransactions(),
      paidMondays: getAllPaidMondays(),
    };
  },

  spend(amount, description) {
    const id = nextId();
    db.run('gastos', 'INSERT INTO transactions (id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)', [id, 'expense', amount, description, new Date().toISOString()]);
    return this.getSummary();
  },

  deposit(amount, description) {
    const id = nextId();
    db.run('gastos', 'INSERT INTO transactions (id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)', [id, 'deposit', amount, description, new Date().toISOString()]);
    return this.getSummary();
  },

  refund(transactionId) {
    const tx = db.queryOne('gastos', 'SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!tx) return null;
    db.run('gastos', 'DELETE FROM transactions WHERE id = ?', [transactionId]);
    return this.getSummary();
  },

  reset() {
    db.run('gastos', 'DELETE FROM transactions');
    db.run('gastos', 'DELETE FROM paid_mondays');
    return this.getSummary();
  },

  setStartDate(dateStr) {
    db.run('gastos', "INSERT OR REPLACE INTO settings (key, value) VALUES ('startDate', ?)", [dateStr]);
    return this.getSummary();
  },

  addPaidMonday(dateStr, amount) {
    const id = nextId();
    db.run('gastos', 'INSERT OR REPLACE INTO paid_mondays (id, date, amount) VALUES (?, ?, ?)', [id, dateStr, amount]);
    return this.getSummary();
  },

  getMonthlySpending(yearMonth) {
    return db.queryAll('gastos', `
      SELECT date(date) as day, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE type = 'expense' AND strftime('%Y-%m', date) = ?
      GROUP BY date(date)
      ORDER BY day ASC
    `, [yearMonth]);
  },

  getSpendingByDateRange(startDate, endDate) {
    return db.queryAll('gastos', `
      SELECT date(date) as day, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE type = 'expense' AND date(date) BETWEEN ? AND ?
      GROUP BY date(date)
      ORDER BY day ASC
    `, [startDate, endDate]);
  },

  getCategoryBreakdown(yearMonth) {
    return db.queryAll('gastos', `
      SELECT description, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE type = 'expense' AND strftime('%Y-%m', date) = ?
      GROUP BY description
      ORDER BY total DESC
    `, [yearMonth]);
  },
};
