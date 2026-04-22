const { Router } = require('express');
const invites = require('../data/invites');
const { createSession, sessionMiddleware } = require('../middleware/sessionAuth');

const router = Router();

router.post('/api/auth/exchange', (req, res) => {
  const inviteToken =
    req.body && req.body.inviteToken != null ? String(req.body.inviteToken).trim() : '';
  if (!inviteToken) {
    return res.status(400).json({ error: 'inviteToken required' });
  }

  const redeemed = invites.redeemInvite(inviteToken);
  if (!redeemed.ok) {
    return res.status(401).json({
      error: 'Invalid or unusable invite',
      code: redeemed.reason,
    });
  }

  const sessionToken = createSession();
  res.json({ success: true, sessionToken });
});

router.get('/api/invites', sessionMiddleware, (req, res) => {
  res.json({ invites: invites.listInvitesMeta() });
});

router.post('/api/invites', sessionMiddleware, (req, res) => {
  const { label, maxUses, expiresInDays } = req.body || {};
  let expiresAt = null;
  if (expiresInDays != null && Number(expiresInDays) > 0) {
    expiresAt = new Date(Date.now() + Number(expiresInDays) * 864e5).toISOString();
  }
  const max =
    maxUses != null && Number.isFinite(Number(maxUses)) ? Number(maxUses) : null;
  const created = invites.addInvite({
    label: label != null ? String(label) : '',
    expiresAt,
    maxUses: max,
  });
  res.json({ success: true, id: created.id, inviteToken: created.inviteToken });
});

router.delete('/api/invites/:id', sessionMiddleware, (req, res) => {
  const ok = invites.revokeInvite(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Invite not found' });
  res.json({ success: true });
});

module.exports = router;
