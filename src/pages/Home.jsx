import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, DownloadSimple, EnvelopeSimple, GithubLogo, LinkedinLogo } from '../components/icons.jsx'
import { TERMS, activities, allTech, baseTech, byTerm, formatDate } from '../data/index.js'
import { profile, skillGroups, termNotes } from '../data/profile.js'
import { useFileExists, useMedia } from '../lib/hooks.js'
import Board from '../components/Board.jsx'
import BoardCard from '../components/BoardCard.jsx'
import Reveal from '../components/Reveal.jsx'

function usedIn(match) {
  return activities.filter((a) => a.stack.some((t) => match.includes(baseTech(t)))).length
}

function Hero() {
  const hasResume = useFileExists(profile.resume, 'pdf')
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <Reveal as="p" className="eyebrow">
            {profile.course} · {profile.courseTitle}
          </Reveal>
          <Reveal as="h1" i={1} className="serif display">
            {profile.name.split(' ').slice(0, -1).join(' ')} <em>{profile.name.split(' ').slice(-1)}</em>.
          </Reveal>
          <Reveal as="p" i={2} className="lede">
            {profile.intro}
          </Reveal>
          <Reveal i={3} className="hero-actions">
            {hasResume && (
              <a className="btn btn-primary" href={profile.resume} download>
                Download résumé <DownloadSimple size={16} weight="bold" />
              </a>
            )}
            <Link className={`btn ${hasResume ? 'btn-ghost' : 'btn-primary'}`} to="/work">
              View all work <ArrowRight size={16} weight="bold" />
            </Link>
          </Reveal>
        </div>
        <Reveal i={4} className="card">
          <dl className="facts">
            <div><dt>School</dt><dd>{profile.school}</dd></div>
            <div><dt>Term</dt><dd>{profile.term}</dd></div>
            {profile.instructor && <div><dt>Instructor</dt><dd>{profile.instructor}</dd></div>}
            <div><dt>Covers</dt><dd>PHP, Laravel, React, Express, MongoDB</dd></div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

function BoardSection() {
  const phone = useMedia('(max-width: 767px)')
  return (
    <section className="board-section" aria-labelledby="board-title">
      {phone ? (
        <div className="wrap">
          <h2 id="board-title" className="eyebrow">The board</h2>
          {TERMS.map((t) => (
            <div key={t.id} className="rail-term">
              <div className="rail-term-head">
                <span className={`pill ${t.tone}`}>{t.label}</span>
                <span className="mono muted">{t.range}</span>
              </div>
              <div className="rail">
                {byTerm(t.id).map((a) => <BoardCard key={a.slug} a={a} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="board-wrap">
          <div className="board-head">
            <h2 id="board-title" className="eyebrow" style={{ margin: 0 }}>The board · {activities.length} activities</h2>
            <span className="mono muted">Click a card to open its case study</span>
          </div>
          <Board />
        </div>
      )}
    </section>
  )
}

function Stats() {
  const exams = activities.filter((a) => /exam/i.test(a.kind)).length
  const shots = activities.reduce((n, a) => n + (a.screenshots?.length || 0), 0)
  const items = [
    [activities.length, 'Activities'],
    [exams, 'Practical exams'],
    [allTech().length, 'Technologies'],
    [shots, 'Screenshots'],
  ]
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="wrap">
        <Reveal className="stats">
          {items.map(([n, l]) => (
            <div className="stat" key={l}>
              <b>{n}</b>
              <span>{l}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="shead">
          <Reveal>
            <p className="eyebrow">Skills & tools</p>
            <h2 className="serif h2">What I can now build with.</h2>
          </Reveal>
          <Reveal as="p" i={1} className="muted">
            Each count is the number of activities in this course where I used it, so the list stays honest.
          </Reveal>
        </div>
        <div className="bento">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} i={gi} className="card">
              <span className={`pill ${g.tone}`}>{g.title}</span>
              <ul className="skill-list">
                {g.items.map((s) => {
                  const n = usedIn(s.match)
                  return (
                    <li key={s.name}>
                      <div>
                        <strong>{s.name}</strong>
                        <small>{s.note}</small>
                      </div>
                      {n > 0 && <span className="skill-count">{n}×</span>}
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  return (
    <section className="section" id="timeline">
      <div className="wrap">
        <div className="shead">
          <Reveal>
            <p className="eyebrow">Learning timeline</p>
            <h2 className="serif h2">One semester, three terms.</h2>
          </Reveal>
          <Reveal as="p" i={1} className="muted">
            The course moved from the browser to the server and back again. Here is the order I built things in.
          </Reveal>
        </div>
        {TERMS.map((t) => (
          <Reveal key={t.id} className="tl-term">
            <div>
              <span className={`pill ${t.tone}`}>{t.label}</span>
              <h3 className="serif">{t.label}</h3>
              <p className="mono muted">{t.range}</p>
            </div>
            <div>
              <p>{termNotes[t.id]}</p>
              <ul className="tl-list">
                {byTerm(t.id).map((a) => (
                  <li key={a.slug}>
                    <Link to={`/work/${a.slug}`}>
                      <span className="mono muted">{formatDate(a.date, { month: 'short', day: 'numeric' })}</span>
                      <span className="tl-title">{a.title}</span>
                      <span className="mono muted tl-kind">{a.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function About() {
  const [photoOk, setPhotoOk] = useState(true)
  const initials = profile.name.split(' ').map((w) => w[0]).join('')
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <Reveal className="portrait">
          {photoOk ? (
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} onError={() => setPhotoOk(false)} />
          ) : (
            <span className="mono-initials" aria-hidden="true">{initials}</span>
          )}
        </Reveal>
        <div>
          <Reveal as="p" className="eyebrow">About</Reveal>
          <Reveal as="h2" i={1} className="serif h2" style={{ marginBottom: 28 }}>
            Learning by building, then writing it down.
          </Reveal>
          {profile.about.map((p, i) => (
            <Reveal as="p" key={i} i={i + 2}>{p}</Reveal>
          ))}
          {profile.certificates.length > 0 && (
            <Reveal i={4}>
              <p className="eyebrow" style={{ marginTop: 40, marginBottom: 0 }}>Certificates</p>
              <ul className="certs">
                {profile.certificates.map((c) => {
                  const inner = (
                    <>
                      <span><strong style={{ color: 'var(--strong)', fontWeight: 500 }}>{c.title}</strong> <span className="muted">· {c.issuer}</span></span>
                      <span className="mono muted">{c.date}{c.href && <ArrowUpRight size={12} weight="bold" style={{ marginLeft: 6 }} />}</span>
                    </>
                  )
                  return <li key={c.title}>{c.href ? <a href={c.href} target="_blank" rel="noreferrer">{inner}</a> : <div>{inner}</div>}</li>
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { email, github, linkedin } = profile.contact
  const links = [
    email && { href: `mailto:${email}`, label: 'Email', Icon: EnvelopeSimple },
    github && { href: github, label: 'GitHub', Icon: GithubLogo },
    linkedin && { href: linkedin, label: 'LinkedIn', Icon: LinkedinLogo },
  ].filter(Boolean)
  return (
    <section className="section contact" id="contact">
      <div className="wrap narrow">
        <Reveal as="p" className="eyebrow">Say hello</Reveal>
        <Reveal as="h2" i={1} className="serif h2">Questions about any of this work?</Reveal>
        <Reveal as="p" i={2} className="lede" style={{ marginTop: 20 }}>
          I am happy to walk through the code behind any activity here, or talk about internships and projects.
        </Reveal>
        <Reveal i={3} className="contact-links">
          {links.length ? (
            links.map(({ href, label, Icon }, i) => (
              <a key={label} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <Icon size={16} weight="bold" /> {label}
              </a>
            ))
          ) : (
            <Link className="btn btn-primary" to="/work">Browse the work <ArrowRight size={16} weight="bold" /></Link>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <Hero />
      <BoardSection />
      <Stats />
      <Skills />
      <Timeline />
      <About />
      <Contact />
    </>
  )
}
