import type { SkillTechIconKey } from './skillTechIcons';

type SkillTechnology = {
  readonly name: string;
  readonly icon: SkillTechIconKey;
  readonly blurb?: string;
};

/** CV / site copy — Fazil Hakim */
export const PROFILE = {
  name: 'Fazil Hakim',
  shortName: 'Fazil',
  role: 'Computer Science Undergraduate',
  tagline: 'Certified Microsoft Azure AI engineer Associate | Computer science student',
  email: 'fazilmohdshahbaz@gmail.com',
  phoneDisplay: '+973 34543703',
  phoneTel: 'tel:+97334543703',
  /** Country code + national number, digits only — for https://wa.me/ */
  phoneWhatsappDigits: '97334543703',
  /** Optional first line in the WhatsApp compose box when using wa.me */
  whatsappPrefillMessage: 'Hi Fazil, ',
  location: 'Al-Hidd, Bahrain',
  nationality: 'Bahrain',
  linkedinUrl: 'https://www.linkedin.com/in/fazil-shahbaz-5278a1325/',
  githubUrl: 'https://github.com/programmerfaz',
  githubReposUrl: 'https://github.com/programmerfaz?tab=repositories',
  university: 'University of Bahrain',
  degree: 'BSc. Computer Science',
  educationPeriod: '2022 – Dec 2026',
  cgpa: '3.81 / 4.00',
  school: 'Ibn Al-Haytham Islamic School',
  schoolPeriod: '2008 – July 2022',
  dob: '10 November 2003',
  languagesPersonal: 'English, Urdu, Arabic (basic)',
} as const;

export const PROFILE_SUMMARY =
  "My goal is to enhance and apply my skills as an IT student by actively engaging in real-world challenges. I'm eager to work in a highly competitive environment that fosters continuous learning and offers opportunities for professional growth.";

export const EXPERIENCE = [
  {
    role: 'C# ASP.NET Developer — Part-time Intern',
    org: 'Dimuma',
    period: 'June 2025 – August 2025',
    bullets: [
      'Built and optimized stored procedures, business logic, and tracking modules for ESG reporting.',
      'Enhanced UI design and UX across key platform sections.',
      'Used Azure DevOps for source control, deployments, and collaboration.',
      'Resolved logical errors and streamlined workflows to improve performance.',
    ],
  },
  {
    role: 'Hackathon Participant',
    org: 'Smart Coders',
    period: 'July 2024',
    bullets: ['Contributed to team-based software challenges in a competitive hackathon setting.'],
  },
  {
    role: 'Soft Skills Trainee',
    org: 'Forsati',
    period: 'August 2024',
    bullets: [
      'Completed training focused on communication, teamwork, and professional skills.',
    ],
  },
] as const;

