const { Router } = require('express');
const persistence = require('../data/persistence');
const { sessionMiddleware } = require('../middleware/sessionAuth');

const router = Router();

let checklistState = persistence.loadChecklistState();

router.get('/api/data', (req, res) => {
  res.json(persistence.loadScheduleData());
});

router.post('/api/data', sessionMiddleware, (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  persistence.saveScheduleData(req.body);
  res.json({ success: true });
});

router.get('/api/state', (req, res) => {
  res.json(checklistState);
});

router.post('/api/state', sessionMiddleware, (req, res) => {
  const { id, checked } = req.body;
  if (!id || typeof checked !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  checklistState[id] = checked;
  persistence.saveChecklistState(checklistState);
  res.json({ success: true });
});

router.get('/api/maintenance', (req, res) => {
  res.json(persistence.loadMaintenanceData());
});

router.post('/api/maintenance', sessionMiddleware, (req, res) => {
  const record = req.body;
  if (!record || !record.itemType || !record.itemName || !record.date || !record.time || !record.description) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const records = persistence.loadMaintenanceData();
  records.push(record);
  persistence.saveMaintenanceData(records);
  res.json({ success: true });
});

router.delete('/api/maintenance/:id', sessionMiddleware, (req, res) => {
  const { id } = req.params;
  let records = persistence.loadMaintenanceData();
  records = records.filter((r) => r.id !== id);
  persistence.saveMaintenanceData(records);
  res.json({ success: true });
});

router.get('/api/budget', (req, res) => {
  res.json(persistence.loadBudgetData());
});

router.post('/api/budget', sessionMiddleware, (req, res) => {
  const budgetData = req.body;
  if (!budgetData || typeof budgetData !== 'object') {
    return res.status(400).json({ error: 'Invalid budget data' });
  }
  persistence.saveBudgetData(budgetData);
  res.json({ success: true });
});

router.delete('/api/budget/:type/:id', sessionMiddleware, (req, res) => {
  const { type, id } = req.params;
  const budgetData = persistence.loadBudgetData();

  if (!budgetData[type]) {
    return res.status(400).json({ error: 'Invalid budget type' });
  }

  budgetData[type] = budgetData[type].filter((item) => item.id !== id);
  persistence.saveBudgetData(budgetData);
  res.json({ success: true });
});

router.get('/api/gym/routine', (req, res) => {
  const csv = persistence.loadGymRoutine();
  res.type('text/csv; charset=utf-8').send(csv);
});

router.put('/api/gym/routine', sessionMiddleware, (req, res) => {
  const csv = req.body && typeof req.body.csv === 'string' ? req.body.csv : null;
  if (csv === null) {
    return res.status(400).json({ error: 'Body must be JSON with a string field "csv"' });
  }
  const trimmed = csv.replace(/^\uFEFF/, '');
  const first = trimmed.split(/\r?\n/).find((l) => l.trim().length > 0) || '';
  if (!/^bloque\s*,/i.test(first.trim())) {
    return res.status(400).json({
      error: 'CSV inválido',
      message: 'La primera fila debe ser el encabezado: bloque,dia,muscle,ejercicio,series,repeticiones,notas',
    });
  }
  persistence.saveGymRoutine(trimmed.endsWith('\n') ? trimmed : `${trimmed}\n`);
  res.json({ success: true });
});

router.get('/api/gym/media', (req, res) => {
  res.json(persistence.loadGymMedia());
});

router.post('/api/gym/media', sessionMiddleware, (req, res) => {
  const { exercise, url, label } = req.body;
  if (!exercise || !url) return res.status(400).json({ error: 'exercise and url are required' });

  const media = persistence.loadGymMedia();
  if (!media[exercise]) media[exercise] = [];
  media[exercise].push({ id: Date.now().toString(), url, label: label || url });
  persistence.saveGymMedia(media);
  res.json({ success: true, media: media[exercise] });
});

router.delete('/api/gym/media/:exercise/:id', sessionMiddleware, (req, res) => {
  const { exercise, id } = req.params;
  const media = persistence.loadGymMedia();
  if (media[exercise]) {
    media[exercise] = media[exercise].filter((m) => m.id !== id);
    if (media[exercise].length === 0) delete media[exercise];
  }
  persistence.saveGymMedia(media);
  res.json({ success: true });
});

router.get('/api/activities', (req, res) => {
  res.json(persistence.loadActivitiesData());
});

router.post('/api/activities', sessionMiddleware, (req, res) => {
  const activity = req.body;
  if (!activity || !activity.name || !activity.name.trim()) {
    return res.status(400).json({ error: 'Activity name is required' });
  }
  const activities = persistence.loadActivitiesData();
  activities.push(activity);
  persistence.saveActivitiesData(activities);
  res.json({ success: true });
});

router.put('/api/activities/:id/complete', sessionMiddleware, (req, res) => {
  const { id } = req.params;
  const activities = persistence.loadActivitiesData();
  const activity = activities.find((a) => a.id === id);
  if (activity) {
    activity.completed = true;
    activity.completedDate = new Date().toISOString();
    persistence.saveActivitiesData(activities);
  }
  res.json({ success: true });
});

router.delete('/api/activities/:id', sessionMiddleware, (req, res) => {
  const { id } = req.params;
  let activities = persistence.loadActivitiesData();
  activities = activities.filter((a) => a.id !== id);
  persistence.saveActivitiesData(activities);
  res.json({ success: true });
});

module.exports = router;
