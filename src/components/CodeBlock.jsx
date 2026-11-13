import { useMemo } from 'react'
import { highlight } from '../lib/highlight.js'

export default function CodeBlock({ title, file, lang = 'markup', code }) {
  const html = useMemo(() => highlight(code.replace(/\s+$/, ''), lang), [code, lang])
  return (
    <figure className="code" style={{ margin: '0 0 16px' }}>
      <figcaption className="code-head">
        <strong>{title}</strong>
        {file && <span className="mono">{file}</span>}
      </figcaption>
      <pre className={`language-${lang}`}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}
