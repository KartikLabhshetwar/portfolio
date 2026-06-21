'use client'

import { ProjectCard } from '@/components/ProjectCard'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import { FadeInUp } from '@/components/ui/PageTransitions'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import { Project } from '@/types/project'

interface ProjectDetailClientProps {
  project: Project;
  allProjects: Project[];
}

export default function ProjectDetailClient({ project, allProjects }: ProjectDetailClientProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl">
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
                    <ProjectCard project={project} isDetailed allProjects={allProjects} />
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
