'use client';

import { Project } from '@/types/project'
import { MasonryProjectCard } from './MasonryProjectCard'
import { useMemo } from 'react'

interface MasonryGridProps {
  projects: Project[];
  className?: string;
}

export const MasonryGrid = ({ projects, className = "" }: MasonryGridProps) => {
  const displayedItems = projects;

  const columnData = useMemo(() => {
    const col1: Project[] = [];
    const col2: Project[] = [];

    displayedItems.forEach((project, index) => {
      const colIndex = index % 2;
      if (colIndex === 0) col1.push(project);
      else col2.push(project);
    });

    const mobileRemaining = [...col2];
    
    return { col1, col2, mobileRemaining };
  }, [displayedItems]);

  const { col1, col2, mobileRemaining } = columnData;

  return (
    <div className={`w-full ${className}`}>
      <div className="sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-3 sm:grid-cols-2 group">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 sm:gap-3">
            {col1.map((project) => (
              <div key={project.id}>
                <MasonryProjectCard project={project} />
              </div>
            ))}
          </div>
          
          {/* Column 2 - Hidden on mobile */}
          <div className="hidden sm:flex flex-col gap-3">
            {col2.map((project) => (
              <div key={project.id}>
                <MasonryProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile: Show remaining projects in single column */}
        <div className="sm:hidden flex flex-col gap-4 mt-4 group">
          {mobileRemaining.map((project) => (
            <div key={project.id}>
              <MasonryProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
