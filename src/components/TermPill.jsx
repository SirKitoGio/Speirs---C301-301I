import { termOf } from '../data/index.js'

export default function TermPill({ term }) {
  const t = termOf(term)
  return <span className={`pill ${t.tone}`}>{t.label}</span>
}
