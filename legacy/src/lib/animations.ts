// Optimized animation variants for framer-motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 }, // Reduced from 60 for smoother animation
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 } // Reduced from -60
}

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 }, // Reduced from 0.8 for subtlety
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -30 }, // Reduced from -100 for performance
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 } // Reduced from 100
}

export const slideInRight = {
  initial: { opacity: 0, x: 30 }, // Reduced from 100
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 } // Reduced from -100
}

export const scaleOnHover = {
  hover: { scale: 1.02, transition: { duration: 0.15 } }, // Reduced scale and duration
  tap: { scale: 0.98 } // Less aggressive tap
}

// Removed bounceIn as it's performance-heavy with spring animations

// Optimized transition configurations
export const easeOutTransition = {
  duration: 0.4, // Reduced from 0.6 for snappier feel
  ease: "easeOut" // Simplified easing
}

export const springTransition = {
  type: "spring",
  stiffness: 300, // Increased for faster animation
  damping: 25 // Increased for less bounce
}

// Optimized stagger animations - use sparingly
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05 // Reduced from 0.1 for faster execution
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 10 }, // Reduced movement
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3, // Reduced from 0.5
      ease: "easeOut" // Simplified easing
    }
  }
}
