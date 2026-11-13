export default {
  slug: 'react-pages-demo',
  order: 1,
  title: 'React Multi-Page Routing Demo',
  short: 'React Pages Demo',
  term: 'prelim',
  date: '2026-07-31',
  kind: 'Activity',
  team: null,
  stack: ['React 19.2', 'React Router 8.3', 'Vite 8.2', 'Oxlint'],
  summary:
    'A small React app built with Vite that uses React Router to switch between Home, About and Contact pages without reloading, with a fallback message for unknown URLs.',
  objective:
    'Set up a React project with Vite and add client-side routing. The goal was to learn how a single-page app can still have separate pages: wrapping the app in a router, mapping URL paths to page components, building a navigation bar that highlights the current page, and handling paths that do not match any route.',
  built: [
    'Vite + React project (react-pages-demo) with dev, build, preview and oxlint scripts',
    'main.jsx renders <App /> inside React.StrictMode and BrowserRouter from react-router',
    'Three page components in src/pages: Home.jsx, About.jsx and Contact.jsx, each returning a heading and a short paragraph',
    'App.jsx defines the routes "/", "/about" and "/contact" with Routes and Route',
    'Header navigation built with NavLink, so the link for the current page gets the "active" class',
    'A catch-all path="*" route that shows "Page not found." for any other URL',
    'index.css with a centered 760px layout, a bordered header and a bold style for a.active',
  ],
  screenshots: [
    { src: '/work/react-pages-demo/01-home.webp', caption: 'Home page at "/", with Home bold in the navigation' },
    { src: '/work/react-pages-demo/02-about.webp', caption: 'About page at "/about"; NavLink marks About as active' },
    { src: '/work/react-pages-demo/03-contact.webp', caption: 'Contact page at "/contact"' },
    { src: '/work/react-pages-demo/04-not-found.webp', caption: 'An unknown URL falls through to the path="*" route' },
  ],
  code: [
    {
      title: 'Route table and NavLink navigation',
      file: 'src/App.jsx',
      lang: 'jsx',
      code: `import { NavLink, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>React Pages Demo</h1>
        <nav aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </div>
  )
}`,
    },
    {
      title: 'Wrapping the app in BrowserRouter',
      file: 'src/main.jsx',
      lang: 'jsx',
      code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,`,
    },
  ],
  reflection:
    'This activity introduced me to client-side routing. I learned that the router does not load new HTML files: BrowserRouter watches the URL, Routes picks the matching Route, and only the page component changes. NavLink was a useful detail, because it adds the "active" class on its own, so one CSS rule (a.active) is enough to show which page the user is on. The path="*" route showed me that a single-page app has to handle its own 404 instead of relying on the server.\n\nOne thing to watch was the package name. This version of React Router ships as the react-router package, so the imports come from \'react-router\' and not \'react-router-dom\' as in many older tutorials. If I did it again I would remove the leftover template files (App.css, hero.png and the logo SVGs are never imported), give the 404 its own page component with a link back home, and add a rewrite rule before deploying, since a direct visit to /about only works when the server returns index.html for every path.',
  docs: [],
}
