function pick(lines: readonly string[]): string {
  return lines[Math.floor(Math.random() * lines.length)]!;
}

const HERO = [
  'That’s me — Fazil. CS at University of Bahrain, graduating Dec 2026.',
  'Intern at Seen Solution right now. Azure AI certified, building real stuff.',
  'Grab the CV or WhatsApp if you want to talk. I’m around.',
];

const NOW = [
  'This is what I’ve been on lately — internship, NeetCode, hackathons.',
  'Seen Solution internship: chatbots, APIs, AI agents. Two months in.',
  'August Orchestrate I landed #632 of 1,983. Built and shipped an AI agent.',
  'June Orchestrate was #489 of 1,773. Same idea — deploy an agent, see where you stand.',
];

const WORK = [
  'Work in motion — screens from Siyaha, the real estate app, movies, the rest.',
  'These are actual shots from things I shipped, not mockups.',
];

const ABOUT = [
  'BSc Computer Science at UoB. CGPA 3.82. Scholarship kid, still grinding.',
  'I grew up in Al-Hidd. English, Urdu, a bit of Arabic.',
  'Azure AI Engineer Associate — that’s the cert I care about most.',
];

const SKILLS = [
  'React, Node, C#, ASP.NET, Azure — that’s the day-to-day stack.',
  'I bounce between full-stack and AI. OpenAI, RAG, Postgres, the usual.',
  'Internship taught me Azure DevOps and actually shipping in a sprint.',
];

const EXPERIENCE = [
  'Seen Solution now — AI conversation products, live company work.',
  'Dimuma was my ASP.NET internship. Stored procs, ESG reporting, Azure DevOps.',
  'StartUps Bahrain, hackathons, Forsati — I show up and build.',
];

const CERTS = [
  'Microsoft Azure AI, NVIDIA deep learning, AWS analytics, Claude tracks.',
  'I keep the PDFs here so you can flip through them yourself.',
];

const PROJECTS = [
  'Siyaha BH is the one I’m proudest of — live tourism app with RAG and itineraries.',
  'Nine projects here. Full-stack, ML, IoT. Click one if you want the story.',
];

const CONTACT = [
  'Email, WhatsApp, LinkedIn — pick whatever’s easy. I reply.',
  'Bahrain or remote. Internships and grad roles, software or AI.',
];

const DEFAULT = [
  'Keep scrolling — about, skills, projects, the whole thing is me.',
  'If something looks interesting, hover it. I’ll tell you what it is.',
];

type Rule = {
  test: (ctx: { text: string; href: string; id: string }) => boolean;
  lines: readonly string[];
};

