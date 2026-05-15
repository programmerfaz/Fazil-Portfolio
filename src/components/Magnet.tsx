import type { PropsWithChildren, CSSProperties } from 'react';
import { useRef, useCallback, useState } from 'react';

type MagnetProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}>;

export function Magnet({
  children,
  className,
  style,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const near =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;
      setActive(near);

      if (!near) {
        el.style.transform = 'translate3d(0px, 0px, 0)';
        return;
      }

      const mx = (e.clientX - cx) / strength;
      const my = (e.clientY - cy) / strength;
      el.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    },
    [padding, strength],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setActive(false);
    el.style.transform = 'translate3d(0px, 0px, 0)';
  }, []);

  return (
    <div className={className} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        style={{
          willChange: 'transform',
          transition: active ? activeTransition : inactiveTransition,
          display: 'inline-block',
        }}
      >
        {children}
      </div>
    </div>
  );
}
