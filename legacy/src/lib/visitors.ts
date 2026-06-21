import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const UNIQUE_VISITORS_SET = 'visitors:unique'

export interface VisitorData {
  uniqueVisitors: number
}

export function generateVisitorId(ip: string | null, userAgent: string | null, fingerprint?: string): string {
  if (fingerprint) {
    return `fp:${fingerprint}`
  }
  
  const ipPart = ip || 'unknown'
  const uaPart = userAgent || 'unknown'
  return Buffer.from(`${ipPart}-${uaPart}`).toString('base64').slice(0, 32)
}

async function getStats(): Promise<VisitorData> {
  const uniqueCount = await redis.scard(UNIQUE_VISITORS_SET)
  return { uniqueVisitors: uniqueCount }
}

export async function trackVisit(visitorId: string): Promise<VisitorData> {
  await redis.sadd(UNIQUE_VISITORS_SET, visitorId)
  const uniqueCount = await redis.scard(UNIQUE_VISITORS_SET)
  
  return { uniqueVisitors: uniqueCount }
}

export async function getVisitorStats(): Promise<{ uniqueVisitors: number }> {
  return await getStats()
}

