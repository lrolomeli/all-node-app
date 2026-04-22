import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

const cleanUrls = () => ({
  name: 'clean-urls',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Redirección física para asegurar que el navegador cargue los assets correctamente
      if (req.url === '/apps/diet' || req.url === '/apps/schedule' || req.url === '/apps/checklist' || req.url === '/apps/budget' || req.url === '/apps/cv' || req.url === '/apps/calisthenics' || req.url === '/apps/maintenance') {
        res.statusCode = 301;
        res.setHeader('Location', `${req.url}/`);
        res.end();
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  appType: 'mpa',
  base: '/', // Asegura que los assets se busquen desde la raíz
  plugins: [react(), cleanUrls()],
  build: {
    // Usamos resolve para evitar rutas absolutas de sistema
    outDir: resolve(__dirname, 'dist'), 
    emptyOutDir: true, // Limpia la carpeta dist antes de cada build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        calisthenics: resolve(__dirname, 'apps/calisthenics/index.html'),
        cv: resolve(__dirname, 'apps/cv/index.html'),
        maintenance: resolve(__dirname, 'apps/maintenance/index.html'),
        budget: resolve(__dirname, 'apps/budget/index.html'),
        checklist: resolve(__dirname, 'apps/checklist/index.html'),
        schedule: resolve(__dirname, 'apps/schedule/index.html'),
        diet: resolve(__dirname, 'apps/diet/index.html'),
      },
    },
  },
  server: {
    host: true, // Importante para Docker
    port: 5173,
    watch: {
      usePolling: true, // Forza a revisar cambios en el disco
    },
    proxy: {
      '/api': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/auth.js': 'http://localhost:3000',
    },
  },
})