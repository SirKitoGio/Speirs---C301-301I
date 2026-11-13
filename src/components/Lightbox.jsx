import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CaretLeft, CaretRight, X } from './icons.jsx'

export default function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index]
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [index, items.length, onClose, onIndex])

  if (!item) return null
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lightbox-stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={item.src} alt={item.caption} />
      </div>
      <div className="lightbox-bar">
        <span>
          <span className="mono" style={{ opacity: 0.6, marginRight: 10 }}>
            {index + 1} / {items.length}
          </span>
          {item.caption}
        </span>
        <div className="ctrl">
          <button onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous image"><CaretLeft size={16} weight="bold" /></button>
          <button onClick={() => onIndex((index + 1) % items.length)} aria-label="Next image"><CaretRight size={16} weight="bold" /></button>
          <button onClick={onClose} aria-label="Close" autoFocus><X size={16} weight="bold" /></button>
        </div>
      </div>
    </div>,
    document.body
  )
}
