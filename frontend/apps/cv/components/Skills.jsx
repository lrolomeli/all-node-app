import { skills } from '../data.js'

export default function Skills() {
  return (
    <section id="skills">
      <div className="section-title">Skills</div>
      <div className="skills-grid">
        {skills.map((group) => (
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
