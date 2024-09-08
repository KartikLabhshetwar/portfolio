import React from 'react';
import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from './ProjectCard';
import AnimatedBackground from './AnimatedBackground';
import learnx from '../assets/learnx.png';
import paytmClone from '../assets/paytm.png';
import textToSpeechApp from '../assets/texttospeech.png';
import emiCalculator from '../assets/emi.png';


interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "LearnX",
    description: "A comprehensive course selling platform with secure payment integration, JWT-based authentication, and optimized performance.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Razorpay API", "JWT", "Tailwind"],
    imageUrl: learnx,
    liveUrl: "https://learnx-frontend.onrender.com/",
    githubUrl: "https://github.com/KartikLabhshetwar/LearnX"
  },
  {
    id: 2,
    title: "Paytm Clone",
    description: "A comprehensive clone of Paytm with user authentication, money transfers, and profile management.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "RESTful APIs", "Tailwind CSS"],
    imageUrl: paytmClone,
    liveUrl: "https://paytm-clone-frontend.onrender.com/",
    githubUrl: "https://github.com/KartikLabhshetwar/Paytm-Clone"
  },
  {
    id: 3,
    title: "Text-To-Speech Application",
    description: "A web application that converts text to speech using Web Speech API, supporting multiple voices and pause/resume functionality.",
    technologies: ["JavaScript", "HTML", "CSS"],
    imageUrl: textToSpeechApp,
    liveUrl: "https://text-to-speech-app-henna.vercel.app/",
    githubUrl: "https://github.com/KartikLabhshetwar/Text-To-Speech-App"
  },
  {
    id: 4,
    title: "EMI Calculator",
    description: "A React-based EMI calculator with real-time calculations, loan analysis, and print functionality.",
    technologies: ["React", "Bootstrap", "react-to-print"],
    imageUrl: emiCalculator,
    liveUrl: "https://emi-calculator-mocha.vercel.app/",
    githubUrl: "https://github.com/KartikLabhshetwar/EMI-Calculator"
  }
];

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" ref={ref} className="py-20 bg-background">
        <AnimatedBackground />
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
