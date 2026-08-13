import { FazilCursorBuddy } from './components/FazilCursorBuddy';
import { PortfolioSplash } from './components/PortfolioSplash';
import { RadialMenu } from './components/RadialMenu';
import { SiteBug } from './components/HeroHeaderBug';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { CurrentlyDoingSection } from './sections/CurrentlyDoingSection';
import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ServicesSection } from './sections/ServicesSection';

function App() {
  return (
    <div className="min-h-[100dvh] min-h-screen overflow-x-clip overflow-y-visible bg-[var(--surface-dark)] font-sans text-[var(--surface-accent)]">
      <PortfolioSplash />
      <HeroSection />
      <CurrentlyDoingSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <SiteBug />
      <FazilCursorBuddy />
      <RadialMenu />
    </div>
  );
}

export default App;
