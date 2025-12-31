import { projects } from '@/data/projects'
import ProjectsListClient from '@/components/ProjectsListClient'

export const metadata = {
  title: 'Projects | Shivam Singh',
  description: 'Showcase of AI projects: multi-agent systems, RAG pipelines, and GPU compute platforms',
}

export default function ProjectsPage() {
  return <ProjectsListClient projects={projects} />
}
