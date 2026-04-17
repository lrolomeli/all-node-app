const path = require('path');

const ROOT = path.join(__dirname, '..');

module.exports = {
  ROOT,
  DATA_DIR: path.join(ROOT, 'data'),
  PUBLIC_DIR: path.join(ROOT, 'public'),
  EXPEDIENTE_DIR: path.join(ROOT, 'roberto-lomeli-expediente'),
};
