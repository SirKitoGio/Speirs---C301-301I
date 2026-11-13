export default {
  slug: 'artifacts-gallery',
  order: 2,
  title: 'Speirs Artifacts Gallery: React Authentication and Protected Routes',
  short: 'Artifacts Gallery',
  term: 'prelim',
  date: '2026-08-14',
  kind: 'Practical Exam',
  team: 'Pair work with Mondares',
  stack: ['React 19.2', 'React Router DOM 7.18', 'Express 5.2', 'MongoDB driver 6.21', 'Vite 7.3', 'The Met Collection API'],
  summary:
    'A React and Express app where visitors sign up and log in, then browse a protected, searchable gallery of Filipino and Philippine artworks from The Metropolitan Museum of Art collection API.',
  objective:
    'The Prelim Practical Exam asked for a React project with react-router-dom and axios, Signup and Login pages with field validation, error and loading states, public and protected routes with a 404 page, a responsive gallery with search, filtering and detail pages, and an AuthContext that exposes the auth state and functions to the whole app. The submission needed screenshots of Signup, Login, the Gallery and a protected-route access attempt.',
  built: [
    'Seven routes: public /, /login and /signup; protected /gallery, /artifacts/:id and /profile; and a public * not-found page',
    'AuthContext with user, isAuthenticated, loading, login, signup and logout; on startup it checks GET /api/auth/session before protected pages render',
    'ProtectedRoute that waits for the session check, then redirects signed-out visitors to /login and keeps the requested location so login returns them there',
    'Express 5 auth API (signup, login, session, logout) storing scrypt password hashes in MongoDB and a SHA-256 hash of the session token behind an HttpOnly hq_session cookie, with a 24-hour "remember me" option',
    'Signup validation on client and server: name, valid email, password of at least 8 characters, matching confirmation, a role of Artist, Collector or Curator, and accepted terms',
    'Gallery that pulls public-domain works from The Met API using the terms Philippine, Ifugao, Hispano-Philippine and Filipino, 18 at a time with "Load more works", title search and category filter, plus a local SVG set as a fallback when the API is down',
    '15 Node test-runner tests covering the auth helpers, navigation, home layout and the artwork API adapter',
  ],
  screenshots: [
    { src: '/work/artifacts-gallery/01-gallery.webp', caption: 'Signed-in Gallery with title search, category filter and artwork cards' },
    { src: '/work/artifacts-gallery/02-home.webp', caption: 'Public landing page with Log in and Create an account entry points' },
    { src: '/work/artifacts-gallery/03-login-error.webp', caption: 'Login form showing the server\'s "Invalid email or password." response' },
    { src: '/work/artifacts-gallery/04-signup-validation.webp', caption: 'Signup field-level validation for name, email, password, role and terms' },
    { src: '/work/artifacts-gallery/05-protected-redirect.webp', caption: 'A signed-out visit to /gallery is redirected to the Login page' },
    { src: '/work/artifacts-gallery/06-project-structure.webp', caption: 'Project structure: auth, common and page components, context, data and styles' },
  ],
  code: [
    {
      title: 'Session check in AuthProvider',
      file: 'src/context/AuthContext.jsx',
      lang: 'jsx',
      code: `export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    axios.get('/api/auth/session', { withCredentials: true })
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data.user)
          persistUser(data.user)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
          persistUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])`,
    },
    {
      title: 'Protected route guard',
      file: 'src/components/auth/ProtectedRoute.jsx',
      lang: 'jsx',
      code: `import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <main className="page-shell loading-page">
        <p className="eyebrow">Checking access</p>
        <p>One moment.</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}`,
    },
    {
      title: 'Login endpoint',
      file: 'server/index.js',
      lang: 'javascript',
      code: `app.post('/api/auth/login', async (req, res, next) => {
  const email = typeof req.body.email === 'string' ? normalizeEmail(req.body.email) : ''
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  const remember = req.body.remember === true

  if (!email || !isValidEmail(email)) {
    return sendError(res, 400, 'Enter a valid email address.', 'email')
  }

  if (!password) {
    return sendError(res, 400, 'Password is required.', 'password')
  }

  try {
    const { users } = getCollections()
    const user = await users.findOne({ email })

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return sendError(res, 401, 'Invalid email or password.')
    }

    await createSession(user._id, res, remember)
    return res.json({ ok: true, user: safeUser(user) })
  } catch (error) {
    return next(error)
  }
})`,
    },
  ],
  reflection:
    'The main lesson from this exam was deciding where the truth about a login lives. My partner Mondares and I kept the server session as the authority: the browser gets an HttpOnly cookie it cannot read, MongoDB stores only a hash of the token, and localStorage holds just a display snapshot of id, name, email and role. That split also showed me why the loading state matters. The user state starts from the localStorage snapshot, so ProtectedRoute has to wait for the /api/auth/session check; otherwise a stale snapshot could show a protected page to someone whose session has already expired.\n\nThe gallery\'s data source took the most rework. We started with a local set of artworks and then moved to The Met API, whose search endpoint returns only object IDs, so every artwork needs its own request, and many records have no image or are not public domain. I had to filter those out, remove duplicates across search terms and page with a cursor so "Load more works" never repeats a work. If I did it again I would move the older HQ records, diary and GridFS routes that are still in server/index.js into a separate module, since the gallery does not use them, and either build the "Forgot password?" flow or remove the link instead of leaving it non-functional.',
  docs: [{ label: 'Submission document (PDF)', href: '/work/artifacts-gallery/documentation.pdf' }],
}
