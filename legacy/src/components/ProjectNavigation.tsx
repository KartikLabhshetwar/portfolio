'use client';

import { Project } from '@/types/project';
import Link from 'next/link';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ProjectNavigationProps {
  currentProject: Project;
  allProjects: Project[];
}

export const ProjectNavigation = ({ currentProject, allProjects }: ProjectNavigationProps) => {
  const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
  
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  if (!previousProject && !nextProject) {
    return null;
  }

  return (
    <div className="w-full border-t border-neutral-300 dark:border-neutral-700 pt-6 sm:pt-8 mt-6 sm:mt-8">
      <div className="flex items-end justify-between">
        {previousProject ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/projects/${previousProject.id}`}
                className="group flex flex-col items-start touch-manipulation active:opacity-75"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  Previous
                </span>
                <span className="text-base sm:text-lg md:text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {previousProject.title}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              View previous project
            </TooltipContent>
          </Tooltip>
        ) : (
          <div />
        )}

        {nextProject && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/projects/${nextProject.id}`}
                className="group flex flex-col items-end touch-manipulation active:opacity-75"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  Next
                </span>
                <span className="text-base sm:text-lg md:text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {nextProject.title}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              View next project
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

