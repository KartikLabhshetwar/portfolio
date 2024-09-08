import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-gray-800">
            Kartik Labhshetwar
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#skills" className="text-gray-600 hover:text-gray-900">Skills</a>
            <a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="https://github.com/KartikLabhshetwar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/kartikcode" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              <FaLinkedin size={24} />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kartik.labhshetwar@gmail.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-gray-600 hover:text-gray-900">
              <FaEnvelope size={24} />
            </a>
          </div>
          <button 
            className="md:hidden focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <a href="#about" className="block py-2 px-4 text-sm hover:bg-gray-200">About</a>
          <a href="#skills" className="block py-2 px-4 text-sm hover:bg-gray-200">Skills</a>
          <a href="#projects" className="block py-2 px-4 text-sm hover:bg-gray-200">Projects</a>
          <a href="#contact" className="block py-2 px-4 text-sm hover:bg-gray-200">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
