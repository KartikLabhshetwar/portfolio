'use client'

import Link from 'next/link'
import DiagonalPattern from './DiagonalPattern'
import BannerSection from './BannerSection'
import ProfileHeader from './ProfileHeader'
import ContentSection from './ContentSection'
import ContentParagraph from './ContentParagraph'
import SectionBorder from './SectionBorder'
import ExperienceContent from './ExperienceContent'
import Reachout from './Reachout'
import CallToAction from './CallToAction'
import ContributionsDisplay from './ContributionsDisplay'
import OpenSourceContributionsCard from './ContributionCard'
import TechStackMarquee from './TechStackMarquee'
import { Reveal } from './Reveal'
import { projects } from '@/data/projects'
import { MasonryProjectCard } from './MasonryProjectCard'
import { blogs } from '@/data/blogs'
import { BlogCard } from './BlogCard'
import { sponsors } from '@/data/sponsors'
import SponsorShowcase from './SponsorShowcase'
import SponsorButton from './SponsorButton'

export default function NewHeroSection() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <div className="relative mx-auto max-w-4xl">
        {/* Diagonal Patterns */}
        <DiagonalPattern side="left" />
        <DiagonalPattern side="right" />
        
        {/* Main Content */}
        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          {/* Banner Section */}
          <Reveal delay={0.1}>
            <BannerSection 
              bannerImage="/banner.jpg"
              quote="You make your own luck if you stay at it long enough."
            />
          </Reveal>
          
          {/* Profile Header */}
          <Reveal delay={0.2}>
            <ProfileHeader 
              name="Shivam Singh"
              age="22"
              title="AI Engineer • Multi-Agent Systems • Production ML"
              profileImage="/pfp.jpg"
              socialLinks={{
                twitter: "https://x.com/shivam909058",
                github: "https://github.com/Shivam909058",
                linkedin: "https://linkedin.com/in/shivam-singh-94835224a",
                resume: "https://drive.google.com/file/d/1U8450r8Qsf9Xo1IcQhMdSrdzFY2__JXP/view?usp=sharing",
              }}
            />
          </Reveal>
          
          {/* Content Prose */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-base">
              {/* Current Role Section */}
              <Reveal delay={0.1}>
                <ContentSection
                  subtitle="AI Engineer | Multi-Agent Systems | Production ML"
                  title=''
                  className="mt-6"
                >
                  <div></div>
                </ContentSection>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-6" />
              </Reveal>
              
              {/* About Section */}
              <Reveal delay={0.1}>
                <ContentSection className="pb-6 sm:pb-8 pt-4 sm:pt-6 px-2 sm:px-0">
                  <ContentParagraph className="mb-2 text-base sm:text-lg">
                    <span className="font-medium dark:text-white text-black">AI Engineer specializing in multi-agent systems and production ML.</span> I architect intelligent systems that process complex data sources, optimize RAG pipelines, and scale to handle thousands of concurrent users. From parallel agent architectures to financial intelligence platforms, I build AI solutions that deliver real-world impact with 95%+ accuracy and 90%+ uptime.
                  </ContentParagraph>
                </ContentSection>
              </Reveal>

              <Reveal delay={0.05}>
                <SectionBorder className="mt-6" />
              </Reveal>

               {/* Experience Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <h2 className="text-base sm:text-xl mb-3 opacity-20 mt-4 sm:mt-6 px-4 font-[family-name:var(--font-instrument-serif)]">Professional Experience</h2>
                  <div className="px-4">
                    <ExperienceContent />
                  </div>
                </div>
              </Reveal>

                <Reveal delay={0.05}>
                  <SectionBorder className="mt-4" />
                </Reveal>
              
                 {/* Proof of Work */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">Proof of Work</h2>
                  </div>
                  <div className="px-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-3 sm:grid-cols-2 group">
                      {projects.slice(0, 6).map((project) => (
                        <MasonryProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 flex justify-end mt-6 sm:mt-8 mb-4 sm:mb-6">
                    <Link 
                      href="/projects"
                      className="text-xs sm:text-sm text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1"
                    >
                      View All
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>

              {/* Thoughts Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">Thoughts</h2>
                  </div>
                  <div className="px-4">
                    <div className="space-y-0 group">
                      {blogs.slice(0, 3).map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 flex justify-end mt-6 sm:mt-8 mb-4 sm:mb-6">
                    <Link 
                      href="/blogs"
                      className="text-xs sm:text-sm text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1"
                    >
                      View All
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Sponsors Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6 flex items-center justify-between">
                    <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">Sponsors</h2>
                    <SponsorButton 
                      href="https://github.com/sponsors/Shivam909058"
                      tooltipText="Support my open source work"
                    />
                  </div>
                  <div className="px-4 mb-4 sm:mb-6">
                    <SponsorShowcase sponsors={sponsors} />
                  </div>
                  <div className="px-4 flex justify-end mt-6 sm:mt-8 mb-4 sm:mb-6">
                    <Link 
                      href="/sponsors"
                      className="text-xs sm:text-sm text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1"
                    >
                      View All
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* GitHub Contributions */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 px-0 mt-4">
                  <h2 className="text-base font-[family-name:var(--font-instrument-serif)] sm:text-xl opacity-20 leading-relaxed -tracking-[0.01em] mb-4 px-4">
                    GitHub Contributions <span className="opacity-20">●</span> @Shivam909058
                  </h2>
                  <div className="mb-4 sm:mb-6">
                    <ContributionsDisplay
                      username="Shivam909058"
                      variant="compact"
                      className="w-full"
                    />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Tech Stack Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 mt-4 sm:mt-6 mb-4 sm:mb-6">
                  <div className="px-4">
                    <TechStackMarquee className="w-full" />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Open Source Contributions Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 mt-4">
                  <h2 className="text-base font-[family-name:var(--font-instrument-serif)] sm:text-xl opacity-20 mt-4 sm:mt-8 sm:ml-5 leading-relaxed -tracking-[0.01em] mb-4 px-4">
                    Open Source Contributions <span className="opacity-20">●</span> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="px-4">
                    <OpenSourceContributionsCard />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-4 pt-0" />
              </Reveal>

              {/* call to action*/}
              <Reveal delay={0.1}>
                <div className="px-4 sm:px-0">
                  <CallToAction/>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Reachout Section */}
              <Reveal delay={0.1}>
                <div className="mt-4 sm:mt-6">
                  <Reachout 
                    title="Let's connect"
                    subtitle="Find me on these platforms"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