const RULES: readonly Rule[] = [
  {
    test: ({ href }) => href.includes('wa.me') || href.includes('whatsapp'),
    lines: ['That’s WhatsApp. Text me — I’ll actually answer.'],
  },
  {
    test: ({ href }) => href.startsWith('mailto:'),
    lines: ['fazilmohdshahbaz@gmail.com. Send it there if email’s easier.'],
  },
  {
    test: ({ href }) => href.includes('linkedin'),
    lines: ['LinkedIn if you want the formal version of this page.'],
  },
  {
    test: ({ href, text }) => href.includes('drive.google') || /\bcv\b|resume/i.test(text),
    lines: ['That’s the CV. One page, the internships and Siyaha are in there.'],
  },
  {
    test: ({ href }) => href.includes('github.com'),
    lines: ['GitHub — repos for the real estate app, Sessioner, the ML set, all of it.'],
  },
  {
    test: ({ href, text }) => /siyaha/i.test(text) || href.includes('siyahabh'),
    lines: [
      'Siyaha BH. Live Bahrain tourism site — RAG, Pinecone, smart itineraries.',
      'I shipped Siyaha with React, Postgres, and OpenAI. It’s actually online.',
    ],
  },
  {
    test: ({ text, href }) => /wealth|real estate/i.test(text) || href.includes('realestate'),
    lines: ['WealthHome — Bahrain property search with an OpenAI chatbot and Supabase.'],
  },
  {
    test: ({ text }) => /movie/i.test(text),
    lines: ['Movie Explorer. TMDB API, React, Vite. Fast and simple.'],
  },
  {
    test: ({ text }) => /library/i.test(text),
    lines: ['Library system in Spring Boot. Roles, borrowing, Postgres, REST.'],
  },
  {
    test: ({ text }) => /room booking|booking/i.test(text),
    lines: ['Uni room booking. PHP and MySQL so two people can’t take the same slot.'],
  },
  {
    test: ({ text }) => /\bml\b|machine learning|breast cancer|sonar/i.test(text),
    lines: ['ML portfolio — classification and regression. Python, sklearn, a bunch of datasets.'],
  },
  {
    test: ({ text }) => /parking|lora|iot/i.test(text),
    lines: ['Smart parking. Arduino, LoRa, sensors. Long-range slot updates.'],
  },
  {
    test: ({ text }) => /amazon/i.test(text),
    lines: ['Amazon homepage clone. Straight HTML, CSS, JS. Layout practice.'],
  },
  {
    test: ({ text, href }) => /sessioner/i.test(text) || href.includes('sessioner'),
    lines: ['Sessioner transcribes audio, translates, and writes summaries. React + OpenAI.'],
  },
  {
    test: ({ text }) => /seen solution|octopus/i.test(text),
    lines: ['Seen Solution internship. I’m on AI chat, agents, and Meta partner tooling.'],
  },
  {
    test: ({ text }) => /orchestrate|hackerrank|#632|#489/i.test(text),
    lines: [
      'HackerRank Orchestrate. June I was #489, August #632. Built an AI agent both times.',
    ],
  },
  {
    test: ({ text }) => /dimuma|asp\.net/i.test(text),
    lines: ['Dimuma, summer 2025. C# ASP.NET intern — ESG reporting and Azure DevOps.'],
  },
  {
    test: ({ text }) => /azure|microsoft/i.test(text),
    lines: ['Microsoft Azure AI Engineer Associate. That’s the cert on the top of the pile.'],
  },
  {
    test: ({ text }) => /nvidia|cuda|deep learning/i.test(text),
    lines: ['NVIDIA deep learning and CUDA certs. GPU side of the AI work.'],
  },
  {
    test: ({ href }) => href === '#about' || href === '#skills' || href === '#projects' || href === '#contact',
    lines: ['Yeah, jump there. I’ll keep talking when you land.'],
  },
  { test: ({ id }) => id === 'now', lines: NOW },
  { test: ({ id }) => id === 'about', lines: ABOUT },
  { test: ({ id }) => id === 'skills', lines: SKILLS },
  { test: ({ id }) => id === 'experience', lines: EXPERIENCE },
  { test: ({ id }) => id === 'certificates', lines: CERTS },
  { test: ({ id }) => id === 'projects', lines: PROJECTS },
  { test: ({ id }) => id === 'contact', lines: CONTACT },
];

export function speakAbout(el: Element | null): string {
  const node = el as HTMLElement | null;
  const section = node?.closest('section[id], [id]') as HTMLElement | null;
  const link = node?.closest('a') as HTMLAnchorElement | null;
  const href = (link?.getAttribute('href') ?? '').toLowerCase();
  const id = (section?.id ?? '').toLowerCase();
  const text = `${node?.innerText ?? ''} ${node?.getAttribute('aria-label') ?? ''} ${link?.textContent ?? ''}`.slice(0, 400);

  const ctx = { text, href, id };
  for (const rule of RULES) {
    if (rule.test(ctx)) return pick(rule.lines);
  }

  if (!id) return pick(HERO);
  if (id.includes('marquee') || text.toLowerCase().includes('work in motion')) return pick(WORK);
  return pick(DEFAULT);
}
