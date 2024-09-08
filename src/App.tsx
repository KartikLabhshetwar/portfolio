import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import InteractiveChat from './components/InteractiveChat';

const App: React.FC = () => {
  return (
    <div className="font-sans bg-background text-text">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <InteractiveChat />
    </div>
  );
};

export default App;