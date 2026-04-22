import { education } from '../data.js'

export default function Education() {
  return (
    <section id="education">
      <div className="section-title">Education</div>
      {education.map((edu) => (
        <div className="edu-item" key={edu.school}>
          <div className="job-meta">
            <img src={edu.logo} alt={edu.school} />
          </div>
          <div className="edu-content">
            <h3>{edu.school}</h3>
            <div className="degree">{edu.degree}</div>
            <div className="dates">{edu.dates}</div>
            <p>{edu.description}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
