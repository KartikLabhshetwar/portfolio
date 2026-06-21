import { NextRequest, NextResponse } from 'next/server'
import { fetchUserPullRequests } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'KartikLabhshetwar'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const contributions = await fetchUserPullRequests(username, limit)
    
    return NextResponse.json({ 
      success: true, 
      contributions,
      count: contributions.length 
    })
  } catch {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch contributions',
      contributions: []
    }, { status: 500 })
  }
}
