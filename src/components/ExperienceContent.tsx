'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements?: string[];
  href?: string;
  logoUrl?: string;
}

export default function ExperienceContent() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const experiences: ExperienceItem[] = [
    {
      company: "Mem0",
      position: "Member of Technical Staff",
      duration: "Apr 2026 – Present",
      description: "Full-time role continuing from internship, working across Python SDK, TypeScript SDK, documentation, and CI infrastructure for the universal memory layer for AI agents.",
      href: "https://mem0.ai",
      logoUrl: "/memzero.png",
    },
    {
      company: "Mem0 (Intern)",
      position: "Software Engineering Intern",
      duration: "Mar 2026 – Apr 2026",
      description: "Contributed across the full stack — SDKs, docs, CI, and community — for Mem0's open-source memory layer for AI agents.",
      achievements: [
        "Authored 43 PRs (95% merge rate), 39 commits, 15K+ lines across 169 files — Python SDK, TypeScript SDK, docs, and CI.",
        "Triaged issue backlog from 400+ to under 100, same for open PRs. Categorized, closed stale items, linked duplicates, routed actionable work to right contributors.",
        "Fixed a critical data-loss bug where delete_all(user_id=...) destroyed the entire vector collection instead of filtered records — affecting all self-hosted users.",
        "Built TypeScript SDK test infrastructure from scratch — 474 unit tests across 26 suites + 29 live integration tests against real Mem0 API, CI pipelines for Node 20 & 22.",
        "Resolved 18 bugs across the stack: MongoDB metadata loss, Ollama URL misconfig, Gemini safety-filter crashes, LLMReranker silent fallback, tsup peer-dep bundling.",
        "Reviewed 47 PRs from community contributors with detailed line-level feedback — guided MiniMax LLM, Apache AGE graph store, and REST server auth to merge-ready quality.",
        "Drove community engagement — 34 external contributors, 57 PRs in 3 weeks, 72 issues resolved repo-wide.",
        "Expanded docs with 3 OSS cookbook tabs, Vibecoding guide, MiroFish swarm-memory cookbook, and a full skills for mem0 (3,261 lines).",
        "Patched CVE-2026-0994 (protobuf CVSS 8.2 HIGH), updated deprecated Google embedding models, migrated Ollama to current API endpoints.",
        "Overhauled GitHub issue templates, configured stale-bot automation, added auto-labeler for 9 component types.",
      ],
      href: "https://mem0.ai",
      logoUrl: "/memzero.png",
    },
    {
      company: "Turbo ML",
      position: "Software Engineering Intern (AI)",
      duration: "April 2025 – July 2025",
      description: "Developed and deployed cutting-edge solutions, including multi-select preferences, browser-based video recording, and API integrations like WhatsApp/email reminders. Optimized workflows with autosave features and real-time scraping, leveraging Next.js, Supabase, and Cloudflare workers.",
      achievements: [
        "Implemented a reminder system using Redis Sorted Sets and a custom daemon to handle time-based task execution under 24-hour constraints.",
        "Integrated multiple APIs including Swiggy for food delivery and dine-out services, and Blinkit for grocery delivery, while retaining Google for general recommendations and providing user choice flexibility.",
        "Designed and implemented support for WhatsApp Business API commands (/help, /reset, /new), including runtime-configurable bot initialization based on environment variables.",
        "Added Azure Blob Storage integration for file handling and message reaction management in WhatsApp bot.",
        "Ensured WhatsApp message compliance by chunking outputs exceeding 4096 characters.",
      ],
      href: "https://turboml.com/",
      logoUrl: "/turboml.jpg",
    },
  ]

  const toggleExpanded = (company: string) => {
    setExpanded(prev => ({
      ...prev,
      [company]: !prev[company]
    }))
  }

  return (
    <div className="space-y-4 dark:text-white/70 text-black/70 pb-4">
      {experiences.map((exp) => {
        const isExpanded = expanded[exp.company]
        
        return (
          <div key={exp.company} className="rounded-lg p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                  {exp.logoUrl ? (
                    <Image 
                      src={exp.logoUrl} 
                      alt={exp.company}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-lg font-medium dark:text-white text-black">
                      {exp.company.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium dark:text-white text-black text-sm sm:text-lg">
                    {exp.href ? (
                      <Link 
                        href={exp.href} 
                        target="_blank" 
                        className="hover:text-[#006FEE] transition-colors"
                      >
                        {exp.company}
                      </Link>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-70">
                    {exp.position}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 pl-[3.25rem] sm:pl-0">
                <div className="sm:text-right shrink-0">
                  <p className="text-xs sm:text-sm opacity-50">
                    {exp.duration}
                  </p>
                </div>
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleExpanded(exp.company)}
                        className="shrink-0 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isExpanded ? 'Collapse details' : 'Expand details'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            
            {exp.achievements && exp.achievements.length > 0 && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <ul className="space-y-2.5 text-xs sm:text-sm opacity-80">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="text-[#006FEE] shrink-0 mt-1.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
