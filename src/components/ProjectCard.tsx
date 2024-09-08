import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    technologies: string[];
    imageUrl: string;
    liveUrl: string;
    githubUrl: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-text-light rounded-lg shadow-lg overflow-hidden"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
        <motion.div 
          className="absolute inset-0 bg-primary bg-opacity-80 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-4">
            <motion.a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-secondary text-text-light p-3 rounded-full"
              whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
              whileTap={{ scale: 0.9 }}
            >
              <FaExternalLinkAlt />
            </motion.a>
            <motion.a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-text text-background p-3 rounded-full"
              whileHover={{ scale: 1.1, backgroundColor: "#D1D5DB" }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
          </div>
        </motion.div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-background">{project.title}</h3>
        <p className="text-background mb-4">{project.description}</p>
        <div className="mb-4 flex flex-wrap">
          {project.technologies.map((tech, index) => (
            <motion.span 
              key={index} 
              className="inline-block bg-primary text-text-light rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
