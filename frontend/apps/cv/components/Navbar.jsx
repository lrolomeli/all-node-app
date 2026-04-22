import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#experience',     label: 'Experience' },
  { href: '#education',      label: 'Education' },
  { href: '#skills',         label: 'Skills' },
  { href: '#projects',       label: 'Projects' },
  { href: '#about',          label: 'About' },
]

export default function Navbar() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')

    function onScroll() {
      let current = ''
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id
      })
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(e, href) {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="nav-home">← Home</a>
        <span className="nav-brand">Luis Lomeli</span>
        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href.slice(1) ? 'active' : ''}
                onClick={(e) => scrollTo(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
