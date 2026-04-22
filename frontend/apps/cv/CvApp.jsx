import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Experience from './components/Experience.jsx'
import Education from './components/Education.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Certifications from './components/Certifications.jsx'
import About from './components/About.jsx'

export default function CvApp() {
  return (
    <>
      <Navbar />
      <Hero />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Certifications />
      <About />
      <footer>© 2026 Luis Roberto Lomeli Plascencia</footer>
    </>
  )
}
