# luisrlp-web

Página web personal que enlaza a los distintos servicios y proyectos. Es una
landing estática (React + Vite, servida por Nginx): no tiene backend ni login.

## Servicios

Los enlaces se editan en [`frontend/src/services.js`](frontend/src/services.js):

- **Room Automation** — `https://ra.luisrlp.com` (monitor + control IR + automatización del aire)
- **Movies** — `https://movies.luisrlp.com`
- **Fut** — `https://fut.luisrlp.com`
- **Mantenimientos** — documento en la nube (editar URL)
- **CV / Portafolio** — (editar URL)

## Estructura

```
frontend/               # Landing (Vite + React). Única app que se compila y despliega.
  src/
    App.jsx             # Landing
    services.js         # ← edita aquí los enlaces/servicios
    app.css
  nginx.conf
  Dockerfile
legacy/                 # Apps archivadas (no se compilan ni despliegan)
  frontend/apps/        # schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list
  backend/              # rutas/DB de esas apps
docker-compose.yml      # Solo la landing
```

> Room Automation ya vive en su propio repo:
> https://github.com/lrolomeli/room-automation

## Desarrollo

```bash
npm install --prefix frontend
npm run dev            # http://localhost:5173
```

## Build

```bash
npm run build          # genera frontend/dist
```

## Deploy (Docker)

```bash
docker compose up -d --build
```

Sirve la landing en `http://localhost:3000`.

## Room Automation

Proyecto independiente (backend + frontend + `docker-compose.yml`) extraído a su
propio repositorio: https://github.com/lrolomeli/room-automation
