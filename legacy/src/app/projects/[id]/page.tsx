import { getProjectById, getAllProjects } from '@/data/projects'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProjectDetailClient from '@/components/ProjectDetailClient'

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = getProjectById(id)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  
  return {
    title: `${project.title} | Kartik Labhshetwar`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
    }
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = getProjectById(id)
  const allProjects = getAllProjects()
  
  if (!project) {
    notFound()
  }
  
  return <ProjectDetailClient project={project} allProjects={allProjects} />
}
