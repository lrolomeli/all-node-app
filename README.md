# all-node-app

A unified Node.js application with multiple mini-apps for productivity, portfolio, health tracking, and entertainment.

## Features

### Original Apps
1. **Schedule App** (`/schedule`) - Manage your schedules and appointments with customizable time slots
2. **Checklist App** (`/checklist`) - Firmware engineer interview checklist with persistent state
3. **Maintenance Tracker** (`/maintenance`) - Track maintenance dates for filters, equipment, and other items

### Portfolio & Professional Apps
4. **Luis Lomeli's Portfolio** (`/portfolio`) - Personal portfolio with games, projects, work experience, and skills
5. **Professional CV** (`/cv`) - Bootstrap-styled professional resume with navigation

### Health & Fitness Apps
6. **Diet Tracker** (`/diet`) - Spanish diet plan tracker with checkboxes and local storage persistence
7. **Gym Routine** (`/gym`) - Weekly workout routine with muscle group exercises, external links, and optional saved media (API)

### Productivity
8. **Budget** (`/budget`) - Income, expenses, savings, and fun money tracking
9. **Activities** (`/activities`) - Activity list with completion tracking

### Fun Apps
10. **Catify** (`/catify`) - Cat-themed page with images and links

### Family Health
11. **Expediente Médico** (`/expediente`) - Roberto Lomelí's clinical record (historial, estudios, medicamentos, etc.)

## Project Structure

```
├── src/
│   ├── index.js              # HTTP server entry
│   ├── app.js                # Express app (middleware, static, routers)
│   ├── paths.js              # Root / data / public path constants
│   ├── data/
│   │   ├── persistence.js    # JSON file read/write for app data
│   │   └── invites.js        # Invite tokens (hashed) + redeem / admin helpers
│   ├── middleware/
│   │   ├── sessionAuth.js    # In-memory session tokens after invite exchange
│   │   └── rateLimiter.js
│   └── routes/
│       ├── auth.js           # POST /api/auth/exchange, invite admin APIs
│       ├── pages.js          # Friendly URLs → HTML
│       └── api.js            # REST JSON APIs
├── data/                     # Runtime JSON persistence (git may track defaults)
│   ├── schedule-data.json
│   ├── checklist-state.json
│   ├── maintenance-data.json
│   ├── budget-data.json
│   ├── activities-data.json
│   ├── gym-media.json
│   ├── gym-routine.csv       # Gym weekly routine (editable from /gym UI)
│   └── invites.json          # Invite records (hashes only; see Authentication)
├── scripts/
│   ├── create-invite.js      # CLI: print a new invite token
├── public/
│   ├── index.html            # Home hub
│   ├── auth.js               # Client: invite modal + session (global pinAuth)
│   ├── apps/                 # Dashboard mini-apps (schedule, checklist, …)
│   ├── allp/                 # Portfolio (`/portfolio`); subpages in `pages/`
│   ├── cv/                   # CV site; subpages in `pages/`
│   ├── diet/
│   ├── gym/                  # Includes routine.csv where used
│   ├── expediente/           # Roberto Lomelí clinical record (synced via script)
│   └── other/                # Catify; subpages in `pages/`
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open `http://localhost:3000`
```

## Authentication

Invites and sessions replace fixed passwords:

- **Public access**: All pages load without logging in.
- **Writes**: Mutating APIs (schedule, checklist, maintenance, budget, activities, gym media, …) need a **session** obtained by redeeming an **invite token**.
- **Invite tokens** are long random strings. Only a **SHA-256 hash** (plus optional pepper) is stored in `data/invites.json`.
- **Sessions** live in server memory (`SESSION_TTL_MS`, default 24h) and in the browser as `localStorage.sessionToken`.

### First invite (CLI)

After clone or deploy, create at least one invite:

```bash
npm run invite:create
```

Optional flags:

```bash
npm run invite:create -- --label "laptop" --max-uses 5 --expires-days 30
```

Copy the printed token once; it cannot be recovered from disk.

### Magic link

Share `https://your-host/schedule?invite=TOKEN` (any page works). The client exchanges the token, stores the session, and strips `invite` from the URL.

### Environment

```
PORT=3000
# Strong random string; changing it invalidates existing invite hashes
INVITE_PEPPER=change_me_to_something_long_and_random
# Session lifetime in ms (default 86400000 = 24h)
SESSION_TTL_MS=86400000
```

### Managing invites over HTTP (optional)

With a valid session (`x-session-token` header):

- `GET /api/invites` — list metadata (no secrets)
- `POST /api/invites` — body `{ "label"?, "maxUses"?, "expiresInDays"? }` — returns new `inviteToken` once
- `DELETE /api/invites/:id` — revoke an invite
