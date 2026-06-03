import { useEffect, useId, useState, type ReactNode } from 'react';

type ElectricContactCardProps = {
  children: ReactNode;
  className?: string;
};

/** Single filter: turbulence → displacement (both axes same “crackle”) → blur glow + sharp core — avoids misaligned double stroke. */
function ElectricBorderDefs({
  filterId,
  reduceMotion,
}: {
  filterId: string;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return (
      <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    );
  }

  return (
    <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.02 0.02"
        numOctaves="2"
        seed="2"
        stitchTiles="stitch"
        result="noise"
      >
        <animate
          attributeName="baseFrequency"
          dur="6s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          values="0.017 0.017;0.024 0.024;0.017 0.017"
        />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="wavy" />
      <feGaussianBlur in="wavy" stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="wavy" />
      </feMerge>
    </filter>
  );
}

export function ElectricContactCard({ children, className = '' }: ElectricContactCardProps) {
  const rawId = useId().replace(/:/g, '');
  const filterId = `electric-${rawId}`;

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div className={`relative mx-auto w-full max-w-[min(96vw,920px)] ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full min-h-full w-full overflow-visible"
        viewBox="0 0 520 640"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${filterId}-stroke`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <ElectricBorderDefs filterId={filterId} reduceMotion={reduceMotion} />
        </defs>

        <rect
          x="4"
          y="4"
          width="512"
          height="632"
          rx="32"
          ry="32"
          fill="none"
          stroke={`url(#${filterId}-stroke)`}
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
      </svg>

      <div
        className="relative z-[1] m-2.5 flex flex-col gap-6 overflow-visible rounded-[26px] px-5 py-8 max-sm:m-1.5 max-sm:gap-4 max-sm:rounded-[22px] max-sm:px-3.5 max-sm:py-6 sm:gap-7 sm:px-8 sm:py-9 md:gap-8 md:px-12 md:py-10"
        style={{
          background:
            'radial-gradient(120% 90% at 12% 8%, rgba(6, 182, 212, 0.14) 0%, transparent 52%), radial-gradient(90% 70% at 92% 96%, rgba(139, 92, 246, 0.16) 0%, transparent 48%), linear-gradient(165deg, rgba(17, 24, 39, 0.95) 0%, rgba(3, 7, 18, 0.98) 45%, #030712 100%)',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -40px 80px -60px rgba(139, 92, 246, 0.12), 0 0 80px -40px rgba(6, 182, 212, 0.12)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
