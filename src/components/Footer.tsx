import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/KartikLabhshetwar', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/kartikcode', label: 'LinkedIn' },
    { 
      icon: FaEnvelope, 
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=kartik.labhshetwar@gmail.com', 
      label: 'Email' 
    },
  ];

  return (
    <footer className="bg-primary text-text-light py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Kartik Labhshetwar</h3>
            <p className="text-text-light opacity-75">Full Stack Developer</p>
          </div>
          
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a 
                key={label}
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-secondary transition duration-300"
                aria-label={label}
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center text-text-light opacity-75">
          <p>&copy; {currentYear} Kartik Labhshetwar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;