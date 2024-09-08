import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import kartikImage from '../assets/kartik.png';
import { FaEye} from 'react-icons/fa';


const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    <section id="about" ref={ref} className="py-20 bg-background">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-text-light"
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
              alt="Kartik Labhshetwar"
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
          <motion.div 
            className="md:w-2/3 md:pl-12"
            variants={itemVariants}
          >
            <motion.h3 className="text-2xl font-bold mb-4 text-secondary" variants={itemVariants}>
              Hi, I'm Kartik Labhshetwar 👋
            </motion.h3>
            <motion.p className="text-lg mb-4 text-text" variants={itemVariants}>
              I'm a passionate Computer Science and Engineering student at Government College of Engineering, Chh. Sambhajinagar, with a strong focus on full-stack development and a knack for creating efficient, user-centric web applications.
            </motion.p>
            <motion.p className="text-lg mb-4 text-text" variants={itemVariants}>
              Here's what I bring to the table:
            </motion.p>
            <motion.ul className="list-disc list-inside mb-4 text-text" variants={itemVariants}>
              <li>Proficiency in JavaScript, TypeScript, React.js, Node.js, and Express.js</li>
              <li>Experience with both SQL (PostgreSQL) and NoSQL (MongoDB) databases</li>
              <li>Expertise in modern frontend technologies like Tailwind CSS and state management with Recoil</li>
              <li>Strong problem-solving skills and a deep understanding of data structures and algorithms</li>
              <li>Practical experience in building full-stack applications with features like authentication, payment integration, and real-time processing</li>
            </motion.ul>
            <motion.p className="text-lg mb-4 text-text" variants={itemVariants}>
              I've successfully developed projects like LearnX (a course selling platform) and a Paytm clone, showcasing my ability to create comprehensive, user-friendly applications. My achievements include securing 13th place in the Quira Hackathon, where I demonstrated my frontend engineering skills.
            </motion.p>
            <motion.p className="text-lg mb-6 text-text" variants={itemVariants}>
              I'm always eager to take on new challenges, collaborate on innovative projects, and continue growing as a developer. Let's connect and create something amazing together!
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <a 
                href="https://drive.google.com/file/d/1wNL7rrATnQDiwSMYbVJYbV5mReriGUKx/view?usp=sharing" 
                className="flex items-center bg-primary text-text-light px-4 py-2 rounded-full hover:bg-secondary transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEye className="mr-2" /> View Resume
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
