# luisrlp-web

Landing estática (React 18 + Vite, servida por Nginx). Sin backend ni login:
solo enlaces a los servicios. Las apps viejas viven en `legacy/`. Room
Automation (aire) está en su propio repo.

## Stack
- **Landing:** React 18, Vite 5, plain CSS (`frontend/`)
- **Deploy:** Docker + Nginx

## Estructura
```
frontend/                 # landing (único build desplegado)
  src/App.jsx             # landing
  src/services.js         # ← enlaces/servicios (editar aquí)
  src/app.css
  vite.config.js, nginx.conf, Dockerfile
legacy/                   # apps archivadas (no se compilan)
  frontend/apps/{schedule,calisthenics,cv,gastos,maintenance,checklist,shopping-list}
  backend/{routes,db,cron,data,scripts}
docker-compose.yml        # landing
```

Room Automation vive en su propio repo: https://github.com/lrolomeli/room-automation

## Convenciones
- Plain CSS (sin Tailwind ni módulos). Reset global en cada `app.css`/`style.css`.
- Landing: API pública, sin auth. Editar enlaces en `frontend/src/services.js`.

## Comandos
```bash
npm run dev --prefix frontend      # landing
npm run build --prefix frontend
docker compose up -d --build       # landing en :3000
```

## Apps
| App | Ubicación | Estado |
|-----|-----------|--------|
| landing | `frontend/` | activa |
| schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list | `legacy/` | archivadas |
| room-automation | https://github.com/lrolomeli/room-automation | repo aparte |
