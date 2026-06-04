# all-node-app

React 18 MPA + Express 4 backend. No TypeScript, no router (native `<a>` navigation).

## Stack
- **Frontend:** React 18, Vite 5 (MPA mode), plain CSS
- **Backend:** Express 4, express-session, JSON file persistence
- **Entry:** `frontend/index.html` → hub

## Structure
```
backend/src/
  app.js              # Express setup, mounts routes
  index.js            # HTTP server (port 3000)
  data/persistence.js # JSON file read/write helpers
  routes/             # One file per app (gastos-routes.js, schedule-routes.js...)
  middleware/auth.js  # sessionMiddleware (checks req.session.user)
frontend/
  vite.config.js      # MPA entry points + proxy to :3000
  src/App.jsx         # Hub: app grid, login
  src/useAuth.js      # Hook: fetches /api/auth/me
  apps/{name}/        # Each mini-app = separate Vite entry
    index.html
    main.jsx
    {Name}App.jsx
    style.css
```

## Add a new mini-app
1. Create `frontend/apps/{name}/` with `index.html`, `main.jsx`, `{Name}App.jsx`, `style.css`
2. Register entry in `vite.config.js` `rollupOptions.input`
3. Add clean URL redirect in `vite.config.js` `cleanUrls` middleware
4. Add link in `frontend/src/App.jsx` `APPS` array
5. If backend needed: create route in `backend/src/routes/`, add persistence in `persistence.js`, mount in `app.js`
6. Update `frontend/nginx.conf` rewrite rule

## Conventions
- Plain CSS (no Tailwind, no modules), global reset `*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }`
- `useAuth()` hook at top of component for auth-required apps
- API calls use `fetch('/api/{name}', { credentials: 'include' })`
- Backend routes follow GET = load, POST = save, DELETE = remove pattern
- JSON persistence default: `{ balance: 1750, lastMonday: null, transactions: [] }`

## Apps
| Route | Auth | Persistence |
|-------|------|-------------|
| schedule | yes | JSON |
| checklist | yes | JSON |
| maintenance | yes | SQLite |
| calisthenics | yes | JSON |
| diet | no | localStorage |
| cv | no | none |
| gastos | yes | SQLite |
| room-monitor | yes | SQLite |
