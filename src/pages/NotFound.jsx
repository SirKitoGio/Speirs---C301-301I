import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/icons.jsx'

export default function NotFound() {
  return (
    <section className="wrap narrow" style={{ padding: '140px var(--gutter) 160px' }}>
      <p className="eyebrow">404</p>
      <h1 className="serif display" style={{ fontSize: 'clamp(44px, 7vw, 80px)', marginBottom: 24 }}>That page is not here.</h1>
      <p className="lede muted" style={{ marginBottom: 32 }}>The link may be old, or the activity was renamed.</p>
      <Link className="btn btn-primary" to="/"><ArrowLeft size={16} weight="bold" /> Back home</Link>
    </section>
  )
}
