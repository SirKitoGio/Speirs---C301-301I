import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileDoc, FilePdf, FileText } from '../components/icons.jsx'
import { activities, findActivity, formatDate, termOf } from '../data/index.js'
import { profile } from '../data/profile.js'
import CodeBlock from '../components/CodeBlock.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Reveal from '../components/Reveal.jsx'
import TermPill from '../components/TermPill.jsx'
import NotFound from './NotFound.jsx'

const docIcon = (href) => (/\.pdf$/i.test(href) ? FilePdf : /\.docx?$/i.test(href) ? FileDoc : FileText)

export default function Activity() {
  const { slug } = useParams()
  const a = findActivity(slug)
  const [box, setBox] = useState(null)

  useEffect(() => {
    document.title = a ? `${a.title} — ${profile.name}` : `Not found — ${profile.name}`
    return () => { document.title = `${profile.name} — ITC C301 Portfolio` }
  }, [a])

  if (!a) return <NotFound />

  const idx = activities.indexOf(a)
  const prev = activities[idx - 1]
  const next = activities[idx + 1]
  const shots = a.screenshots || []
  const [hero, ...rest] = shots

  return (
    <article>
      <div className="ambient" aria-hidden="true" />
      <header className="wrap cs-head">
        <Link to="/work" className="back"><ArrowLeft size={14} weight="bold" /> All work</Link>
        <Reveal className="cs-meta">
          <TermPill term={a.term} />
          <span className="pill">{a.kind}</span>
          <span className="mono muted">{formatDate(a.date)}</span>
        </Reveal>
        <Reveal as="h1" i={1} className="serif cs-title">{a.title}</Reveal>
        <Reveal as="p" i={2} className="lede">{a.summary}</Reveal>
      </header>

      {hero && (
        <Reveal className="wrap" style={{ marginBottom: 80 }}>
          <div className="window">
            <div className="window-bar"><i /><i /><i /><span>{hero.caption}</span></div>
            <img src={hero.src} alt={hero.caption} onClick={() => setBox(0)} />
          </div>
        </Reveal>
      )}

      <div className="wrap cs-grid">
        <aside className="cs-side">
          <dl>
            <div><dt>Course</dt><dd>{profile.course}</dd></div>
            <div><dt>Term</dt><dd>{termOf(a.term).label}</dd></div>
            <div><dt>Date</dt><dd>{formatDate(a.date)}</dd></div>
            <div><dt>Type</dt><dd>{a.kind}</dd></div>
            {a.team && <div><dt>Team</dt><dd>{a.team}</dd></div>}
            <div>
              <dt>Stack</dt>
              <dd className="tags" style={{ marginTop: 6 }}>{a.stack.map((t) => <span key={t} className="tag">{t}</span>)}</dd>
            </div>
          </dl>
        </aside>

        <div className="cs-body">
          <Reveal as="section">
            <h2>Objective</h2>
            <p>{a.objective}</p>
          </Reveal>

          {a.built?.length > 0 && (
            <Reveal as="section">
              <h2>What I built</h2>
              <ul className="built">{a.built.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </Reveal>
          )}

          {rest.length > 0 && (
            <Reveal as="section">
              <h2>Screens</h2>
              <div className="gallery">
                {rest.map((s, i) => (
                  <figure key={s.src}>
                    <button onClick={() => setBox(i + 1)} aria-label={`Enlarge: ${s.caption}`}>
                      <img src={s.src} alt={s.caption} loading="lazy" />
                    </button>
                    <figcaption>{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          )}

          {a.code?.length > 0 && (
            <Reveal as="section">
              <h2>Key code</h2>
              {a.code.map((c) => <CodeBlock key={c.title} {...c} />)}
            </Reveal>
          )}

          {a.reflection && (
            <Reveal as="section" className="reflection">
              <h2>Reflection</h2>
              {a.reflection.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>
          )}

          {a.docs?.length > 0 && (
            <Reveal as="section">
              <h2>Documentation</h2>
              <div className="docs">
                {a.docs.map((d) => {
                  const Icon = docIcon(d.href)
                  return (
                    <a key={d.href} className="btn btn-ghost" href={d.href} target="_blank" rel="noreferrer">
                      <Icon size={16} weight="bold" /> {d.label}
                    </a>
                  )
                })}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <nav className="wrap" style={{ padding: '24px var(--gutter) 112px' }} aria-label="Other activities">
        <div className="pager">
          {prev ? (
            <Link className="card" to={`/work/${prev.slug}`}>
              <small><ArrowLeft size={12} weight="bold" /> Previous</small>
              <strong>{prev.title}</strong>
            </Link>
          ) : <span />}
          {next ? (
            <Link className="card next" to={`/work/${next.slug}`}>
              <small>Next <ArrowRight size={12} weight="bold" /></small>
              <strong>{next.title}</strong>
            </Link>
          ) : <span />}
        </div>
      </nav>

      {box !== null && <Lightbox items={shots} index={box} onIndex={setBox} onClose={() => setBox(null)} />}
    </article>
  )
}
