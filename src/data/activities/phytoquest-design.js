export default {
  slug: 'phytoquest-design',
  order: 11,
  title: 'PhytoQuest IEEE System Design',
  short: 'PhytoQuest Design',
  term: 'midterm',
  date: '2026-09-22',
  kind: 'Design Document',
  team: 'Group of 4: Dival (lead), Aguilar, Mondares, Speirs',
  stack: ['IEEE format', 'React', 'Laravel', 'Python ML', 'Event-driven design'],
  summary:
    'A group system design paper in IEEE format for PhytoQuest, a planned location-aware web app for medicinal plant research that combines plant search, GPS-confirmed sightings and image-based species identification.',
  objective:
    'Specify a proposed web system as an IEEE-style paper: problem statement, objective and scope, literature review, methodology, users and roles, functional and nonfunctional requirements, architecture, data flow, a test plan, pilot measures and SDG alignment. This updated version reframes the design around event-driven programming and adds the literature review, methodology and test plan sections.',
  built: [
    'Problem statement, objective and scope, with firm out-of-scope limits: no diagnosis, dosage or consumption advice, and no toxin measurement from a photo',
    'Four user roles (guest, registered user, expert reviewer, admin) and 14 functional requirements, FR-01 to FR-14, covering search and filters, image scanning, GPS-confirmed sightings, review and notifications',
    'Three-service architecture: a React client, a Laravel REST API and a Python image-classification service, over a relational database, object storage for images and an audit log',
    'Key data entities (Plant, Profile evidence, Sighting, User and role, Model inference) and two data flows, search-and-map and sighting submission, ending in pending, needs correction, trusted, rejected or sensitive-restricted',
    'A location protection rule: rare, endangered, vulnerable or privately located plants show only a generalized area on the public map',
    'Event-driven extension with a backend event queue for ML inference and review escalation and WebSocket status notifications, plus four black-box test cases for concurrent confirmations and event ordering',
    'Literature review and methodology (SDLC track with a synchronous vs event-driven pilot comparison and System Usability Scale scoring), supported by 31 IEEE-style references',
  ],
  screenshots: [
    { src: '/work/phytoquest-design/01-abstract-introduction.webp', caption: 'Page 2: title, abstract and introduction in the IEEE two-column layout' },
    { src: '/work/phytoquest-design/02-architecture-data-flow.webp', caption: 'Page 6: component responsibilities table, key data entities and the search and sighting data flows' },
    { src: '/work/phytoquest-design/03-methodology-roles-requirements.webp', caption: 'Page 5: methodology, STARR explanation, user roles table and the first functional requirements' },
    { src: '/work/phytoquest-design/04-ml-governance-test-plan.webp', caption: 'Page 7: machine-learning workflow, data governance boundaries and the event-driven test plan' },
    { src: '/work/phytoquest-design/05-title-page.webp', caption: 'Title page with the group members, course and adviser' },
  ],
  code: [],
  reflection:
    'This was the first time I specified a system completely on paper before building any of it, and the hardest part was agreeing on what PhytoQuest should refuse to do. Writing the out-of-scope list and the data governance section made us treat a phone GPS reading as evidence rather than proof, and hide exact coordinates for sensitive plants. Reframing the design around events also changed how I read our own requirements: the ML identification step, the review queue and the FR-13 notifications are background work that should never block the person submitting a sighting.\n\nThe literature review showed me that the research does not agree on a winner. Some of the studies we cited found the synchronous version faster and others found the event-driven version faster, so the honest claim was that we would measure it in our own pilot instead of assuming it. If I did this again I would draw the architecture and event-flow diagrams that the methodology section promises instead of describing them only in text, and I would fill in the tech-stack version baseline, which is still a placeholder in this draft.',
  docs: [
    { label: 'IEEE system design paper (PDF)', href: '/work/phytoquest-design/documentation.pdf' },
  ],
};
