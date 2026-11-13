import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowsOut, Minus, Plus } from './icons.jsx'
import { TERMS, byTerm, formatDate } from '../data/index.js'
import { profile } from '../data/profile.js'
import BoardCard from './BoardCard.jsx'

const CARD_W = 260
const CARD_H = 250
const GAP_X = 28
const GAP_Y = 44
const PAD = 40
const STAGGER = 36
const COLS = { prelim: 2, midterm: 4, finals: 1 }
const MIN_K = 0.25
const MAX_K = 2

function useLayout() {
  return useMemo(() => {
    const me = { x: 60, y: 100, w: 340 }
    let x = me.x + me.w + 90
    const zones = []
    const cards = []
    let maxBottom = 0
    TERMS.forEach((t) => {
      const items = byTerm(t.id)
      if (!items.length) return
      const cols = Math.min(COLS[t.id] ?? 3, items.length)
      const rows = Math.ceil(items.length / cols)
      const w = PAD * 2 + cols * CARD_W + (cols - 1) * GAP_X
      const h = PAD * 2 + rows * CARD_H + (rows - 1) * GAP_Y + (cols > 1 ? STAGGER : 0)
      const z = { term: t, x, y: 60, w, h, first: items[0], last: items[items.length - 1] }
      zones.push(z)
      items.forEach((a, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        cards.push({ a, x: x + PAD + c * (CARD_W + GAP_X), y: z.y + PAD + r * (CARD_H + GAP_Y) + (c % 2) * STAGGER })
      })
      maxBottom = Math.max(maxBottom, z.y + h)
      x += w + 80
    })
    return { me, zones, cards, W: x - 20, H: maxBottom + 60 }
  }, [])
}

