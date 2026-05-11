const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname,'../..','data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const files = {
  schedule: path.join(DATA_DIR, 'schedule-data.json'),
  checklist: path.join(DATA_DIR, 'checklist-state.json'),
  maintenance: path.join(DATA_DIR, 'maintenance-data.json'),
  budget: path.join(DATA_DIR, 'budget-data.json'),
  calisthenicsRutina: path.join(DATA_DIR, 'calisthenics-rutina.csv'),
  calisthenicsProgress: path.join(DATA_DIR, 'calisthenics-progress.json'),
  gastos: path.join(DATA_DIR, 'gastos-data.json'),
};

module.exports = {
  loadScheduleData() {
    return readJson(files.schedule, { activityLists: [], schedules: [] });
  },
  saveScheduleData(data) {
    writeJson(files.schedule, data);
  },

  loadMaintenanceData() {
    return readJson(files.maintenance, []);
  },
  saveMaintenanceData(data) {
    writeJson(files.maintenance, data);
  },

  loadBudgetData() {
    return readJson(files.budget, {
      income: [],
      expenses: [],
      savings: [],
      funMoney: [],
    });
  },
  saveBudgetData(data) {
    writeJson(files.budget, data);
  },

  loadChecklistState() {
    return readJson(files.checklist, {});
  },
  saveChecklistState(state) {
    fs.writeFileSync(files.checklist, JSON.stringify(state));
  },

  loadCalisthenicsRutina() {
    try {
      return fs.readFileSync(files.calisthenicsRutina, 'utf8');
    } catch {
      return '';
    }
  },

  loadCalisthenicsProgress() {
    return readJson(files.calisthenicsProgress, { level: 0, currentSession: 1 });
  },
  saveCalisthenicsProgress(data) {
    writeJson(files.calisthenicsProgress, data);
  },

  loadGastosData() {
    return readJson(files.gastos, { balance: 1750, lastMonday: null, transactions: [] });
  },
  saveGastosData(data) {
    writeJson(files.gastos, data);
  },
};
