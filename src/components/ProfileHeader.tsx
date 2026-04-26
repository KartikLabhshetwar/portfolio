'use client';
import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import PortfolioStars from './PortfolioStars';
import NeumorphButton from "./NeumorphButton";

interface ProfileHeaderProps {
  name?: string
  age?: string
  title?: string
  profileImage?: string
  socialLinks?: {
    twitter?: string
    resume?: string
    github?: string
    linkedin?: string
  }
}

export default function ProfileHeader({
  name = "Kartik Labhshetwar",
  age = "21",
  title = "engineer • developer • builder",
  profileImage = "/pfp.jpg",
  socialLinks = {
    twitter: "https://x.com/code_kartik",
    github: "https://github.com/KartikLabhshetwar",
    linkedin: "https://www.linkedin.com/in/kartikcode/",
    resume: "https://drive.google.com/file/d/1U8450r8Qsf9Xo1IcQhMdSrdzFY2__JXP/view?usp=sharing",
  }
}: ProfileHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-col -mt-10">
      <div className="flex items-center justify-between mb-4 sm:ml-8 ml-4 sm:mr-8 mr-4">
        <div 
          className="w-24 h-24 sm:w-28 sm:h-28 relative z-10 rounded-full overflow-hidden bg-cover bg-center shrink-0"
          role="img"
          aria-label={name}
          style={{ backgroundImage: `url("${profileImage}")` }}
        />
        <PortfolioStars />
      </div>
      <div className="text-left sm:flex sm:justify-between sm:items-center w-full sm:px-8 px-4 flex-col sm:flex-row">
        <div className="px-0">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-4xl tracking-[0.01em] font-medium mb-0">
            {name}
          </h1>
          <p className="opacity-40 text-xs sm:text-sm">
            {age} • {title}
          </p>
        </div>
        <div className="flex justify-start gap-1 sm:gap-2 mt-3 sm:mt-0 px-0">
          {socialLinks.github && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8" 
                  href={socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    <FaGithub className="text-[16px] sm:text-[16px] text-black/75 dark:text-white/80" />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                GitHub
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.twitter && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8" 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    <FaXTwitter className="text-[16px] sm:text-[16px] text-black/75 dark:text-white/80" />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Twitter
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.resume && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8" 
                  href={socialLinks.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    <FaPaperclip className="text-[16px] sm:text-[16px] text-black/75 dark:text-white/80" />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Resume
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.linkedin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8" 
                  href={socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    <FaLinkedin className="text-[16px] sm:text-[16px] text-black/75 dark:text-white/80" />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                LinkedIn
              </TooltipContent>
            </Tooltip>
          )}
          {mounted && (
            <Tooltip>
              <TooltipTrigger asChild>
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
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                  type="button"
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    {theme === 'light' ? (
                      <Moon className="size-[14px] -mt-px" aria-hidden="true" />
                    ) : (
                      <Sun className="size-[14px] -mt-px" aria-hidden="true" />
                    )}
                  </NeumorphButton>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
