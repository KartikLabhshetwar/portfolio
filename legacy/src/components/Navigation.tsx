'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import * as React from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function PageNavigation() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const showBackArrow = pathname !== '/projects' && pathname !== '/blogs' && pathname !== '/sponsors'

  return (
    <section className="flex items-center justify-between w-full will-change-transform" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }}>
      <div className="flex items-center gap-0.5 p-0.5 bg-black/5 dark:bg-white/10 rounded-full h-[32px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-7 h-7 bg-transparent has-hover:hover:bg-black/5 dark:has-hover:hover:bg-white/10 transition-[colors] duration-200 rounded-full flex items-center justify-center text-black/75 dark:text-white/80" tabIndex={0} style={{ transform: 'none' }}>
              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18" className="size-[13px] -mt-px -ml-0.5">
                  <path d="M13.75 6.019C13.336 6.019 13 5.683 13 5.269V2.75C13 2.336 13.336 2 13.75 2C14.164 2 14.5 2.336 14.5 2.75V5.269C14.5 5.683 14.164 6.019 13.75 6.019Z" fill="currentColor" data-color="color-2"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.792 5.848L9.446 1.147C9.181 0.951 8.818 0.951 8.553 1.147L2.208 5.848C1.764 6.177 1.5 6.702 1.5 7.254V13.75C1.5 15.267 2.733 16.5 4.25 16.5H5.5V12.75C5.5 11.7835 6.2835 11 7.25 11C8.2165 11 9 11.7835 9 12.75V16.5H13.75C15.267 16.5 16.5 15.267 16.5 13.75V7.254C16.5 6.702 16.235 6.176 15.792 5.848ZM11.25 10.5H12.75C13.164 10.5 13.5 10.164 13.5 9.75C13.5 9.336 13.164 9 12.75 9H11.25C10.836 9 10.5 9.336 10.5 9.75C10.5 10.164 10.836 10.5 11.25 10.5Z" fill="currentColor"></path>
                </svg>
              </Link>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Home
          </TooltipContent>
        </Tooltip>
        {showBackArrow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-7 h-7 bg-transparent has-hover:hover:bg-black/5 dark:has-hover:hover:bg-white/10 transition-[colors] duration-200 rounded-full flex items-center justify-center text-black/75 dark:text-white/80" tabIndex={0} style={{ transform: 'none' }}>
                <Link href="/projects">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-[14px] -mt-px -ml-0.5">
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                    <path d="M9 14 4 9l5-5"></path>
                  </svg>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Back to projects
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-0.5 p-0.5 bg-black/5 dark:bg-white/10 rounded-full h-[32px]">
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-7 h-7 bg-transparent has-hover:hover:bg-black/5 dark:has-hover:hover:bg-white/10 transition-[colors] duration-200 rounded-full flex items-center justify-center text-black/75 dark:text-white/80" tabIndex={0} style={{ transform: 'none' }}>
                <button
                  onClick={() => {
                    const newTheme = theme === 'light' ? 'dark' : 'light'
                    if (typeof document !== "undefined" && "startViewTransition" in document) {
                      ;(document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition(() => {
                        setTheme(newTheme)
                      })
                    } else {
                      setTheme(newTheme)
                    }
                  }}
                  className="w-full h-full flex items-center justify-center"
                  aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                >
                  {theme === 'light' ? (
                    <Moon className="size-[14px] -mt-px" aria-hidden="true" />
                  ) : (
                    <Sun className="size-[14px] -mt-px" aria-hidden="true" />
                  )}
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </section>
  )
}

