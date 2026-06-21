'use client'

import { useEffect, useState } from 'react'
import { getOrCreateVisitorId } from '@/lib/fingerprint'

interface VisitorStats {
  uniqueVisitors: number
}

export function VisitorCount({ className }: { className?: string }) {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function trackAndFetchStats() {
      try {
        const fingerprint = getOrCreateVisitorId()
        
        await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fingerprint }),
          cache: 'no-store'
        })
        
        const response = await fetch('/api/visitors', {
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          setStats({
            uniqueVisitors: data.uniqueVisitors || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch visitor stats:', error)
      } finally {
        setLoading(false)
      }
    }

    trackAndFetchStats()
  }, [])

  if (loading) {
    return null
  }

  if (!stats) {
    return null
  }

  return (
    <div className={className}>
      <span className="font-medium">{stats.uniqueVisitors.toLocaleString()}</span> visitors
    </div>
  )
}

