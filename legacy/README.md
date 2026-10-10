# legacy

Apps archivadas que ya no forman parte del build ni del despliegue de este
proyecto. Se conservan por si se quieren reactivar más adelante.

## Contenido

```
frontend/apps/     # schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list
frontend/src/      # Login.jsx, useAuth.js, requireAuth.jsx, HomeButton.jsx
backend/
  routes/          # rutas de esas apps
  db/              # maintenance.js, gastos.js, init.js
  cron/            # gastos-cron.js
  data/            # datos runtime de esas apps
  scripts/         # migraciones/scripts
```

No se incluyen en `frontend/vite.config.js` ni en `docker-compose.yml`.

Para reactivar una app: muévela de vuelta a `frontend/apps/`, registra su
entrada (o intégrala a la single app) y vuelve a montar sus rutas en un backend.
