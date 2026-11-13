import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../components/icons.jsx'
import { TERMS, activities, baseTech, formatDate } from '../data/index.js'
import Reveal from '../components/Reveal.jsx'
import TermPill from '../components/TermPill.jsx'

const TECH_FILTERS = ['PHP', 'Laravel', 'React', 'Express', 'MongoDB']

export default function Work() {
  const [term, setTerm] = useState('all')
  const [tech, setTech] = useState(null)

  const list = useMemo(
    () =>
      activities.filter(
        (a) => (term === 'all' || a.term === term) && (!tech || a.stack.some((t) => baseTech(t) === tech))
      ),
    [term, tech]
  )

  // First card of each term spans two columns when showing everything, for an asymmetric bento rhythm.
  const wide = new Set(term === 'all' && !tech ? TERMS.map((t) => activities.find((a) => a.term === t.id)?.slug) : [])

  return (
    <div className="ambient-host">
      <div className="ambient" aria-hidden="true" />
      <section className="wrap" style={{ padding: '80px var(--gutter) 112px' }}>
        <Reveal as="p" className="eyebrow">Work · {activities.length} activities</Reveal>
        <Reveal as="h1" i={1} className="serif display" style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}>
          Everything I built for ITC C301.
        </Reveal>

        <div className="filters" role="group" aria-label="Filter activities">
          <button className="chip" aria-pressed={term === 'all'} onClick={() => setTerm('all')}>All terms</button>
          {TERMS.map((t) => (
            <button key={t.id} className="chip" aria-pressed={term === t.id} onClick={() => setTerm(t.id)}>{t.label}</button>
          ))}
          <span style={{ width: 12 }} />
          {TECH_FILTERS.map((t) => (
            <button key={t} className="chip" aria-pressed={tech === t} onClick={() => setTech(tech === t ? null : t)}>{t}</button>
          ))}
        </div>

        <div className="wgrid">
          {list.map((a, i) => (
            <Reveal key={a.slug} i={i % 6} className={`card wcard${wide.has(a.slug) ? ' wide' : ''}`} as={Link} to={`/work/${a.slug}`}>
              <div className="thumb">
                {a.screenshots?.[0] && <img src={a.screenshots[0].src} alt="" loading="lazy" />}
              </div>
              <div className="body">
                <div className="row">
                  <TermPill term={a.term} />
                  <span className="mono muted">{formatDate(a.date)}</span>
                </div>
                <h3 className="serif">{a.title}</h3>
                <p>{a.summary}</p>
                <div className="row" style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <div className="tags">
                    {a.stack.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <ArrowUpRight size={18} weight="bold" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {!list.length && <p className="muted">Nothing matches that filter.</p>}
      </section>
    </div>
  )
}
