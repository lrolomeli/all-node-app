# luisrlp-web

Landing estática en **HTML/CSS/JS puro**, servida por Nginx. Sin framework, sin
build y sin backend: solo enlaces a los servicios. Las apps viejas viven en
`legacy/`. Room Automation (aire) está en su propio repo.

## Stack
- **Landing:** HTML + CSS (vanilla) + JS mínimo (reveal, nav, año) — `frontend/`
- **Deploy:** Docker + Nginx (copia estática, sin etapa de build)

## Estructura
La página es vertical: nav sticky → hero → bento grid (1 tile por app) → carrusel → footer.
```
frontend/                 # landing (lo único que se despliega)
  index.html              # nav + hero + bento + carrusel + SVG inline (← editar aquí)
  styles.css              # tema oscuro, bento grid, carrusel CSS, reveal
  app.js                  # IntersectionObserver (reveal + nav activo), año
  nginx.conf, Dockerfile
legacy/                   # apps archivadas (no se compilan)
  frontend/apps/{schedule,calisthenics,cv,gastos,maintenance,checklist,shopping-list}
  backend/{routes,db,cron,data,scripts}
docker-compose.yml        # landing
```

Room Automation vive en su propio repo: https://github.com/lrolomeli/room-automation

## Convenciones
- Sin dependencias ni bundler: se edita directamente `frontend/index.html`.
- Iconos como SVG inline (no emoji, sin librería).
- Carrusel con animación CSS pura (se pausa al hover/foco; respeta `prefers-reduced-motion`).
- Reveal on scroll: `.reveal` se oculta solo con la clase `.js` (sin JS el contenido se ve igual).
- Tipografía vía Google Fonts (Sora + Inter).

## Comandos
```bash
npm run dev                        # servidor estático en :5173 (python3)
docker compose up -d --build       # landing en :3000
```

## Apps
| App | Ubicación | Estado |
|-----|-----------|--------|
| landing | `frontend/` | activa (HTML/CSS/JS) |
| schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list | `legacy/` | archivadas |
| room-automation | https://github.com/lrolomeli/room-automation | repo aparte |
