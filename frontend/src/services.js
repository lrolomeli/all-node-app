// Edita aquí los servicios que se muestran en la landing.
// `href` puede ser cualquier URL externa (https://...).
// `icon` es una clave definida en `icons.js`.
export const SERVICES = [
  {
    id: 'room-automation',
    title: 'Room Automation',
    description: 'Monitor de temperatura y humedad, control IR y automatización del aire acondicionado.',
    href: 'https://ra.luisrlp.com',
    icon: 'thermometer',
    accent: '#7c5cff',
  },
  {
    id: 'movies',
    title: 'Movies',
    description: 'Catálogo y streaming personal de películas.',
    href: 'https://movies.luisrlp.com',
    icon: 'film',
    accent: '#f5576c',
  },
  {
    id: 'fut',
    title: 'Fut',
    description: 'Resultados y seguimiento de fútbol.',
    href: 'https://fut.luisrlp.com',
    icon: 'trophy',
    accent: '#22c55e',
  },
  {
    id: 'maintenance',
    title: 'Mantenimientos',
    description: 'Documento en la nube con el historial de mantenimientos.',
    // TODO: reemplaza por la URL real del documento en la nube.
    href: 'https://docs.google.com/',
    icon: 'wrench',
    accent: '#f59e0b',
  },
  {
    id: 'cv',
    title: 'CV / Portafolio',
    description: 'Currículum y proyectos.',
    // TODO: reemplaza por la URL real del CV/portafolio.
    href: 'https://cv.luisrlp.com',
    icon: 'file-text',
    accent: '#3b9dff',
  },
]
