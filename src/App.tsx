import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/chrome/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
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

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="research" element={<Research />} />
            <Route path="publications" element={<Publications />} />
            <Route path="projects" element={<Projects />} />
            <Route path="experience" element={<Experience />} />
            <Route path="skills" element={<Skills />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}
