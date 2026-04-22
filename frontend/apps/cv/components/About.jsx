import { about } from '../data.js'

export default function About() {
  return (
    <section id="about">
      <div className="section-title">About Me</div>
      <div className="skills-grid">
        {about.map((group) => (
          <div className="skill-group" key={group.title}>
            <h3>{group.icon} {group.title}</h3>
            <div className="skill-tags">
              {group.tags.map((tag) => (
                <span className="skill-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
