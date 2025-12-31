'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, ChevronUp, GitMerge } from 'lucide-react'
import { fallbackContributions } from '@/lib/github'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface Contribution {
  title: string
  description: string
  repository: string
  link: string
  date: string
  type?: 'feature' | 'fix' | 'perf' | 'docs' | 'refactor' | 'test' | 'chore'
  state?: 'open' | 'closed' | 'merged'
}



export default function OpenSourceContributionsCard() {
  const [showAll, setShowAll] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>(fallbackContributions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/github-contributions?username=Shivam909058&limit=50')
        const data = await response.json()
        
        if (data.success && data.contributions.length > 0) {
          setContributions(data.contributions)
        }
      } catch (error) {
        console.error('Failed to load GitHub contributions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContributions()
  }, [])

  const displayedContributions = showAll ? contributions : contributions.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-lg bg-white dark:bg-zinc-900 p-3 sm:p-6"
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
                  </div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                </div>
                <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
              {i < 3 && <div className="mt-4 border-b border-neutral-300 dark:border-[#2E2E2E]" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 group">
          {displayedContributions.map((contribution, index) => (
          <motion.div
            key={contribution.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group/item transition-opacity duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {contribution.state === 'merged' && (
                    <GitMerge className="w-4 h-4 text-purple-500 dark:text-purple-400 transition-opacity duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100" />
                  )}
                  <h4 className="text-[15px] leading-7 text-black/80 group-has-hover:text-black/40 group-has-hover:group-hover/item:text-black dark:text-white/80 dark:group-has-hover:text-white/40 dark:group-has-hover:group-hover/item:text-white font-medium transition-colors duration-300">
                    {contribution.title}
                  </h4>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 group-has-hover:text-neutral-400 dark:group-has-hover:text-neutral-500 group-has-hover:group-hover/item:text-neutral-500 dark:group-has-hover:group-hover/item:text-neutral-400 transition-colors duration-300">{contribution.date}</span>
                </div>
                
                <p className="text-xs text-neutral-600 dark:text-neutral-400 group-has-hover:text-neutral-400 dark:group-has-hover:text-neutral-500 group-has-hover:group-hover/item:text-neutral-600 dark:group-has-hover:group-hover/item:text-neutral-400 leading-relaxed transition-colors duration-300">
                  {contribution.description}
                </p>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={contribution.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg bg-neutral-200 border-2 border-neutral-500 dark:bg-neutral-800 dark:border-neutral-500 transition-all duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100"
                  >
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  View contribution
                </TooltipContent>
              </Tooltip>
            </div>
            
            {index < displayedContributions.length - 1 && (
              <div className="mt-4 border-b border-neutral-300 dark:border-[#2E2E2E] transition-opacity duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100" />
            )}
          </motion.div>
          ))}
        </div>
      )}


      {/* Show More/Less Toggle */}
      {!loading && contributions.length > 3 && (
        <div className="mt-4 pt-4 border-t border-neutral-300 dark:border-[#2E2E2E]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200 group"
          >
            <span>{showAll ? 'Show less' : `Show all ${contributions.length} contributions`}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}
