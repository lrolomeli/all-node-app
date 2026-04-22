const { Router } = require('express');
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, '.', 'data');

const router = Router();

function sendPublic(...segments) {
  return (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, ...segments));
  };
}

router.get('/', sendPublic('index.html'));
router.get('/schedule', sendPublic('apps', 'schedule.html'));
router.get('/checklist', sendPublic('apps', 'checklist.html'));
router.get('/maintenance', sendPublic('apps', 'maintenance.html'));
router.get('/cv', sendPublic('cv', 'index.html'));
router.get('/diet', sendPublic('diet', 'index.html'));
router.get('/gym', sendPublic('gym', 'index.html'));
router.get('/catify', sendPublic('other', 'index.html'));
router.get('/budget', sendPublic('apps', 'budget.html'));
router.get('/activities', sendPublic('apps', 'activities.html'));
router.get('/expediente', sendPublic('expediente', 'historial.html'));
router.get('/calisthenics', sendPublic('calisthenics', 'index.html'));

module.exports = router;
