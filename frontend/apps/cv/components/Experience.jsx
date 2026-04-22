import { experience } from '../data.js'

export default function Experience() {
  return (
    <section id="experience">
      <div className="section-title">Experience</div>
      {experience.map((job) => (
        <div className="job" key={job.company}>
          <div className="job-meta">
            {job.logo && <img src={job.logo} alt={job.company} />}
            <div className="dates">{job.dates}</div>
          </div>
          <div className="job-content">
            <h3>{job.company}</h3>
            <div className="role">{job.role}</div>
            <ul>
              {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  )
}
