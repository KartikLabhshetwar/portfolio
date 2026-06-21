'use client'

import { useEffect, useState } from 'react'
import { GitHubStars } from './github-stars'

export default function PortfolioStars() {
  const [starCount, setStarCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('/api/github-stars?owner=KartikLabhshetwar&repo=portfolio')
        const data = await response.json()
        
        if (data.success) {
          setStarCount(data.stars)
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [])

  if (loading || starCount === 0) {
    return null
  }

  return (
    <GitHubStars 
      repo="KartikLabhshetwar/portfolio" 
      stargazersCount={starCount} 
    />
  )
}

