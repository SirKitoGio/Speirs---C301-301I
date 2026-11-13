const modules = import.meta.glob('./activities/*.js', { eager: true })

export const activities = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order)

export const TERMS = [
  { id: 'prelim', label: 'Prelim', range: 'Jul – Aug 2026', tone: 'blue' },
  { id: 'midterm', label: 'Midterm', range: 'Sep – early Oct 2026', tone: 'yellow' },
  { id: 'finals', label: 'Finals', range: 'Oct – Nov 2026', tone: 'green' },
]

export const termOf = (id) => TERMS.find((t) => t.id === id) ?? TERMS[0]

export const byTerm = (id) => activities.filter((a) => a.term === id)

export const findActivity = (slug) => activities.find((a) => a.slug === slug)

export function formatDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', opts)
}

// "Laravel 13" -> "Laravel", "PHP 8.5" -> "PHP"
export const baseTech = (tag) => tag.replace(/\s+v?\d[\w.]*$/i, '').trim()

export const allTech = () => {
  const set = new Set()
  activities.forEach((a) => a.stack.forEach((t) => set.add(baseTech(t))))
  return [...set]
}
