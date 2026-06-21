import { FC } from 'react'
import { BlogPost } from '@/types/blog'
import ReactMarkdown from 'react-markdown'

interface BlogContentProps {
  blog: BlogPost
}

export const BlogContent: FC<BlogContentProps> = ({ blog }) => {
  return (
    <article className="prose prose-neutral dark:prose-invert prose-headings:font-medium max-w-none">
      <header className="mb-6 sm:mb-8 md:mb-12 not-prose">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-3 sm:mb-4 md:mb-6 break-words">{blog.title}</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-neutral-500 dark:text-neutral-400 gap-2 sm:gap-3 md:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            {blog.date && <span className="text-xs sm:text-sm md:text-base">{blog.date}</span>}
            <span className="text-xs sm:text-sm md:text-base">{blog.readTime}</span>
          </div>
          {blog.author && <span className="text-xs sm:text-sm md:text-base">{blog.author}</span>}
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 md:mt-6">
            {blog.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full text-xs whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {blog.content && (
        <div className="content prose-sm sm:prose-base md:prose-lg">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 sm:mb-4 leading-relaxed">{children}</p>,
              h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-semibold mt-5 sm:mt-6 mb-2 sm:mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg sm:text-xl font-medium mt-3 sm:mt-4 mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      )}
      {blog.externalUrl && (
        <div className="mt-6 sm:mt-8 md:mt-12">
          <a 
            href={blog.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
          >
            Read full article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </article>
  )
}
