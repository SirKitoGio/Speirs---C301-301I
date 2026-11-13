import { profile } from '../data/profile.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>
          {profile.name} · {profile.course} {profile.courseTitle}
        </span>
        <span className="mono">
          {profile.school} · {profile.term}
        </span>
      </div>
    </footer>
  )
}
