import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type CertificatePdfViewerProps = {
  url: string;
  title: string;
};

export function CertificatePdfViewer({ url, title }: CertificatePdfViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(640);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.getBoundingClientRect().width;
      setContainerWidth(Math.max(240, Math.min(Math.floor(w - 8), 920)));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('orientationchange', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', sync);
    };
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
        <p className="max-w-sm text-sm text-neutral-600">
          Preview could not be loaded in the browser. Open the file in a new tab to view it.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
        >
          Open PDF
        </a>
        <p className="text-xs text-neutral-400">{title}</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="mx-auto w-full max-w-full overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch]"
      style={{ maxHeight: 'min(85dvh, calc(100dvh - 2rem))' }}
    >
      <Document
        file={url}
        loading={
          <div className="flex min-h-[200px] items-center justify-center py-12 text-sm text-neutral-500">
            Loading certificate…
          </div>
        }
        onLoadSuccess={({ numPages: n }) => {
          setNumPages(n);
          setLoadError(false);
        }}
        onLoadError={() => {
          setLoadError(true);
          setNumPages(null);
        }}
        className="flex flex-col items-center gap-3 pb-4"
      >
        {numPages !== null
          ? Array.from({ length: numPages }, (_, i) => (
              <Page
                key={`${url}-p-${i + 1}`}
                pageNumber={i + 1}
                width={containerWidth}
                className="!bg-white shadow-sm"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))
          : null}
      </Document>
    </div>
  );
}
