import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const resumeLink = "https://drive.google.com/file/d/1wNL7rrATnQDiwSMYbVJYbV5mReriGUKx/view?usp=sharing";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-md' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-text-light">
            Kartik Labhshetwar
          </a>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#about" className="text-text hover:text-secondary transition duration-300">About</a>
            <a href="#skills" className="text-text hover:text-secondary transition duration-300">Skills</a>
            <a href="#projects" className="text-text hover:text-secondary transition duration-300">Projects</a>
            <a href="#contact" className="text-text hover:text-secondary transition duration-300">Contact</a>
            <motion.a 
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-text-light px-4 py-2 rounded-full hover:bg-secondary transition duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileAlt className="mr-2" /> Resume
            </motion.a>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="https://github.com/KartikLabhshetwar" target="_blank" rel="noopener noreferrer" className="text-text hover:text-secondary transition duration-300">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/kartikcode" target="_blank" rel="noopener noreferrer" className="text-text hover:text-secondary transition duration-300">
              <FaLinkedin size={24} />
            </a>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=kartik.labhshetwar@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition duration-300"
              aria-label="Email Kartik"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
          <button 
            className="md:hidden focus:outline-none text-text" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background">
          <a href="#about" className="block py-2 px-4 text-sm text-text hover:bg-primary hover:text-text-light transition duration-300">About</a>
          <a href="#skills" className="block py-2 px-4 text-sm text-text hover:bg-primary hover:text-text-light transition duration-300">Skills</a>
          <a href="#projects" className="block py-2 px-4 text-sm text-text hover:bg-primary hover:text-text-light transition duration-300">Projects</a>
          <a href="#contact" className="block py-2 px-4 text-sm text-text hover:bg-primary hover:text-text-light transition duration-300">Contact</a>
          <a 
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-4 text-sm text-text hover:bg-primary hover:text-text-light transition duration-300"
          >
            <FaFileAlt className="inline mr-2" /> Resume
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
