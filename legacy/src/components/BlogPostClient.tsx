'use client'

import { BlogContent } from '@/components/BlogContent'
import OnekoCat from '@/components/OnekoCat'
import PageNavigation from '@/components/Navigation'
import DiagonalPattern from '@/components/DiagonalPattern'
import FadeIn from '@/components/FadeIn'
import { BlogPost } from '@/types/blog'
import { FadeInUp } from '@/components/ui/PageTransitions'

interface BlogPostClientProps {
  blog: BlogPost
}

export default function BlogPostClient({ blog }: BlogPostClientProps) {
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
                  </div>
                </div>
              </FadeIn>
              <FadeInUp delay={0.4}>
                <div className="sm:px-12 py-2">
                  <div className="px-4">
                    <BlogContent blog={blog} />
                  </div>
                </div>
              </FadeInUp>
              <div className="pb-16 sm:pb-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}