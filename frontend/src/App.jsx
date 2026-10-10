import { ArrowUpRight } from 'lucide-react'
import { SERVICES } from './services.js'
import { getIcon } from './icons.js'

function ServiceCard({ service, duplicate = false }) {
  const Icon = getIcon(service.icon)
  return (
    <a
      className="service-card"
      href={service.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ '--accent': service.accent }}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <span className="service-icon" aria-hidden="true">
        {Icon ? <Icon size={22} strokeWidth={1.75} /> : null}
      </span>
      <span className="service-body">
        <span className="service-title">{service.title}</span>
        <span className="service-desc">{service.description}</span>
      </span>
      <ArrowUpRight className="service-arrow" size={20} strokeWidth={2} aria-hidden="true" />
    </a>
  )
}

export default function App() {
  return (
    <div className="landing">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <main className="landing-inner">
        <header className="landing-header">
          <span className="landing-eyebrow">luisrlp.com</span>
          <h1>Luis RLP</h1>
          <p>Servicios y proyectos</p>
        </header>

        <div className="marquee" role="region" aria-label="Servicios">
          <div className="marquee-track">
            <div className="marquee-group">
              {SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {SERVICES.map((service) => (
                <ServiceCard key={`${service.id}-dup`} service={service} duplicate />
              ))}
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          © {new Date().getFullYear()} Luis RLP
        </footer>
      </main>
    </div>
  )
}
