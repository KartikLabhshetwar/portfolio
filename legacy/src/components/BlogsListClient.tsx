'use client'

import { BlogCard } from '@/components/BlogCard'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import { BlogPost } from '@/types/blog'

interface BlogsListClientProps {
  blogs: BlogPost[]
}

export default function BlogsListClient({ blogs }: BlogsListClientProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl min-h-screen">
        <DiagonalPattern side="left" topOffset="0" />
        <DiagonalPattern side="right" topOffset="0" />
        
        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-base">
              <FadeIn delay={0.1} duration={0.5}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 pt-4 sm:pt-6">
                    <div className="mb-4 sm:mb-6">
                      <PageNavigation />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Blogs
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 tracking-wide">
                      Technical writings and thoughts
                    </p>
                  </div>
                </div>
              </FadeIn>
              
              <div className="sm:px-12 py-2">
                <div className="px-4">
                  {blogs.length > 0 ? (
                    <div className="space-y-0 group">
                      {blogs.map((blog, index) => (
                        <FadeIn key={blog.id} delay={0.3 + index * 0.05}>
                          <BlogCard blog={blog} />
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <FadeIn delay={0.3} duration={0.5}>
                      <div className="text-center py-16 sm:py-20">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Coming soon
                        </p>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </div>
              <div className="pb-24 sm:pb-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}