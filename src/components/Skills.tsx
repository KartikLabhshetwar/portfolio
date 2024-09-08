import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiTailwindcss } from 'react-icons/si';

interface Skill {
  name: string;
  icon: React.ElementType;
  level: number;
}

const skills: Skill[] = [
  { name: 'React', icon: FaReact, level: 90 },
  { name: 'TypeScript', icon: SiTypescript, level: 85 },
  { name: 'JavaScript', icon: SiJavascript, level: 95 },
  { name: 'HTML5', icon: FaHtml5, level: 100 },
  { name: 'CSS3', icon: FaCss3Alt, level: 90 },
  { name: 'Tailwind CSS', icon: SiTailwindcss, level: 80 },
  { name: 'Node.js', icon: FaNodeJs, level: 75 },
  { name: 'Git', icon: FaGitAlt, level: 85 },
];

const SkillBar: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => (
  <motion.div 
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="flex items-center mb-2">
      <motion.div 
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <skill.icon className="w-6 h-6 mr-3 text-blue-500" />
      </motion.div>
      <span className="font-medium text-lg">{skill.name}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ duration: 1, delay: index * 0.1 }}
      ></motion.div>
    </div>
  </motion.div>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <SkillBar key={index} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
