const { Router } = require('express');
const persistence = require('../data/persistence');

const router = Router();

router.get('/routine', (req, res) => {
  const csv = persistence.loadGymRoutine();
  res.type('text/csv; charset=utf-8').send(csv);
});

router.put('/routine', (req, res) => {
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

router.get('/media', (req, res) => {
  res.json(persistence.loadGymMedia());
});

router.post('/media', (req, res) => {
  const { exercise, url, label } = req.body;
  if (!exercise || !url) return res.status(400).json({ error: 'exercise and url are required' });

  const media = persistence.loadGymMedia();
  if (!media[exercise]) media[exercise] = [];
  media[exercise].push({ id: Date.now().toString(), url, label: label || url });
  persistence.saveGymMedia(media);
  res.json({ success: true, media: media[exercise] });
});

router.delete('/media/:exercise/:id', (req, res) => {
  const { exercise, id } = req.params;
  const media = persistence.loadGymMedia();
  if (media[exercise]) {
    media[exercise] = media[exercise].filter((m) => m.id !== id);
    if (media[exercise].length === 0) delete media[exercise];
  }
  persistence.saveGymMedia(media);
  res.json({ success: true });
});

module.exports = router;
