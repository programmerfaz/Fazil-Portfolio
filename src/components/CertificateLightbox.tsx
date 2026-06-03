import { lazy, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const CertificatePdfViewer = lazy(() =>
  import('./CertificatePdfViewer').then((m) => ({ default: m.CertificatePdfViewer })),
);

type CertificateLightboxProps = {
  title: string;
  src: string;
  onClose: () => void;
};

export function CertificateLightbox({ title, src, onClose }: CertificateLightboxProps) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="cert-lightbox fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6">
      <button
        type="button"
        aria-label="Close certificate"
        className="absolute inset-0 bg-neutral-900/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[min(92dvh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-neutral-200 bg-neutral-100 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:px-5">
          <p className="min-w-0 truncate text-sm font-semibold text-neutral-900">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              Open in new tab
            </a>
            <button
              type="button"
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              onClick={onClose}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-white">
          <Suspense
            fallback={
              <div className="flex min-h-[240px] items-center justify-center py-16 text-sm text-neutral-500">
                Loading certificate…
              </div>
            }
          >
            <CertificatePdfViewer key={src} url={src} title={title} />
          </Suspense>
        </div>
      </div>
    </div>,
    document.body,
  );
}
