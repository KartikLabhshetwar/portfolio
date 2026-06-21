import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { trackVisit, generateVisitorId, getVisitorStats } from '@/lib/visitors'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const fingerprint = body.fingerprint as string | undefined
    
    const headersList = await headers()
    const userAgent = headersList.get('user-agent')
    const ip = getClientIP(request)
    
    const visitorId = generateVisitorId(ip, userAgent, fingerprint)
    const data = await trackVisit(visitorId)
    
    return NextResponse.json({
      success: true,
      uniqueVisitors: data.uniqueVisitors
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    
    try {
      const stats = await getVisitorStats()
      return NextResponse.json({
        success: true,
        ...stats
      })
    } catch {
      return NextResponse.json({
        success: false,
        uniqueVisitors: 0,
        error: 'Failed to track visitor'
      }, { status: 500 })
    }
  }
}

export async function GET() {
  try {
    const stats = await getVisitorStats()
    return NextResponse.json({
      success: true,
      ...stats
    })
  } catch {
    return NextResponse.json({
      success: false,
      uniqueVisitors: 0,
      error: 'Failed to get visitor stats'
    }, { status: 500 })
  }
}

