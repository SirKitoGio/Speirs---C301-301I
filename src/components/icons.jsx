// Small bold-stroke icon set (24px grid, 2px stroke) so the site has no icon dependency.
function make(paths, { fill = false } = {}) {
  return function Icon({ size = 16, weight, style, className, ...rest }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight === 'bold' ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        style={{ flex: 'none', ...style }}
        className={className}
        {...rest}
      >
        {paths.map((d, i) =>
          typeof d === 'string' ? <path key={i} d={d} /> : { ...d, key: i }
        )}
      </svg>
    )
  }
}

export const ArrowRight = make(['M5 12h14', 'M13 6l6 6-6 6'])
export const ArrowLeft = make(['M19 12H5', 'M11 6l-6 6 6 6'])
export const ArrowUpRight = make(['M7 17L17 7', 'M8 7h9v9'])
export const CaretLeft = make(['M15 6l-6 6 6 6'])
export const CaretRight = make(['M9 6l6 6-6 6'])
export const X = make(['M6 6l12 12', 'M18 6L6 18'])
export const Plus = make(['M12 5v14', 'M5 12h14'])
export const Minus = make(['M5 12h14'])
export const ArrowsOut = make(['M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7'])
export const DownloadSimple = make(['M12 4v11', 'M7 10l5 5 5-5', 'M4 20h16'])
export const EnvelopeSimple = make(['M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M3 7l9 6 9-6'])
export const GithubLogo = make([
  'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
])
export const LinkedinLogo = make(['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8 10v7', 'M8 7v.01', 'M12 17v-4a2 2 0 0 1 4 0v4', 'M12 10v7'])
const FILE = ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5']
export const FileText = make([...FILE, 'M9 13h6', 'M9 17h6'])
export const FilePdf = make([...FILE, 'M9 15h6'])
export const FileDoc = make([...FILE, 'M9 13h6', 'M9 17h4'])
export const Sun = make(['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'])
export const Moon = make(['M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z'])
