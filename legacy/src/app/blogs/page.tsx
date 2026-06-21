import { blogs } from '@/data/blogs'
import BlogsListClient from '@/components/BlogsListClient'

export default function BlogsPage() {
  return <BlogsListClient blogs={blogs} />
}