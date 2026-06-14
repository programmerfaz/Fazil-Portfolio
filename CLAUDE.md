# Fazil Hakim — Portfolio Site

Personal portfolio for Fazil Hakim (CS undergrad, University of Bahrain). Deployed via Vercel; repo is github.com/programmerfaz/Fazil-Portfolio.

## Stack
- React 18 + TypeScript + Vite 8
- Tailwind CSS for styling
- Framer Motion for animation
- Lucide React for icons
- react-pdf for certificate PDF viewing

## Scripts
- `npm run dev` — dev server on port 3002
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run preview` — preview prod build

## Structure
- `src/App.tsx` — top-level page composition (single-page layout, sections stacked):
  `PortfolioSplash` → `HeroSection` → `MarqueeSection` → `AboutSection` → `ServicesSection` → `ProjectsSection` → `ContactSection` → `RadialMenu`
- `src/sections/` — one file per page section (matches App.tsx order)
- `src/components/` — reusable UI: 3D project carousel (`ProjectsCarousel3D`), certificate viewer/lightbox/stack (`CertificatePdfViewer`, `CertificateLightbox`, `CertificatePdfStack`), `RadialMenu`, `Magnet`, `AnimatedText`, `ElectricContactCard`, `SkillFlipCardCarousel`, etc.
- `src/data/` — content/config separated from UI:
  - `profile.ts` — all CV copy (bio, contact info, experience, skill groups, achievements, certifications) — **edit this for content changes**
  - `projects.ts`, `projectStackTech.ts` — featured projects data
  - `certificates.ts` — certificate metadata (PDFs in `src/Certificates/`)
  - `marqueeWorkImages.ts` — scrolling marquee images
  - `skillTechIcons.tsx`, `techSimpleSlugs.ts` — icon mappings for skills/tech
- `src/assets/` — images
- `src/Certificates/` — certificate PDF files
- `src/utils/publicAssetUrl.ts` — helper for resolving asset URLs (relevant for GitHub Pages base path support)

## Notes
- `vite.config.ts` supports a configurable base path via `VITE_BASE` env var (for GitHub Pages deployment); defaults to `/`.
- `vercel.json` sets headers so PDFs render inline in-browser.
- Mobile responsiveness has been an active focus area (carousel, certificate previews).