export default function Board() {
  const { me, zones, cards, W, H } = useLayout()
  const vp = useRef(null)
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const viewRef = useRef(view)
  viewRef.current = view
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const moved = useRef(false)
  const [dragging, setDragging] = useState(false)
  const touched = useRef(false)

  const fit = useCallback(() => {
    const el = vp.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const k = Math.min(Math.max(Math.min(width / W, height / H) * 0.96, MIN_K), 1.1)
    setView({ k, x: (width - W * k) / 2, y: (height - H * k) / 2 })
  }, [W, H])

  // First view: readable zoom, anchored left so the intro and prelim are visible and the rest invites a drag.
  const start = useCallback(() => {
    const el = vp.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const fitK = Math.min(width / W, height / H) * 0.96
    const k = Math.max(fitK, Math.min(0.85, (height / H) * 0.98))
    setView({ k, x: W * k <= width ? (width - W * k) / 2 : 0, y: (height - H * k) / 2 })
  }, [W, H])

  useLayoutEffect(() => {
    start()
    const ro = new ResizeObserver(() => !touched.current && start())
    ro.observe(vp.current)
    return () => ro.disconnect()
  }, [start])

  const zoomAt = useCallback((px, py, nextK) => {
    const v = viewRef.current
    const k = Math.min(Math.max(nextK, MIN_K), MAX_K)
    touched.current = true
    setView({ k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) })
  }, [])

  const zoomCenter = (factor) => {
    const { width, height } = vp.current.getBoundingClientRect()
    zoomAt(width / 2, height / 2, viewRef.current.k * factor)
  }

  // Ctrl/Cmd + wheel (and trackpad pinch, which arrives as ctrl+wheel) zooms; plain wheel scrolls the page.
  useEffect(() => {
    const el = vp.current
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(e.clientX - r.left, e.clientY - r.top, viewRef.current.k * Math.exp(-e.deltaY * 0.01))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const local = (e) => {
    const r = vp.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    pointers.current.set(e.pointerId, local(e))
    const pts = [...pointers.current.values()]
    if (pts.length === 1) {
      moved.current = false
      gesture.current = { type: 'pan', start: pts[0], view: viewRef.current }
    } else if (pts.length === 2) {
      const [a, b] = pts
      gesture.current = { type: 'pinch', dist: Math.hypot(a.x - b.x, a.y - b.y), view: viewRef.current }
    }
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, local(e))
    const g = gesture.current
    if (!g) return
    const pts = [...pointers.current.values()]
    if (g.type === 'pinch' && pts.length >= 2) {
      const [a, b] = pts
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const k = Math.min(Math.max(g.view.k * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist), MIN_K), MAX_K)
      moved.current = true
      touched.current = true
      setView({ k, x: mid.x - (mid.x - g.view.x) * (k / g.view.k), y: mid.y - (mid.y - g.view.y) * (k / g.view.k) })
      return
    }
    if (g.type === 'pan') {
      const p = pts[0]
      const dx = p.x - g.start.x
      const dy = p.y - g.start.y
      if (!moved.current && Math.hypot(dx, dy) > 4) {
        moved.current = true
        touched.current = true
        setDragging(true)
        // Capture only once a drag starts, so plain clicks still reach the card links.
        vp.current.setPointerCapture?.(e.pointerId)
      }
      if (moved.current) setView({ ...g.view, x: g.view.x + dx, y: g.view.y + dy })
    }
  }

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      gesture.current = null
      setDragging(false)
    } else if (pointers.current.size === 1) {
      const p = [...pointers.current.values()][0]
      gesture.current = { type: 'pan', start: p, view: viewRef.current }
    }
  }

  const onClickCapture = (e) => {
    if (moved.current) {
      e.preventDefault()
      e.stopPropagation()
      moved.current = false
    }
  }

  const onKeyDown = (e) => {
    const step = 80
    const v = viewRef.current
    const map = {
      ArrowLeft: () => setView({ ...v, x: v.x + step }),
      ArrowRight: () => setView({ ...v, x: v.x - step }),
      ArrowUp: () => setView({ ...v, y: v.y + step }),
      ArrowDown: () => setView({ ...v, y: v.y - step }),
      '+': () => zoomCenter(1.2),
      '=': () => zoomCenter(1.2),
      '-': () => zoomCenter(1 / 1.2),
      '0': () => fit(),
    }
    if (map[e.key]) {
      e.preventDefault()
      touched.current = true
      map[e.key]()
    }
  }

  // Keep a keyboard-focused card in view.
  const onFocus = (e) => {
    const card = e.target.closest?.('.bcard')
    if (!card) return
    const r = card.getBoundingClientRect()
    const box = vp.current.getBoundingClientRect()
    const v = viewRef.current
    let { x, y } = v
    if (r.left < box.left + 16) x += box.left + 16 - r.left
    if (r.right > box.right - 16) x -= r.right - (box.right - 16)
    if (r.top < box.top + 16) y += box.top + 16 - r.top
    if (r.bottom > box.bottom - 56) y -= r.bottom - (box.bottom - 56)
    if (x !== v.x || y !== v.y) setView({ ...v, x, y })
  }

  return (
    <div
      ref={vp}
      className={`board${dragging ? ' dragging' : ''}`}
      tabIndex={0}
      role="region"
      aria-label="Project board. Drag to pan, hold Control or Command and scroll to zoom. Arrow keys pan, plus and minus zoom, 0 fits everything."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      style={{ backgroundSize: `${22 * view.k}px ${22 * view.k}px`, backgroundPosition: `${view.x}px ${view.y}px` }}
    >
      <div className="board-world" style={{ width: W, height: H, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
        <div className="board-me" style={{ left: me.x, top: me.y }}>
          <p className="eyebrow">{profile.course}</p>
          <h3>{profile.name}</h3>
          <p className="muted" style={{ fontSize: 15 }}>
            {profile.courseTitle}. Every activity, lab and exam from prelim to finals, grouped by term.
          </p>
          <p className="mono muted" style={{ marginTop: 18 }}>Drag, zoom, click a card.</p>
        </div>

        {zones.map((z) => (
          <div key={z.term.id} className="zone" style={{ left: z.x, top: z.y, width: z.w, height: z.h }}>
            <div className="zone-label">
              <span className={`pill ${z.term.tone}`}>{z.term.label}</span>
              <span className="mono">
                {formatDate(z.first.date, { month: 'short', day: 'numeric' })}
                {z.first !== z.last && ` – ${formatDate(z.last.date, { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          </div>
        ))}

        {cards.map(({ a, x, y }) => (
          <BoardCard key={a.slug} a={a} style={{ left: x, top: y }} />
        ))}
      </div>

      <div className="board-hint">
        Drag to pan · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + scroll to zoom
      </div>
      <div className="board-ui" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => zoomCenter(1 / 1.2)} aria-label="Zoom out"><Minus size={14} weight="bold" /></button>
        <span className="zoom" aria-live="polite">{Math.round(view.k * 100)}%</span>
        <button onClick={() => zoomCenter(1.2)} aria-label="Zoom in"><Plus size={14} weight="bold" /></button>
        <button onClick={() => { touched.current = false; fit() }} aria-label="Fit all cards"><ArrowsOut size={14} weight="bold" /></button>
      </div>
    </div>
  )
}
