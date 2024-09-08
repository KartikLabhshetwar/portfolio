import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TerminalCommand from './TerminalCommand';
import AnimatedBackground from './AnimatedBackground';

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const Hero: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const titleVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 200 }
    }
  };

  const title = "Hi, I'm Kartik 👋";

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center bg-background text-text-light overflow-hidden">
      <AnimatedBackground />
      <motion.div 
        className="text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h1 className="text-5xl md:text-6xl font-bold mb-4" variants={titleVariants}>
          {title.split('').map((char, index) => (
            <motion.span key={index} variants={letterVariants}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 text-text">
          Building Scalable Full-Stack Applications
        </motion.p>
        {/* <motion.p variants={itemVariants} className="text-lg mb-8 text-text max-w-2xl mx-auto">
          Crafting robust web applications with modern technologies.
          Proficient in JavaScript, TypeScript, and Java.
        </motion.p> */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <motion.a
            href="#projects"
            className="px-8 py-3 bg-transparent border-2 border-text-light text-text-light rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-text-light hover:text-background"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-3 bg-transparent border-2 border-text-light text-text-light rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-text-light hover:text-background"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Contact Me
          </motion.a>
        </motion.div>
        <motion.div variants={itemVariants} className="mt-12">
          <TerminalCommand />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
