import { publicAssetUrl } from '../utils/publicAssetUrl';

export type CertificateAccent = 'microsoft' | 'nvidia' | 'coursera' | 'aws' | 'web' | 'anthropic';

export type CertificateItem = {
  title: string;
  src: string;
  /** Short face label — keep brief; shown large on the card. */
  gist: string;
  accent: CertificateAccent;
  /** Two short bullets max — readable at large size on the card. */
  highlights: readonly [string, string];
};

function certPath(filename: string): string {
  return publicAssetUrl(new URL(`../Certificates/${filename}`, import.meta.url).href);
}

/** PDFs in `src/Certificates` — bundled by Vite. */
export const CERTIFICATE_PDFS: CertificateItem[] = [
  {
    title: 'Microsoft Learn — credentials (renewed 2025)',
    gist: 'Microsoft Learn · Azure',
    accent: 'microsoft',
    highlights: ['Cloud & AI roles', 'Renewed 2025'],
    src: certPath('Credentials - fazilmohd-7139 _ Microsoft Learn Renewed 2025.pdf'),
  },
  {
    title: 'Coursera — AWS',
    gist: 'AWS · Data analytics',
    accent: 'aws',
    highlights: ['Analytics on AWS', 'Hands-on labs'],
    src: certPath('Coursera AWS.pdf'),
  },
  {
    title: 'Coursera — Parallel computing & MPI',
    gist: 'Parallel computing · MPI',
    accent: 'coursera',
    highlights: ['MPI programming', 'Distributed HPC'],
    src: certPath('Coursera parallel computing MPI.pdf'),
  },
  {
    title: 'Coursera — specialization',
    gist: 'Coursera specialization',
    accent: 'coursera',
    highlights: ['Multi-course track', 'Structured projects'],
    src: certPath('Coursera WUS67S2KLZQ5.pdf'),
  },
  {
    title: 'HTML & CSS',
    gist: 'HTML · CSS foundations',
    accent: 'web',
    highlights: ['Semantic markup', 'Layout & style'],
    src: certPath('HTML CSS CERTIFICte.pdf'),
  },
  {
    title: 'NVIDIA — My Learning',
    gist: 'NVIDIA · GPU / CUDA',
    accent: 'nvidia',
    highlights: ['GPU computing', 'CUDA learning'],
    src: certPath('My Learning _ NVIDIA.pdf'),
  },
  {
    title: 'NVIDIA — My Learning (certificate)',
    gist: 'NVIDIA · Deep learning',
    accent: 'nvidia',
    highlights: ['Deep learning labs', 'NVIDIA stack'],
    src: certPath('Certificate+My+Learning+_+NVIDIA+202205042.pdf'),
  },
  {
    title: 'AI Fluency Certificate',
    gist: 'AI fluency · Foundations',
    accent: 'anthropic',
    highlights: ['AI literacy', 'Practical fluency'],
    src: certPath('AI Fluency Certificate.pdf'),
  },
  {
    title: 'Overview of AI',
    gist: 'Overview of AI',
    accent: 'anthropic',
    highlights: ['AI landscape', 'Core concepts'],
    src: certPath('Overview of AI.pdf'),
  },
  {
    title: 'Claude 101',
    gist: 'Claude 101',
    accent: 'anthropic',
    highlights: ['Claude fundamentals', 'Best practices'],
    src: certPath('Claude 101.pdf'),
  },
  {
    title: 'Claude Code 101',
    gist: 'Claude Code 101',
    accent: 'anthropic',
    highlights: ['Agentic coding', 'Claude Code workflow'],
    src: certPath('Claude Code 101.pdf'),
  },
];
