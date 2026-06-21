'use client'

import Image from 'next/image'
import NeumorphButton from './NeumorphButton'

interface CallToActionProps {
  profileImage?: string
  profileAlt?: string
  linkText?: string
  linkUrl?: string
  preText?: string
}

export default function CallToAction({
  profileImage = "/pfp.jpg",
  profileAlt = "Profile",
  linkText = "Book a Free Call",
  linkUrl = "https://cal.com/kartik-labhshetwar/15min",
  preText = "If you've read this far, you might be interested in what I do."
}: CallToActionProps) {

  return (
    <div className="mt-4 sm:mt-6 pb-6 sm:pb-8 flex flex-col items-center w-full">
      <p className="text-neutral-600 dark:text-neutral-400 font-[family-name:var(--font-instrument-serif)] italic text-base sm:text-xl mb-3 text-center">{preText}</p>
      <div className="mt-3 sm:mt-0">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex touch-manipulation active:opacity-75"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <NeumorphButton className="px-5 py-2.5 sm:py-2 text-sm sm:text-base text-neutral-800 dark:text-white/90">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0">
                <Image 
                  alt={profileAlt} 
                  width={28} 
                  height={28} 
                  className="w-full h-full object-cover" 
                  src={profileImage}
                  style={{ color: 'transparent' }}
                />
              </div>
              <div className="flex items-center gap-1 overflow-hidden w-0 group-hover:w-[50px] transition-all duration-300 ease-out">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-2 h-2 sm:w-3 sm:h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-900/10 dark:bg-white/10 flex items-center justify-center text-[8px] sm:text-[10px]">
                  You
                </div>
              </div>
              <span className="whitespace-nowrap">
                {linkText}
              </span>
            </div>
          </NeumorphButton>
        </a>
      </div>
    </div>
  )
}
