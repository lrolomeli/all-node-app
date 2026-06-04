const gastos = require('../db/gastos');

const WEEKLY_AMOUNT = 1750;

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
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

function backfill() {
  const summary = gastos.getSummary();

  if (!summary.startDate) {
    gastos.setStartDate(todayStr());
    console.log('[gastos-cron] startDate set to ' + todayStr());
    return;
  }

  const start = new Date(summary.startDate);
  const today = new Date();
  const mondays = getMondaysBetween(start, today);
  const paidSet = new Set(summary.paidMondays.map(p => p.date));
  let count = 0;

  for (const m of mondays) {
    const dateStr = dateToStr(m);
    if (!paidSet.has(dateStr)) {
      gastos.addPaidMonday(dateStr, WEEKLY_AMOUNT);
      count++;
    }
  }

  if (count > 0) {
    console.log('[gastos-cron] Backfilled ' + count + ' missing Monday(s)');
  }
}

function run() {
  const now = new Date();
  if (now.getDay() !== 1) return;

  const summary = gastos.getSummary();
  const today = todayStr();
  const paidSet = new Set(summary.paidMondays.map(p => p.date));

  if (paidSet.has(today)) return;

  gastos.addPaidMonday(today, WEEKLY_AMOUNT);
  console.log('[gastos-cron] Added $' + WEEKLY_AMOUNT + ' for ' + today);
}

module.exports = { run, backfill, WEEKLY_AMOUNT };
