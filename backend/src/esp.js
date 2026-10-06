const http = require('http');

const ESP_HOST = process.env.ESP_HOST || '192.168.100.239';
const ESP_PORT = Number(process.env.ESP_PORT) || 80;

function espRequest(path, { method = 'GET', timeout = 5000 } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('ESP timeout')), timeout);
    const req = http.request(
      { host: ESP_HOST, port: ESP_PORT, path, method },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          clearTimeout(timer);
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Invalid ESP response'));
          }
        });
      }
    );
    req.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    req.end();
  });
}

module.exports = { espRequest, ESP_HOST, ESP_PORT };
