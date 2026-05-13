const persistence = require('../data/persistence');

const WEEKLY_AMOUNT = 1750;

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getMondaysBetween(from, to) {
  const mondays = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    if (cursor.getDay() === 1) {
      mondays.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return mondays;
}

function dateToStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function addWeeklyPayment(data, mondayDate) {
  if (!data.transactions) data.transactions = [];
  if (!data.paidMondays) data.paidMondays = [];

  const dateStr = dateToStr(mondayDate);
  if (data.paidMondays.includes(dateStr)) return false;

  data.balance += WEEKLY_AMOUNT;
  data.transactions.push({
    id: nextId(),
    type: 'deposit',
    amount: WEEKLY_AMOUNT,
    description: 'Depósito semanal',
    date: mondayDate.toISOString(),
  });
  data.paidMondays.push(dateStr);
  return true;
}

function backfill() {
  const data = persistence.loadGastosData();

  if (!data.startDate) {
    data.startDate = todayStr();
    persistence.saveGastosData(data);
    console.log('[gastos-cron] startDate set to ' + data.startDate);
  }

  const start = new Date(data.startDate);
  const today = new Date();
  const mondays = getMondaysBetween(start, today);
  let count = 0;

  for (const m of mondays) {
    if (addWeeklyPayment(data, m)) count++;
  }

  if (count > 0) {
    persistence.saveGastosData(data);
    console.log('[gastos-cron] Backfilled ' + count + ' missing Monday(s)');
  }
}

function run() {
  const now = new Date();
  if (now.getDay() !== 1) return;

  const data = persistence.loadGastosData();
  const today = todayStr();

  if (!data.paidMondays) data.paidMondays = [];
  if (data.paidMondays.includes(today)) return;

  addWeeklyPayment(data, now);
  persistence.saveGastosData(data);
  console.log('[gastos-cron] Added $' + WEEKLY_AMOUNT + ' for ' + today);
}

module.exports = { run, backfill, WEEKLY_AMOUNT };
