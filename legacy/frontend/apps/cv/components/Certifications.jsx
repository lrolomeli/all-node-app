import { certifications } from '../data.js'

export default function Certifications() {
  return (
    <section id="certifications">
      <div className="section-title">Certifications</div>
      {certifications.map((cert) => (
        <div className="skill-group cert-card" key={cert.title}>
          <h3>{cert.icon} {cert.title}</h3>
          <div className="skill-tags">
            {cert.tags.map((tag) => (
              <span className="skill-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
