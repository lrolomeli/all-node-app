const { Router } = require('express');
const path = require('path');
const { PUBLIC_DIR } = require('../paths');

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
router.get('/portfolio', sendPublic('allp', 'index.html'));
router.get('/cv', sendPublic('cv', 'index.html'));
router.get('/diet', sendPublic('diet', 'index.html'));
router.get('/gym', sendPublic('gym', 'index.html'));
router.get('/catify', sendPublic('other', 'index.html'));
router.get('/budget', sendPublic('apps', 'budget.html'));
router.get('/activities', sendPublic('apps', 'activities.html'));

module.exports = router;
