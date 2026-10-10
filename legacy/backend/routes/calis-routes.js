const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

const CSV_HEADER = 'Sesión,Fase,Enfoque,Dosis,Nivel 1 (Principiante),Nivel 2 (Intermedio),Nivel 3 (Avanzado)';

const FASE_VALUES = new Set(['Calentamiento', 'Fuerza', 'Cardio', 'Estiramiento']);

function escapeCSV(val) {
  if (!val) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function serializeSessionsToCSV(sessions) {
  const lines = [CSV_HEADER];
  sessions.forEach((session, idx) => {
    const sessionNum = idx + 1;
    session.forEach((ex) => {
      const row = [
        `Sesión ${sessionNum}`,
        escapeCSV(ex.fase || ''),
        escapeCSV(ex.enfoque || ''),
        escapeCSV(ex.dosis || ''),
        escapeCSV(ex.niveles?.[0] || ''),
        escapeCSV(ex.niveles?.[1] || ''),
        escapeCSV(ex.niveles?.[2] || ''),
      ];
      lines.push(row.join(','));
    });
  });
  return lines.join('\n');
}

function validateSessions(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return 'sessions must be a non-empty array';
  }
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (!Array.isArray(session) || session.length === 0) {
      return `session ${i + 1} must be a non-empty array`;
    }
    for (let j = 0; j < session.length; j++) {
      const ex = session[j];
      if (!ex || typeof ex !== 'object') {
        return `exercise at session ${i + 1}[${j}] must be an object`;
      }
      if (ex.fase && !FASE_VALUES.has(ex.fase)) {
        return `invalid fase "${ex.fase}" at session ${i + 1}[${j}]`;
      }
      if (!Array.isArray(ex.niveles) || ex.niveles.length !== 3) {
        return `niveles must be an array of 3 at session ${i + 1}[${j}]`;
      }
    }
  }
  return null;
}

router.get('/rutina', (req, res) => {
  const csv = persistence.loadCalisthenicsRutina();
  res.type('text/csv; charset=utf-8').send(csv);
});

router.put('/rutina', (req, res) => {
  const { sessions } = req.body;
  const validationError = validateSessions(sessions);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  const csv = serializeSessionsToCSV(sessions);
  persistence.saveCalisthenicsRutina(csv);
  res.json({ success: true });
});

router.get('/progress', (req, res) => {
  res.json(persistence.loadCalisthenicsProgress());
});

router.post('/progress', (req, res) => {
  const { level, currentSession } = req.body;
  if (typeof level !== 'number' || typeof currentSession !== 'number') {
    return res.status(400).json({ error: 'level and currentSession must be numbers' });
  }
  persistence.saveCalisthenicsProgress({ level, currentSession });
  res.json({ success: true });
});

module.exports = router;
