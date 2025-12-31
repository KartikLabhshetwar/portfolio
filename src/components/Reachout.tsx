'use client'
import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { Tooltip } from "./ui/tooltip-card";
import Image from "next/image";
import { VisitorCount } from "./VisitorCount";

interface ReachoutProps {
  title?: string
  subtitle?: string
  socialLinks?: {
    twitter?: string
    resume?: string
    github?: string
    linkedin?: string
    mail?: string
  }
}

export default function Reachout({
  title = "Let's connect",
  subtitle = "Find me on these platforms",
  socialLinks = {
    twitter: "https://x.com/shivam909058",
    github: "https://github.com/Shivam909058",
    linkedin: "https://linkedin.com/in/shivam-singh-94835224a",
    resume: "https://drive.google.com/file/d/1U8450r8Qsf9Xo1IcQhMdSrdzFY2__JXP/view?usp=sharing",
    mail: "mailto:shivamatvit@gmail.com"
  }
}: ReachoutProps) {
  return (
    <div className="sm:px-12 px-4 pb-24 sm:pb-28">
      <div className="text-left w-full">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-lg sm:text-xl mb-2 opacity-20 mt-4 sm:mt-6">
            {title}
          </h2>
          <p className="opacity-20 text-md sm:text-lg mb-3 sm:mb-4">
           {subtitle}
          </p>
        </div>
        
        <div className="flex justify-center sm:justify-start gap-3 sm:gap-3">
          {socialLinks.github && (
            <Tooltip content={
                <Image
                  width={3024}
                  height={1720}
                  src="/github.png"
                  alt="GitHub"
                  className="rounded-sm max-w-full h-auto"
                  unoptimized
                />
            }>
              <a 
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/5 dark:bg-white/10 has-hover:hover:bg-black/10 dark:has-hover:hover:bg-white/20 transition-[colors] duration-200 rounded-full touch-manipulation active:opacity-75" 
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
                <FaGithub className="text-[28px] sm:text-[18px] text-black/75 dark:text-white/80 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium text-black/75 dark:text-white/80">GitHub</span>
              </a>
            </Tooltip>
          )}
          
          {socialLinks.twitter && (
            <Tooltip content={
                <Image
                  width={1206}
                  height={1220}
                  src="/twitter.png"
                  alt="Twitter"
                  className="rounded-sm max-w-full h-auto"
                  unoptimized
                />
            }>
              <a 
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/5 dark:bg-white/10 has-hover:hover:bg-black/10 dark:has-hover:hover:bg-white/20 transition-[colors] duration-200 rounded-full touch-manipulation active:opacity-75" 
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
                <FaXTwitter className="text-[28px] sm:text-[18px] text-black/75 dark:text-white/80 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium text-black/75 dark:text-white/80">Twitter</span>
              </a>
            </Tooltip>
          )}
          
          {socialLinks.linkedin && (
            <Tooltip content={
                <Image
                  width={1596}
                  height={1108}
                  src="/linkedin.png"
                  alt="LinkedIn"
                  className="rounded-sm max-w-full h-auto"
                  unoptimized
                />
            }>
              <a 
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/5 dark:bg-white/10 has-hover:hover:bg-black/10 dark:has-hover:hover:bg-white/20 transition-[colors] duration-200 rounded-full touch-manipulation active:opacity-75" 
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
                <FaLinkedin className="text-[28px] sm:text-[18px] text-black/75 dark:text-white/80 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium text-black/75 dark:text-white/80">LinkedIn</span>
              </a>
            </Tooltip>
          )}

          {socialLinks.mail && (
            <Tooltip content="shivamatvit@gmail.com">
              <a 
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/5 dark:bg-white/10 has-hover:hover:bg-black/10 dark:has-hover:hover:bg-white/20 transition-[colors] duration-200 rounded-full touch-manipulation active:opacity-75" 
                href={socialLinks.mail} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <IoMdMail className="text-[28px] sm:text-[18px] text-black/75 dark:text-white/80 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium text-black/75 dark:text-white/80">Mail</span>
              </a>
            </Tooltip>
          )}
          
          {socialLinks.resume && (
            <Tooltip content={
                <Image
                  width={1076}
                  height={1394}
                  src="/resume.png"
                  alt="Resume"
                  className="rounded-sm max-w-full h-auto"
                  unoptimized
                />
            }>
              <a 
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/5 dark:bg-white/10 has-hover:hover:bg-black/10 dark:has-hover:hover:bg-white/20 transition-[colors] duration-200 rounded-full touch-manipulation active:opacity-75" 
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
                <FaPaperclip className="text-[28px] sm:text-[18px] text-black/75 dark:text-white/80 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium text-black/75 dark:text-white/80">Resume</span>
              </a>
            </Tooltip>
          )}
        </div>
        
        {/* Footer Section */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 text-center sm:text-left">
            <div className="text-md dark:text-white/40 text-black/40">
              © {new Date().getFullYear()} Shivam Singh.
            </div>
            <VisitorCount className="text-md dark:text-white/40 text-black/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
