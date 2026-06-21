'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface FloatingLoaderProps {
  isVisible: boolean
  text?: string
  position?: 'top' | 'bottom' | 'center'
}

export const FloatingLoader = ({ 
  isVisible, 
  text = 'Loading...', 
  position = 'top' 
}: FloatingLoaderProps) => {
  const positionClasses = {
    top: 'top-20 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-8 left-1/2 transform -translate-x-1/2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${positionClasses[position]} z-50 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 shadow-lg backdrop-blur-md`}
        >
          <div className="flex items-center space-x-3">
            <div className="loader" style={{ fontSize: '16px' }}>
              <style jsx>{`
                .loader:before {
                  content: "";
                }
              `}</style>
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