export const SKILL_GROUPS = [
  {
    n: '01',
    title: 'Programming & data',
    tagline: 'Languages, SQL & data modeling',
    summary:
      'I write typed and scripting code across Java, Python, JavaScript, C#, and PHP to ship coursework and personal projects. I model and query data in MySQL and PostgreSQL, and use Supabase when I want auth and Postgres in one place.',
    technologies: [
      { name: 'Java', icon: 'coffee', blurb: 'OOP & coursework' },
      { name: 'Python', icon: 'terminal', blurb: 'Scripts & tooling' },
      { name: 'JavaScript', icon: 'braces', blurb: 'Web & Node' },
      { name: 'C#', icon: 'hash', blurb: '.NET stack' },
      { name: 'PHP', icon: 'code', blurb: 'Backend scripting' },
      { name: 'MySQL', icon: 'database', blurb: 'Relational data' },
      { name: 'PostgreSQL', icon: 'cylinder', blurb: 'Advanced SQL' },
      { name: 'Supabase', icon: 'zap', blurb: 'Postgres + auth' },
    ] satisfies ReadonlyArray<SkillTechnology>,
  },
  {
    n: '02',
    title: 'Web & mobile',
    tagline: 'UI, native apps & REST APIs',
    summary:
      'I build responsive interfaces with React, Vite, HTML, CSS, and Tailwind, and ship cross-platform screens with React Native. On the server side I use Node.js, Spring Boot, and ASP.NET to expose clean REST APIs—patterns I practiced in class and during my internship.',
    technologies: [
      { name: 'React', icon: 'component', blurb: 'UI & state' },
      { name: 'React Native', icon: 'smartphone', blurb: 'Cross-platform' },
      { name: 'Vite', icon: 'zap', blurb: 'Fast dev builds' },
      { name: 'Node.js', icon: 'server', blurb: 'APIs & tooling' },
      { name: 'HTML / CSS', icon: 'palette', blurb: 'Layout & design' },
      { name: 'Tailwind', icon: 'wind', blurb: 'Utility-first UI' },
      { name: 'Spring Boot', icon: 'leaf', blurb: 'Java APIs' },
      { name: 'ASP.NET', icon: 'layoutTemplate', blurb: 'Internship stack' },
      { name: 'REST', icon: 'link', blurb: 'HTTP APIs' },
    ] satisfies ReadonlyArray<SkillTechnology>,
  },
  {
    n: '03',
    title: 'Cloud, DevOps & tools',
    tagline: 'Git, Azure & delivery pipelines',
    summary:
      'I keep work traceable with Git and GitHub, and collaborate through Azure DevOps boards and pipelines. I provision and inspect resources in Azure Portal, package Java builds with Maven, and prototype firmware flows on Arduino and ESP32.',
    technologies: [
      { name: 'Git', icon: 'gitBranch', blurb: 'Branching & history' },
      { name: 'GitHub', icon: 'github', blurb: 'Repos & CI hooks' },
      { name: 'Office', icon: 'laptop', blurb: 'Docs & analysis' },
      { name: 'Azure Portal', icon: 'cloud', blurb: 'Cloud resources' },
      { name: 'Azure DevOps', icon: 'workflow', blurb: 'Pipelines & boards' },
      { name: 'Maven', icon: 'package', blurb: 'Java builds' },
      { name: 'Arduino', icon: 'cpu', blurb: 'Firmware basics' },
      { name: 'ESP32', icon: 'boxes', blurb: 'Embedded workflows' },
    ] satisfies ReadonlyArray<SkillTechnology>,
  },
  {
    n: '04',
    title: 'AI, architecture & IoT',
    tagline: 'AI APIs, patterns & embedded edge',
    summary:
      'I wire OpenAI-style APIs into apps for GPT and embedding use cases, and keep larger systems understandable with MVC and clear client–server boundaries. For IoT-style work I connect sensors and experiment with long-range links such as LoRa.',
    technologies: [
      { name: 'OpenAI API', icon: 'sparkles', blurb: 'GPT & embeddings' },
      { name: 'MVC', icon: 'layoutGrid', blurb: 'Structured apps' },
      { name: 'Client / server', icon: 'network', blurb: 'Distributed design' },
      { name: 'IoT sensors', icon: 'radio', blurb: 'Edge data' },
      { name: 'LoRa', icon: 'antenna', blurb: 'Long-range links' },
    ] satisfies ReadonlyArray<SkillTechnology>,
  },
  {
    n: '05',
    title: 'How I work',
    tagline: 'Communication, ownership & shipping',
    summary:
      'I communicate early and often, take ownership in teams, and break fuzzy problems into steps until something ships. Hackathons sharpened my pace; my ASP.NET internship taught me to align with tickets, reviews, and delivery in a real sprint cadence.',
    technologies: [
      { name: 'Communication', icon: 'messages', blurb: 'Clear async updates' },
      { name: 'Leadership', icon: 'users', blurb: 'Owning outcomes' },
      { name: 'Teamwork', icon: 'usersRound', blurb: 'Hackathons & groups' },
      { name: 'Problem solving & logic', icon: 'puzzle', blurb: 'Debug to ship, structured thinking' },
      { name: 'Delivery', icon: 'trophy', blurb: 'Competitions & demos' },
      { name: 'Internship', icon: 'briefcase', blurb: 'Real sprint cadence' },
    ] satisfies ReadonlyArray<SkillTechnology>,
  },
] as const;

export const ACHIEVEMENTS = [
  'Grade 10: graduated with distinction — top 3 in school.',
  'Grade 12: 95% and 2nd position in school.',
  "Scholarship from the Ministry of Education for BSc at the University of Bahrain.",
] as const;

export const CERTIFICATIONS = [
  'Certified Microsoft Azure AI Engineer Associate (Microsoft)',
  'Fundamentals of Deep Learning (NVIDIA)',
  'Fundamentals of Accelerated Computing with Modern CUDA C (NVIDIA)',
  'Getting Started with Data Analytics on AWS (AWS)',
  'Parallel Computing with MPI (Coursera)',
  'Use Python Regular Expressions to Process File Data',
  'Introduction to HTML and CSS (Udemy)',
] as const;
