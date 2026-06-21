'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedProjectCardProps {
  children: ReactNode;
  projectId: string;
  index: number;
  className?: string;
}

export const AnimatedProjectCard = ({ 
  children, 
  projectId, 
  index, 
  className = '' 
}: AnimatedProjectCardProps) => {
  const { registerItem, isVisible, getAnimationDelay } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '100px',
    staggerDelay: 0.05
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const visible = isVisible(projectId);
  const delay = getAnimationDelay(index);

  useEffect(() => {
    if (cardRef.current) {
      registerItem(projectId, cardRef.current);
    }
  }, [registerItem, projectId]);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      initial={{ 
        opacity: 0, 
        y: 40,
        scale: 0.95
      }}
      animate={visible ? { 
        opacity: 1, 
        y: 0,
        scale: 1
      } : {
        opacity: 0, 
        y: 40,
        scale: 0.95
      }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.25, 0, 1],
        opacity: { duration: 0.4 },
        y: { duration: 0.6 },
        scale: { duration: 0.6 }
      }}
    >
      {children}
    </motion.div>
  );
};
