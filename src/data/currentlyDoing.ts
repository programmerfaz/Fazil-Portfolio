import seenImg from '../assets/seen.jpeg';
import orchestrateCertImg from '../assets/Certificate.png';
import hackathonWaitingImg from '../assets/hackathon waiting result.png';
import type { CarouselItem } from '../components/BoxCarousel';

export type CurrentlyDoingItem = {
  readonly period: string;
  readonly title: string;
  readonly detail: string;
  readonly status: string;
  readonly image?: string;
  readonly imageAlt?: string;
};

/** Recent focus — last ~1–2 months. Edit here when priorities change. */
export const CURRENTLY_DOING: readonly CurrentlyDoingItem[] = [
  {
    period: 'Now',
    title: 'Intern at Seen Solution',
    detail:
      'Working as an intern at Seen Solution on AI conversation products — chatbots, APIs, and AI agents under the Ai-Octopus / Meta Business Partner stack.',
    status: 'Interning',
    image: seenImg,
    imageAlt: 'Laptop at Seen Solution with Ai-Octopus AI Conversation banner',
  },
  {
    period: '1st week of June 2026',
    title: 'HackerRank Orchestrate',
    detail:
      'Took part in HackerRank’s Orchestrate (June 2026) — built and deployed an AI agent. Final rank #489 of 1,773 participants.',
    status: 'Rank #489',
    image: orchestrateCertImg,
    imageAlt: 'HackerRank Orchestrate certificate — final rank #489 of 1,773',
  },
  {
    period: 'Aug 2026',
    title: 'Orchestrate — awaiting results',
    detail:
      'Live evaluation in progress on HackerRank Orchestrate — chat transcripts through final code review, with results rolling out Aug 4–7.',
    status: 'Evaluating',
    image: hackathonWaitingImg,
    imageAlt: 'HackerRank Orchestrate leaderboard — live evaluation in progress',
  },
];

/** Cube faces for the Currently Doing box carousel. */
export const CURRENTLY_DOING_CAROUSEL: CarouselItem[] = CURRENTLY_DOING.map((item, i) =>
  item.image
    ? {
        id: i,
        type: 'image' as const,
        srcUrl: item.image,
        alt: item.imageAlt ?? item.title,
        label: item.title,
        sublabel: item.status,
      }
    : {
        id: i,
        type: 'card' as const,
        label: item.title,
        sublabel: item.status,
        alt: item.title,
      },
);
