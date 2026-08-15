import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import fazilPhoto from '../assets/fazil.jpeg';
import { PROFILE } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

type HeroCodingPortraitProps = {
  className?: string;
  objectClassName?: string;
};

export function HeroCodingPortrait({ className = '', objectClassName = '' }: HeroCodingPortraitProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const img = imgRef.current;
    if (!root || !img || reduceMotion) return;

    const section = root.closest('section') ?? root;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: 0, scale: 1.04 },
        {
          yPercent: 8,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.85,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden bg-[#0b1418] ${className}`}>
      <img
        ref={imgRef}
        src={fazilPhoto}
        alt={PROFILE.name}
        className={`absolute inset-0 h-full w-full object-cover object-[center_16%] ${objectClassName}`}
        draggable={false}
      />
    </div>
  );
}
