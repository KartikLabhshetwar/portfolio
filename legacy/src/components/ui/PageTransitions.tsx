'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export const FadeInUp = ({ 
  children, 
  delay = 0, 
  duration = 0.4, // Faster animation
  className = '',
  once = true
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Reduced movement
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut" // Simplified easing
      }}
      viewport={{ once, amount: 0.2 }} // Lower threshold for faster trigger
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const FadeInScale = ({ 
  children, 
  delay = 0, 
  duration = 0.3, // Faster animation
  className = '',
  once = true
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // Less dramatic scale
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once, amount: 0.2 }} // Lower threshold
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const SlideInFromLeft = ({ 
  children, 
  delay = 0,
  className = '',
  once = true
}: {
  children: ReactNode
  delay?: number
  className?: string
  once?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }} // Reduced movement
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, // Faster
        delay,
        ease: "easeOut" // Simplified easing
      }}
      viewport={{ once, amount: 0.2 }} // Lower threshold
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Optimized stagger container - use sparingly and only for small lists
export const StaggerContainer = ({ 
  children,
  staggerDelay = 0.03, // Even faster stagger
  className = ''
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Lower threshold for faster trigger
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0 // No initial delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Optimized stagger item - simplified for better performance
export const StaggerItem = ({ 
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 }, // Even less movement
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.25, // Faster animation
            ease: "easeOut"
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
