import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun } from './icons.jsx'
import { profile } from '../data/profile.js'

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function Nav() {
  const [theme, setTheme] = useState(currentTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch (e) { /* storage unavailable */ }
  }, [theme])

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand">
          {profile.shortName}
          <span>{profile.course}</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/work">Work</NavLink>
          <Link to="/#about">About</Link>
          <Link to="/#contact" className="nav-contact">Contact</Link>
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
          </button>
        </nav>
      </div>
    </header>
  )
}
