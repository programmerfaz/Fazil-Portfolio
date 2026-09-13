import syntecxOfferImg from '../assets/syntecxhub-offer-letter.png';
import seenCompletionImg from '../assets/seen-training-completion.png';
import orchestrateAugCertImg from '../assets/32516528_image.png';
import offerLetterPdf from '../assets/Offer_Letter_Fazil_Hakim.pdf';
import type { CarouselItem } from '../components/BoxCarousel';

export type CurrentlyDoingItem = {
  readonly period: string;
  readonly title: string;
  readonly detail: string;
  readonly status: string;
  readonly image?: string;
  readonly imageAlt?: string;
  /** Prefer contain for documents/certificates so text stays readable. */
  readonly imageFit?: 'cover' | 'contain';
  /** Optional link to open the attached document (PDF, etc.). */
  readonly href?: string;
  readonly hrefLabel?: string;
};

/** Recent focus — last ~3 months. Edit here when priorities change. */
export const CURRENTLY_DOING: readonly CurrentlyDoingItem[] = [
  {
    period: 'Now · Sep 2026',
    title: 'Backend Intern at SYNTECXHUB',
    detail:
      'Started a remote Virtual Internship in Backend Development at SYNTECXHUB (from 9 Sep 2026) — real-world backend projects, portfolio work, and a completion certificate on finish.',
    status: 'Interning',
    image: syntecxOfferImg,
    imageAlt: 'SYNTECXHUB Backend Development internship offer letter for Fazil Hakim',
    imageFit: 'contain',
    href: offerLetterPdf,
    hrefLabel: 'View offer letter (PDF)',
  },
  {
    period: 'Completed · 6 Sep 2026',
    title: 'Seen Solution — training complete',
    detail:
      'Finished my training internship at The Seen Business Solutions W.L.L. on AI conversation products (Ai-Octopus). Received a Certificate of Training Completion.',
    status: 'Completed',
    image: seenCompletionImg,
    imageAlt: 'Certificate of Training Completion from The Seen Business Solutions for Fazil Hakim',
    imageFit: 'contain',
    href: seenCompletionImg,
    hrefLabel: 'View completion certificate',
  },
  {
    period: 'August 2026',
    title: 'Orchestrate — August',
    detail:
      'Took part in the August 2026 Orchestrate — built and deployed an AI agent. Final rank #632 of 1,983.',
    status: 'Rank #632',
    image: orchestrateAugCertImg,
    imageAlt: 'HackerRank Orchestrate August 2026 certificate — final rank #632 of 1,983',
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
        objectFit: item.imageFit ?? 'cover',
      }
    : {
        id: i,
        type: 'card' as const,
        label: item.title,
        sublabel: item.status,
        alt: item.title,
      },
);
