const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../paths');

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
  activities: path.join(DATA_DIR, 'activities-data.json'),
  gymMedia: path.join(DATA_DIR, 'gym-media.json'),
  gymRoutine: path.join(DATA_DIR, 'gym-routine.csv'),
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

  loadActivitiesData() {
    return readJson(files.activities, []);
  },
  saveActivitiesData(data) {
    writeJson(files.activities, data);
  },

  loadGymMedia() {
    return readJson(files.gymMedia, {});
  },
  saveGymMedia(data) {
    writeJson(files.gymMedia, data);
  },

  loadChecklistState() {
    return readJson(files.checklist, {});
  },
  saveChecklistState(state) {
    fs.writeFileSync(files.checklist, JSON.stringify(state));
  },

  loadGymRoutine() {
    try {
      return fs.readFileSync(files.gymRoutine, 'utf8');
    } catch {
      return '';
    }
  },
  saveGymRoutine(csvText) {
    fs.writeFileSync(files.gymRoutine, csvText, 'utf8');
  },
};
