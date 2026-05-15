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
          stroke="#fde68a"
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
            'radial-gradient(120% 90% at 12% 8%, rgba(120, 53, 15, 0.22) 0%, transparent 52%), radial-gradient(90% 70% at 92% 96%, rgba(154, 52, 18, 0.18) 0%, transparent 48%), linear-gradient(165deg, #0f0a14 0%, #08060c 45%, #050508 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -40px 80px -60px rgba(234, 88, 12, 0.12)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
