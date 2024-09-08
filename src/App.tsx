import React, { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

const App: React.FC = () => {
  return (
    <div className="font-sans">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
