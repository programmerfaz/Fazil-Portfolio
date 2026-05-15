export type Project = {
  num: string;
  category: string;
  title: string;
  summary: string;
  bullets: string[];
  stack: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  /** Optional showcase images — omit until you add your own under `/public/projects/` */
  col1a?: string;
  col1b?: string;
  col2?: string;
};

export const PROJECTS: Project[] = [
  {
    num: '01',
    category: 'Full-stack',
    title: 'WealthHome — Real estate platform',
    summary:
      'Property discovery for Bahrain with AI-assisted guidance, advanced filters, and a modern React stack.',
    bullets: [
      'React (Vite), Node.js, Tailwind CSS, and Supabase for data and auth.',
      'OpenAI-powered chatbot and analytics for tailored recommendations.',
      'Rich property filters tailored to the Bahrain market.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Tailwind', 'Supabase', 'OpenAI'],
    liveUrl: 'https://realestatefazil.netlify.app/Login',
    repositoryUrl: 'https://github.com/programmerfaz/Real-estate',
  },
  {
    num: '02',
    category: 'Frontend',
    title: 'Movie Explorer',
    summary: 'Discover trending and searchable films via the TMDB API with a fast Vite + React UI.',
    bullets: [
      'React (Vite), Node.js, and Tailwind CSS.',
      'TMDB integration for search, details, and discovery.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Tailwind', 'TMDB API'],
    liveUrl: 'https://movie-site-react-lyart.vercel.app/',
    repositoryUrl: 'https://github.com/programmerfaz/Movie-Site-React',
  },
  {
    num: '03',
    category: 'Backend',
    title: 'Library management system',
    summary: 'Spring Boot library app with roles, borrowing flows, and clean REST APIs over PostgreSQL.',
    bullets: [
      'Book management, user roles, and borrowing transactions.',
      'RESTful APIs, PostgreSQL, and Maven for builds and dependencies.',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'REST', 'Maven', 'MVC'],
    repositoryUrl: 'https://github.com/7ax/LibraryOS',
  },
  {
    num: '04',
    category: 'Full-stack',
    title: 'University room booking system',
    summary: 'Conflict-aware booking with a PHP + MySQL backend and a responsive HTML/CSS/JS front end.',
    bullets: [
      'Booking algorithm to prevent double bookings.',
      'JavaScript, PHP, and MySQL for interactive flows and persistence.',
    ],
    stack: ['JavaScript', 'PHP', 'MySQL', 'HTML', 'CSS'],
    repositoryUrl: 'https://github.com/StoicTylerDurden/itcs333-project',
  },
  {
    num: '05',
    category: 'Machine learning',
    title: 'ML portfolio — classification & regression',
    summary:
      'A set of classic supervised learning projects covering sonar, rainfall, loans, health, housing, and more.',
    bullets: [
      'Models include sonar rock vs mine, rainfall, loan and heart-disease classification, fake news, diabetes, California housing, breast cancer, and Titanic survival.',
      'Python-focused workflow with clear evaluation and iteration.',
    ],
    stack: ['Python', 'scikit-learn', 'pandas', 'Logistic regression', 'Regression'],
    repositoryUrl: 'https://github.com/programmerfaz/Machine-learning-Projects',
  },
  {
    num: '06',
    category: 'IoT',
    title: 'Smart parking system',
    summary: 'IoT parking slots with long-range wireless telemetry to reduce congestion.',
    bullets: [
      'Arduino and LoRa for long-range wireless links.',
      'Embedded logic for real-time slot state and transmission.',
    ],
    stack: ['Arduino', 'LoRa', 'ESP32', 'Sensors', 'Embedded C'],
  },
  {
    num: '07',
    category: 'Frontend',
    title: 'Amazon home page clone',
    summary: 'Static clone focused on layout fidelity and vanilla JavaScript interactions.',
    bullets: [
      'HTML, CSS, and JavaScript to mirror structure and interactivity.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    repositoryUrl: 'https://github.com/programmerfaz/Amazon-Website-Clone-HTML-CSS-',
  },
  {
    num: '08',
    category: 'Frontend',
    title: 'Sessioner — Audio transcription studio',
    summary:
      'Record or upload audio, transcribe with AI, translate to other languages, and generate summaries and action items.',
    bullets: [
      'In-browser recording and upload with playback before processing.',
      'Transcription, summaries, and announcements with RTL support for languages like Arabic.',
      'React, Vite, and Tailwind CSS for a responsive, card-based UI.',
    ],
    stack: ['React', 'Vite', 'Tailwind', 'OpenAI'],
    liveUrl: 'https://sessioner.vercel.app/',
    repositoryUrl: 'https://github.com/programmerfaz/Sessioner',
  },
];

export function projectHasGallery(p: Project): boolean {
  return Boolean(p.col1a && p.col1b && p.col2);
}
