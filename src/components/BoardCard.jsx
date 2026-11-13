import { Link } from 'react-router-dom'
import { formatDate } from '../data/index.js'

export default function BoardCard({ a, style, tabIndex }) {
  const thumb = a.screenshots?.[0]
  return (
    <Link to={`/work/${a.slug}`} className="bcard" style={style} tabIndex={tabIndex} draggable={false}>
      {thumb ? <img src={thumb.src} alt="" loading="lazy" draggable={false} /> : <div className="thumb-empty" />}
      <div className="meta">
        <span>{a.kind}</span>
        <span>{formatDate(a.date, { month: 'short', day: 'numeric' })}</span>
      </div>
      <h3>{a.short || a.title}</h3>
    </Link>
  )
}
