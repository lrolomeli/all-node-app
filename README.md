# luisrlp-web

Página web personal que enlaza a los distintos servicios y proyectos. Es una
landing **estática en HTML/CSS/JS puro**, servida por Nginx: sin framework, sin
build y sin backend.

## Servicios

Los enlaces están en [`frontend/index.html`](frontend/index.html). Cada tarjeta
es un `<a class="service-card" href="...">` con su icono SVG inline.

- **Room Automation** — `https://ra.luisrlp.com` (monitor + control IR + automatización del aire)
- **Movies** — `https://movies.luisrlp.com`
- **Fut** — `https://fut.luisrlp.com`
- **Mantenimientos** — documento en la nube (editar URL)
- **CV / Portafolio** — (editar URL)

## Estructura

```
frontend/               # Landing estática (única cosa que se despliega)
  index.html            # ← edita aquí los enlaces/servicios y textos (nav, hero, bento, carrusel)
  styles.css            # Estilos (tema oscuro, bento grid, carrusel CSS, reveal)
  app.js                # JS vanilla: reveal on scroll, nav activo, año
  nginx.conf
  Dockerfile            # Nginx + copia de archivos (sin build)
legacy/                 # Apps archivadas (no se compilan ni despliegan)
  frontend/apps/        # schedule, calisthenics, cv, gastos, maintenance, checklist, shopping-list
  backend/              # rutas/DB de esas apps
docker-compose.yml      # Solo la landing
```

> Room Automation ya vive en su propio repo:
> https://github.com/lrolomeli/room-automation

## Desarrollo

Solo necesitas un servidor estático:

```bash
npm run dev            # python3 -m http.server 5173 --directory frontend
```

Abre `http://localhost:5173`.

## Deploy (Docker)

```bash
docker compose up -d --build
```

Sirve la landing en `http://localhost:3000`.

## Room Automation

Proyecto independiente (backend + frontend + `docker-compose.yml`) extraído a su
propio repositorio: https://github.com/lrolomeli/room-automation
