import { useScrollReveal } from './hooks/useScrollReveal';
import { useActiveSection } from './hooks/useActiveSection';
import { Nav } from './components/chrome/Nav';
import { Footer } from './components/chrome/Footer';
import { Marquee } from './components/ui/Marquee';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Research } from './components/sections/Research';
import { Publications } from './components/sections/Publications';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Skills } from './components/sections/Skills';
import { Contact } from './components/sections/Contact';

/* ============================================================================
 * Root
 * ========================================================================== */

const SECTION_IDS = ['about', 'research', 'publications', 'projects', 'experience', 'skills', 'contact'];

export default function App() {
  useScrollReveal();
  const active = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-white">
      <Nav active={active} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Research />
        <Publications />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
