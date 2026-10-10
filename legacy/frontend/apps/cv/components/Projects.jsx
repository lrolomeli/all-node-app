import { projects } from '../data.js'

export default function Projects() {
  return (
    <section id="projects">
      <div className="section-title">Projects</div>
      <div className="projects-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.title}>
            <h3>{p.title}</h3>
            <div className="tech">{p.tech}</div>
            <div className="dates">{p.dates}</div>
            <p>{p.description}</p>
            {p.links.map((l) => (
              <a key={l.href} className="btn-link" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
