const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('express-basic-auth');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic authentication
const users = {};
users[process.env.AUTH_USERNAME || 'admin'] = process.env.AUTH_PASSWORD || 'secure123';
app.use(basicAuth({
    users,
    challenge: true
}));

app.use(express.static('public'));
app.use(express.json());

// Schedule data handling
function loadScheduleData() {
    try {
        return JSON.parse(fs.readFileSync('schedule-data.json', 'utf8'));
    } catch {
        return { activityLists: [], schedules: [] };
    }
}

function saveScheduleData(data) {
    fs.writeFileSync('schedule-data.json', JSON.stringify(data, null, 2));
}

// Checklist data handling
let checklistState = {};
try {
  checklistState = JSON.parse(fs.readFileSync('checklist-state.json', 'utf8'));
} catch (err) {
  checklistState = {};
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});

app.get('/checklist', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checklist.html'));
});

// Schedule API
app.get('/api/data', (req, res) => res.json(loadScheduleData()));
app.post('/api/data', (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid data' });
    }
    saveScheduleData(req.body);
    res.json({ success: true });
});

// Checklist API
app.get('/api/state', (req, res) => {
  res.json(checklistState);
});

app.post('/api/state', (req, res) => {
  const { id, checked } = req.body;
  if (!id || typeof checked !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  checklistState[id] = checked;
  fs.writeFileSync('checklist-state.json', JSON.stringify(checklistState));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
