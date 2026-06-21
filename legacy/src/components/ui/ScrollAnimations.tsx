'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ScrollProgressProps {
  className?: string
}

export const ScrollProgress = ({ className = '' }: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform-gpu z-50 ${className}`}
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <motion.button
      className={`fixed bottom-8 right-8 z-200 p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-shadow`}
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  )
}

// Hook for smooth scroll animations
export const useScrollAnimation = () => {
  const { scrollY } = useScroll()
  
  return {
    y: scrollY,
    parallax: useSpring(scrollY, { stiffness: 100, damping: 30 })
  }
}
