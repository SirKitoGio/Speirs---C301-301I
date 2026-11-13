import { useEffect, useState } from 'react'

export function useMedia(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [match, setMatch] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

// True once we know a static file really exists (dev server falls back to index.html, so check the type).
export function useFileExists(url, type) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!url) return
    let alive = true
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && (r.headers.get('content-type') || '').includes(type)))
      .catch(() => {})
    return () => { alive = false }
  }, [url, type])
  return ok
}
