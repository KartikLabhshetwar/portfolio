import { FC } from 'react'
import { BlogPost } from '@/types/blog'

interface BlogCardProps {
  blog: BlogPost
}

export const BlogCard: FC<BlogCardProps> = ({ blog }) => {
  const CardContent = () => (
    <article className="group/item cursor-pointer touch-manipulation">
      {/* Swiss Design Grid Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-6 sm:py-8 border-b border-neutral-200 dark:border-neutral-800 transition-opacity duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100">

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-black/80 group-has-hover:hover:text-black dark:text-white/80 dark:group-has-hover:hover:text-white font-medium transition-colors duration-300">
            {blog.title}
          </h2>
        </div>

        {/* Metadata */}
        <div className="shrink-0">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide transition-opacity duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100">
            {blog.readTime}
          </span>
        </div>

      </div>
    </article>
  )

  return (
    <a 
      href={blog.externalUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full touch-manipulation active:opacity-75"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <CardContent />
    </a>
  )
}
