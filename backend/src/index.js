const app = require('./app');
const cron = require('node-cron');
const gastosCron = require('./cron/gastos-cron');
const sensors = require('./db/sensors');
const gastos = require('./db/gastos');
const maintenance = require('./db/maintenance');
const http = require('http');

const ESP_HOST = process.env.ESP_HOST || '192.168.100.239';
const ESP_PORT = Number(process.env.ESP_PORT) || 80;

function pollSensor() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('ESP timeout')), 5000);
    http.get(`http://${ESP_HOST}:${ESP_PORT}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const parsed = JSON.parse(data);
          sensors.insertReading(parsed.temperature, parsed.humidity, parsed.unit || 'celsius', new Date().toISOString(), 'auto');
          console.log(`[sensor] stored: ${parsed.temperature}°${parsed.unit || 'celsius'}, ${parsed.humidity}%`);
          resolve(parsed);
        } catch {
          reject(new Error('Invalid ESP response'));
        }
      });
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function start() {
  await sensors.init();
  await gastos.init();
  await maintenance.init();

  gastosCron.backfill();
  cron.schedule('0 0 * * *', () => gastosCron.run());

  pollSensor().catch(() => console.log('[sensor] initial poll failed, will retry'));
  cron.schedule('*/5 * * * *', () => pollSensor().catch((err) => console.log('[sensor] poll failed:', err.message)));

  const PORT = Number(process.env.PORT) || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use (EADDRINUSE).`);
      console.error('Options:');
      console.error(`  • Stop whatever is using it (e.g. another node, Docker: docker compose down)`);
      console.error(`  • Or use another port: PORT=3001 node src/index.js\n`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

start();
