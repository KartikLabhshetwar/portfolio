import React from 'react';
import { motion } from 'framer-motion';
import kartikImage from '../assets/kartik.png';

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          variants={itemVariants}
        >
          About Me
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/3 mb-8 md:mb-0"
            variants={itemVariants}
          >
            <motion.img
              src={kartikImage}
              alt="Your Name"
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
          <motion.div 
            className="md:w-2/3 md:pl-12"
            variants={itemVariants}
          >
            <motion.p className="text-lg mb-4 text-gray-700" variants={itemVariants}>
              Hello! I'm [Your Name], a passionate full stack developer with a keen eye for creating beautiful and functional web applications.
            </motion.p>
            <motion.p className="text-lg mb-4 text-gray-700" variants={itemVariants}>
              With [X] years of experience in web development, I specialize in the MERN stack (MongoDB, Express.js, React, Node.js), TypeScript, and modern CSS frameworks like Tailwind. I'm dedicated to writing clean, efficient code and building user-friendly interfaces.
            </motion.p>
            <motion.p className="text-lg mb-4 text-gray-700" variants={itemVariants}>
              My approach to development is rooted in a deep understanding of both front-end and back-end technologies. I strive to create seamless, responsive applications that not only meet but exceed user expectations.
            </motion.p>
            <motion.p className="text-lg mb-4 text-gray-700" variants={itemVariants}>
              When I'm not coding, you can find me [mention a hobby or interest]. I believe in continuous learning and am always excited to take on new challenges and explore cutting-edge technologies.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
