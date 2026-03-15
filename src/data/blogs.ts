import { BlogPost } from '@/types/blog'

export const blogs: BlogPost[] = [
  {
    id: 'tts-system',
    title: 'Building a Text-to-Speech System for 25K Users (Without Melting a Server)',
    readTime: '11 min read',
    externalUrl: 'https://medium.com/@code_kartik/building-a-text-to-speech-system-for-25k-users-without-melting-a-server-78f9e21518cb'
  },
  {
    id: 'problem-solving',
    title: 'How I Choose Problems, Solve Them, and End Up Getting Traction',
    readTime: '4 min read',
    externalUrl: 'https://medium.com/@code_kartik/how-i-choose-problems-solve-them-and-end-up-getting-traction-89f259eadd4b'
  },
  {
    id: 'ssh-server-guide',
    title: 'How to SSH Into Your Server (The Right Way) A Beginner-Friendly Guide with Pro Tips',
    readTime: '3 min read',
    externalUrl: 'https://medium.com/@code_kartik/how-to-ssh-into-your-server-the-right-way-a-beginner-friendly-guide-with-pro-tips-cbd0e8855c9a'
  },
  {
    id: 'rag',
    title: 'What is RAG? Why you should learn it?',
    readTime: '6 min read',
    externalUrl: 'https://medium.com/@code_kartik/what-is-rag-why-you-should-learn-it-c9408f233086'
  }
]

export const getBlogById = (id: string): BlogPost | undefined => {
  return blogs.find(blog => blog.id === id)
}
