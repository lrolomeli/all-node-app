import { SERVICES } from './services.js'

export default function App() {
  return (
    <div className="landing">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <main className="landing-inner">
        <header className="landing-header">
          <span className="landing-eyebrow">luisrlp.com</span>
          <h1>Luis RLP</h1>
          <p>Servicios y proyectos</p>
        </header>

        <nav className="services" aria-label="Servicios">
          {SERVICES.map((service) => (
            <a
              key={service.id}
              className="service-card"
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--accent': service.accent }}
            >
              <span className="service-icon" aria-hidden="true">{service.icon}</span>
              <span className="service-body">
                <span className="service-title">{service.title}</span>
                <span className="service-desc">{service.description}</span>
              </span>
              <span className="service-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>

        <footer className="landing-footer">
          © {new Date().getFullYear()} Luis RLP
        </footer>
      </main>
    </div>
  )
}
