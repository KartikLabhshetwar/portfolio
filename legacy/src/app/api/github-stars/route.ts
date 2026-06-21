import { NextRequest, NextResponse } from 'next/server'
import { fetchRepositoryStars } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner') || 'KartikLabhshetwar'
    const repo = searchParams.get('repo') || 'portfolio'
    
    const stars = await fetchRepositoryStars(owner, repo)
    
    return NextResponse.json({ 
      success: true, 
      stars
    })
  } catch {
    return NextResponse.json({ 
      success: false, 
      stars: 0
    }, { status: 500 })
  }
}

