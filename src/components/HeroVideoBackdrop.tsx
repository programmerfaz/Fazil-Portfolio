import { type RefObject } from 'react';
import heroVideo from '../assets/hero-kie-video.mp4';

type HeroVideoBackdropProps = {
  videoRef: RefObject<HTMLVideoElement>;
  wrapRef: RefObject<HTMLDivElement>;
};

export function HeroVideoBackdrop({ videoRef, wrapRef }: HeroVideoBackdropProps) {
  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a1014]" aria-hidden>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
        src={heroVideo}
        muted
        playsInline
        preload="auto"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, rgba(10,16,20,0.88) 0%, rgba(10,16,20,0.55) 38%, rgba(10,16,20,0.2) 62%, rgba(10,16,20,0.45) 100%),
            linear-gradient(180deg, rgba(10,16,20,0.35) 0%, transparent 35%, rgba(10,16,20,0.55) 100%)
          `,
        }}
      />
    </div>
  );
}
