const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// PIN authentication middleware
const AUTH_PIN = process.env.AUTH_PIN || '123456';

// Store authenticated sessions
const authenticatedSessions = new Set();

// Generate session token
function generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// PIN authentication middleware
const pinAuthMiddleware = (req, res, next) => {
    const sessionToken = req.headers['x-session-token'] || req.query.session;
    
    if (sessionToken && authenticatedSessions.has(sessionToken)) {
        return next();
    }
    
    const pin = req.headers['x-auth-pin'] || req.body.pin;
    
    if (pin === AUTH_PIN) {
        const token = generateSessionToken();
        authenticatedSessions.add(token);
        
        // Clean up old sessions after 24 hours
        setTimeout(() => {
            authenticatedSessions.delete(token);
        }, 24 * 60 * 60 * 1000);
        
        res.setHeader('x-session-token', token);
        return next();
    }
    
    return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Please provide a valid 6-digit PIN' 
    });
};

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

// Maintenance data handling
function loadMaintenanceData() {
    try {
        return JSON.parse(fs.readFileSync('maintenance-data.json', 'utf8'));
    } catch {
        return [];
    }
}

function saveMaintenanceData(data) {
    fs.writeFileSync('maintenance-data.json', JSON.stringify(data, null, 2));
}

// Budget data handling
function loadBudgetData() {
    try {
        return JSON.parse(fs.readFileSync('budget-data.json', 'utf8'));
    } catch {
        return {
            income: [],
            expenses: [],
            savings: [],
            funMoney: []
        };
    }
}

function saveBudgetData(data) {
    fs.writeFileSync('budget-data.json', JSON.stringify(data, null, 2));
}
// Activities data handling
function loadActivitiesData() {
    try {
        return JSON.parse(fs.readFileSync('activities-data.json', 'utf8'));
    } catch {
        return [];
    }
}

function saveActivitiesData(data) {
    fs.writeFileSync('activities-data.json', JSON.stringify(data, null, 2));
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

app.get('/maintenance', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'maintenance.html'));
});

// New page routes
app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'allp', 'index.html'));
});

app.get('/cv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cv', 'index.html'));
});

app.get('/diet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'diet', 'index.html'));
});

app.get('/gym', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gym', 'index.html'));
});

app.get('/catify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'other', 'index.html'));
});

app.get('/budget', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'budget.html'));
});

app.get('/activities', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'activities.html'));
});

// Schedule API
app.get('/api/data', (req, res) => res.json(loadScheduleData()));
app.post('/api/data', pinAuthMiddleware, (req, res) => {
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

app.post('/api/state', pinAuthMiddleware, (req, res) => {
  const { id, checked } = req.body;
  if (!id || typeof checked !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  checklistState[id] = checked;
  fs.writeFileSync('checklist-state.json', JSON.stringify(checklistState));
  res.json({ success: true });
});

// Maintenance API
app.get('/api/maintenance', (req, res) => {
  res.json(loadMaintenanceData());
});

app.post('/api/maintenance', pinAuthMiddleware, (req, res) => {
  const record = req.body;
  if (!record || !record.itemType || !record.itemName || !record.date || !record.time || !record.description) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const records = loadMaintenanceData();
  records.push(record);
  saveMaintenanceData(records);
  res.json({ success: true });
});

app.delete('/api/maintenance/:id', pinAuthMiddleware, (req, res) => {
  const { id } = req.params;
  let records = loadMaintenanceData();
  records = records.filter(r => r.id !== id);
  saveMaintenanceData(records);
  res.json({ success: true });
});

// Budget API
app.get('/api/budget', (req, res) => {
  res.json(loadBudgetData());
});

app.post('/api/budget', pinAuthMiddleware, (req, res) => {
  const budgetData = req.body;
  if (!budgetData || typeof budgetData !== 'object') {
    return res.status(400).json({ error: 'Invalid budget data' });
  }
  saveBudgetData(budgetData);
  res.json({ success: true });
});

app.delete('/api/budget/:type/:id', pinAuthMiddleware, (req, res) => {
  const { type, id } = req.params;
  const budgetData = loadBudgetData();
  
  if (!budgetData[type]) {
    return res.status(400).json({ error: 'Invalid budget type' });
  }
  
  budgetData[type] = budgetData[type].filter(item => item.id !== id);
  saveBudgetData(budgetData);
  res.json({ success: true });
});

// Activities API
app.get('/api/activities', (req, res) => {
  res.json(loadActivitiesData());
});

app.post('/api/activities', pinAuthMiddleware, (req, res) => {
  const activity = req.body;
  if (!activity || !activity.name || !activity.name.trim()) {
    return res.status(400).json({ error: 'Activity name is required' });
  }
  const activities = loadActivitiesData();
  activities.push(activity);
  saveActivitiesData(activities);
  res.json({ success: true });
});

app.put('/api/activities/:id/complete', pinAuthMiddleware, (req, res) => {
  const { id } = req.params;
  let activities = loadActivitiesData();
  const activity = activities.find(a => a.id === id);
  if (activity) {
    activity.completed = true;
    activity.completedDate = new Date().toISOString();
    saveActivitiesData(activities);
  }
  res.json({ success: true });
});

app.delete('/api/activities/:id', pinAuthMiddleware, (req, res) => {
  const { id } = req.params;
  let activities = loadActivitiesData();
  activities = activities.filter(a => a.id !== id);
  saveActivitiesData(activities);
  res.json({ success: true });
});

// PIN Authentication endpoint
app.post('/api/auth/verify', (req, res) => {
  const { pin } = req.body;
  
  if (pin === AUTH_PIN) {
    const token = generateSessionToken();
    authenticatedSessions.add(token);
    
    // Clean up old sessions after 24 hours
    setTimeout(() => {
      authenticatedSessions.delete(token);
    }, 24 * 60 * 60 * 1000);
    
    res.json({ success: true, sessionToken: token });
  } else {
    res.status(401).json({ error: 'Invalid PIN' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
