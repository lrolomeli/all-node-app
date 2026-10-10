const fs = require('fs');
const path = require('path');
const gastos = require('../src/db/gastos');
const maintenance = require('../src/db/maintenance');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function migrate() {
  await gastos.init();
  await maintenance.init();

  const gastosJson = path.join(DATA_DIR, 'gastos-data.json');
  if (fs.existsSync(gastosJson)) {
    const data = JSON.parse(fs.readFileSync(gastosJson, 'utf8'));
    const summary = gastos.getSummary();

    if (summary.transactions.length === 0) {
      if (data.startDate) gastos.setStartDate(data.startDate);

      for (const tx of data.transactions) {
        if (tx.type === 'expense') {
          gastos.spend(tx.amount, tx.description);
        } else if (tx.type === 'deposit') {
          gastos.deposit(tx.amount, tx.description);
        }
      }

      for (const dateStr of (data.paidMondays || [])) {
        const monday = new Date(dateStr + 'T00:00:00');
        const alreadyPaid = summary.paidMondays.some(p => p.date === dateStr);
        if (!alreadyPaid) {
          gastos.addPaidMonday(dateStr, 1750);
        }
      }

      console.log(`[migrate] gastos: ${data.transactions.length} transactions, ${data.paidMondays?.length || 0} paid Mondays`);
    } else {
      console.log('[migrate] gastos: already has data, skipping');
    }
  } else {
    console.log('[migrate] gastos: no JSON file found');
  }

  const maintJson = path.join(DATA_DIR, 'maintenance-data.json');
  if (fs.existsSync(maintJson)) {
    const records = JSON.parse(fs.readFileSync(maintJson, 'utf8'));
    const existing = maintenance.getAll();

    if (existing.length === 0) {
      for (const r of records) {
        maintenance.add({
          itemType: r.itemType,
          itemName: r.itemName,
          date: r.date,
          time: r.time,
          description: r.description,
        });
      }
      console.log(`[migrate] maintenance: ${records.length} records`);
    } else {
      console.log('[migrate] maintenance: already has data, skipping');
    }
  } else {
    console.log('[migrate] maintenance: no JSON file found');
  }

  console.log('[migrate] done');
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
