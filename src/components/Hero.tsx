import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const technologies = ['HTML', 'CSS', 'JS', 'React', 'Vue', 'Angular', 'Tailwind', 'SASS', 'TypeScript', 'Webpack'];

  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1a202c" />
          {technologies.map((tech, index) => (
            <motion.text
              key={tech}
              x={Math.random() * 100 + '%'}
              y={Math.random() * 100 + '%'}
              fill="rgba(255,255,255,0.1)"
              fontSize="24"
              fontFamily="monospace"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              {tech}
            </motion.text>
          ))}
        </svg>
      </div>
      
      <div className="relative z-10 text-center">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Hi, I'm <motion.span 
            className="text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >Kartik</motion.span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Full-Stack Developer | Building Scalable | High-Performance Solutions
        </motion.p>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.a
            href="#projects"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-2 px-6 rounded-full border-2 border-white transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.a 
          href="#about" 
          className="animate-bounce"
          whileHover={{ scale: 1.2 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
