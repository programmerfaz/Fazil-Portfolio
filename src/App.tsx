import { PortfolioSplash } from './components/PortfolioSplash';
import { RadialMenu } from './components/RadialMenu';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ServicesSection } from './sections/ServicesSection';

function App() {
  return (
    <div className="min-h-[100dvh] min-h-screen overflow-x-clip overflow-y-visible bg-[#0C0C0C] text-[#D7E2EA]">
      <PortfolioSplash />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <RadialMenu />
    </div>
  );
}

export default App;
