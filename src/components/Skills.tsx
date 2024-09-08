import React from 'react';
import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaJava, FaPython, FaNodeJs, FaGitAlt, FaGithub } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiC, SiReact, SiExpress, SiJquery, SiTailwindcss, SiPostgresql, SiPrisma, SiMongodb, SiNextdotjs, SiHtml5, SiCss3 } from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';

interface Skill {
  name: string;
  icon: React.ElementType;
  color: string;
  // description property removed
}

const skills: Skill[] = [
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Java', icon: FaJava, color: '#007396' },
  { name: 'Python', icon: FaPython, color: '#3776AB' },
  { name: 'C', icon: SiC, color: '#A8B9CC' },
  { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', icon: SiCss3, color: '#1572B6' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Recoil', icon: TbBrandReactNative, color: '#3578E5' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { name: 'Express.js', icon: SiExpress, color: '#000000' },
  { name: 'jQuery', icon: SiJquery, color: '#0769AD' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { name: 'Prisma', icon: SiPrisma, color: '#2D3748' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Git', icon: FaGitAlt, color: '#F05032' },
  { name: 'GitHub', icon: FaGithub, color: '#181717' },
];
const SkillItem: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div 
        className="flex flex-col items-center justify-center p-6 bg-text-light rounded-xl shadow-lg transition-all duration-300 ease-in-out"
        whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(255,255,255,0.12)" }}
      >
        <skill.icon className="text-5xl mb-4 text-primary" />
        <h3 className="text-xl font-semibold text-background mb-2">{skill.name}</h3>
      </motion.div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {skills.map((skill, index) => (
            <SkillItem key={skill.name} skill={skill} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
