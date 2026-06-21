'use client'

interface ContentSectionProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  background?: boolean
}

export default function ContentSection({
  title,
  subtitle,
  children,
  className = '',
  background = false
}: ContentSectionProps) {
  const bgClass = background 
    ? 'dark:bg-white/[0.01] bg-black/[0.01]' 
    : ''

  return (
    <div className={`sm:px-8 px-4 ${bgClass} ${className}`}>
      {title && (
        <div className="pb-6">
          {subtitle && (
            <p className="text-sm sm:text-md opacity-30">{subtitle}</p>
          )}
          <p 
            className="text-md sm:text-lg font-medium" 
            style={{ letterSpacing: '-0.02em' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      )}
      {children}
    </div>
  )
}
