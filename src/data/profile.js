// Edit this file to update personal details. Anything set to null is hidden on the site.
export const profile = {
  name: 'Keith Alan Speirs',
  shortName: 'K. A. Speirs',
  course: 'ITC C301-301I',
  courseTitle: 'Integrative Programming and Technologies 1',
  school: 'Jose Rizal University',
  term: 'First Semester, AY 2026–2027',
  instructor: 'Dr. Richard Monreal',

  intro:
    'I build web applications with PHP, Laravel and React. This portfolio collects every activity, laboratory and practical exam I completed for Integrative Programming and Technologies 1.',

  about: [
    'I am a BS Information Technology student at Jose Rizal University (2024 – expected 2028). ITC C301 was the course where the separate pieces I knew started to connect: an HTML form talking to PHP, PHP talking to a database, a React front end calling an Express API, and finally full Laravel applications with authentication, migrations and seeders.',
    'Most of what I learned came from getting things wrong first: a route that would not resolve, a CSRF token I forgot, a protected page that still rendered for logged-out users. Each case study here says what broke and how I fixed it.',
  ],

  // Drop files into /public/me/ — the site hides these automatically if a file is missing.
  photo: '/me/photo.jpg',
  resume: '/me/resume.pdf',

  // From the résumé. Optional fields: date: '2026-06', href: '/me/certs/file.pdf' (drop the file into /public/me/certs/).
  certificates: [
    { title: 'Claude Certified Architect – Professional', issuer: 'Anthropic' },
    { title: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services' },
    { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
    { title: 'Google AI Professional Certificate', issuer: 'Google' },
    { title: 'Associate Data Engineer', issuer: 'DataCamp' },
    { title: 'IT Specialist: Java & Databases', issuer: 'Certiport' },
    { title: 'IT Fundamentals+', issuer: 'CompTIA' },
  ],

  contact: {
    email: 'keithalan.speirs25@gmail.com',
    github: 'https://github.com/SirkitoGio',
    linkedin: 'https://www.linkedin.com/in/keith-speirs',
  },
}

// Skill groups. "match" lists stack tags (base names) that count as evidence for the skill.
export const skillGroups = [
  {
    title: 'Languages',
    tone: 'blue',
    items: [
      { name: 'PHP', note: 'Forms, superglobals, OOP, custom MVC', match: ['PHP'] },
      { name: 'JavaScript', note: 'ES modules, async/await, DOM, Node', match: ['JavaScript', 'Node.js', 'Node', 'React', 'Express'] },
      { name: 'SQL', note: 'Schemas, prepared statements, migrations', match: ['SQLite', 'MySQL', 'PDO', 'SQL'] },
      { name: 'HTML & CSS', note: 'Semantic forms, Blade, responsive layout', match: ['HTML', 'CSS', 'HTML5', 'CSS3', 'Blade', 'Tailwind', 'Tailwind CSS', 'Bootstrap'] },
    ],
  },
  {
    title: 'Frameworks',
    tone: 'yellow',
    items: [
      { name: 'Laravel', note: 'Routing, Eloquent, Blade, auth, seeders', match: ['Laravel'] },
      { name: 'React', note: 'Router, context, protected routes', match: ['React'] },
      { name: 'Express', note: 'REST endpoints, JWT, middleware', match: ['Express'] },
      { name: 'Tailwind & Bootstrap', note: 'Utility and component styling', match: ['Tailwind', 'Tailwind CSS', 'Bootstrap'] },
    ],
  },
  {
    title: 'Data',
    tone: 'green',
    items: [
      { name: 'SQLite & MySQL', note: 'Relational storage for PHP and Laravel', match: ['SQLite', 'MySQL'] },
      { name: 'MongoDB', note: 'Document storage with Mongoose', match: ['MongoDB', 'Mongoose'] },
      { name: 'Eloquent ORM', note: 'Models, relationships, factories', match: ['Eloquent', 'Laravel'] },
    ],
  },
  {
    title: 'Tooling',
    tone: 'red',
    items: [
      { name: 'Composer & Artisan', note: 'Project setup, migrate, tinker, serve', match: ['Composer', 'Artisan', 'Laravel'] },
      { name: 'npm & Vite', note: 'Dev servers and production builds', match: ['Vite', 'npm'] },
      { name: 'Testing', note: 'Node test runner, manual test plans', match: ['Node test runner', 'node:test', 'PHPUnit'] },
    ],
  },
]

export const termNotes = {
  prelim:
    'Front-end first. I learned client-side routing in React, then joined a React front end to an Express and MongoDB back end with real login, signup and protected routes. The finance tracker repeated the full MERN loop on my own.',
  midterm:
    'Server-side PHP from the ground up: form handling, variables and number logic, then a hand-built MVC framework before moving to Laravel for routing, CRUD and validation. The term ended with the PhytoQuest design document and a full Laravel app for the practical exam.',
  finals:
    'Setting up Laravel cleanly from scratch and documenting every step, as groundwork for the final project.',
}
