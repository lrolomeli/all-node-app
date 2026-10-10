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
room-automation/        # App de aire (se moverá a su propio repo)
  backend/              # Express: sensores, IR, climate, temporizador
  frontend/             # UI (Vite + React)
  docker-compose.yml
docker-compose.yml      # Solo la landing
```

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

Ver [`room-automation/README.md`](room-automation/README.md). Es un proyecto
independiente con su propio backend y `docker-compose.yml`, pensado para
extraerse a su propio repositorio.
