'use client';
import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";

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
    resume: "https://drive.google.com/file/d/1iePpSqo5l0cztVSghCf2PfKH7mFTCTzs/view?usp=sharing",
  }
}: ProfileHeaderProps) {

  return (
    <div className="flex-col -mt-10">
      <div 
        className="w-24 h-24 sm:w-28 sm:h-28 mb-4 sm:ml-8 ml-4 relative z-10 rounded-full overflow-hidden bg-cover bg-center"
        role="img"
        aria-label={name}
        style={{ backgroundImage: `url("${profileImage}")` }}
      />
      <div className="text-left sm:flex sm:justify-between sm:items-center w-full sm:px-8 px-4 flex-col sm:flex-row">
        <div className="px-0">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-4xl tracking-[0.01em] font-medium mb-0">
            {name}
          </h1>
          <p className="opacity-40 text-xs sm:text-sm">
            {age} • {title}
          </p>
        </div>
        <div className="flex justify-start space-x-4 mt-3 sm:mt-0 px-0">
        {socialLinks.github && (
            <a 
              className="hover:opacity-80 touch-manipulation active:opacity-75" 
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
              <FaGithub size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a 
              className="hover:opacity-80 touch-manipulation active:opacity-75" 
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
              <FaXTwitter size={18} />
            </a>
          )}
          {socialLinks.resume && (
            <a 
              className="hover:opacity-80 touch-manipulation active:opacity-75" 
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
              <FaPaperclip size={18} />
            </a>
          )}
         
          {socialLinks.linkedin && (
            <a 
              className="hover:opacity-80 touch-manipulation active:opacity-75" 
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
              <FaLinkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
