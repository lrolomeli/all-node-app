# luisrlp-web

Landing estática (React 18 + Vite, servida por Nginx). Sin backend ni login:
solo enlaces a los servicios. Las apps viejas viven en `legacy/` y Room
Automation (aire) quedó como subproyecto en `room-automation/`.

## Stack
- **Landing:** React 18, Vite 5, plain CSS (`frontend/`)
- **Room Automation:** React 18 + Vite (`room-automation/frontend`) + Express 4 (`room-automation/backend`)
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
room-automation/          # app de aire (se extraerá a su repo)
  backend/src/{app,index,esp,services,data,automation,db,routes,middleware}
  frontend/src/{ClimateApp,views,components}
  docker-compose.yml
docker-compose.yml        # landing
```

## Convenciones
- Plain CSS (sin Tailwind ni módulos). Reset global en cada `app.css`/`style.css`.
- Landing: API pública, sin auth. Editar enlaces en `frontend/src/services.js`.
- Room Automation: `/api/sensors` público; el resto con sesión.
- Vite dev proxy `/api → http://localhost:3000` (solo room-automation).

## Comandos
```bash
npm run dev --prefix frontend      # landing
npm run build --prefix frontend
docker compose up -d --build       # landing en :3000

docker compose up -d --build       # room-automation (desde room-automation/, :8080)
```

## Apps
| App | Ubicación | Estado |
|-----|-----------|--------|
| landing | `frontend/` | activa |
| room-automation | `room-automation/` | activa (a extraer) |
| schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list | `legacy/` | archivadas |
