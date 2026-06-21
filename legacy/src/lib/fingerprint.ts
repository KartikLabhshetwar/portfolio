export function generateBrowserFingerprint(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Browser fingerprint', 2, 2)
  }
  
  const deviceMemory = 'deviceMemory' in navigator 
    ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0
    : 0

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
    deviceMemory,
    navigator.platform,
  ].join('|')

  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return Math.abs(hash).toString(36)
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const STORAGE_KEY = 'portfolio_visitor_id'
  let visitorId = localStorage.getItem(STORAGE_KEY)
  
  if (!visitorId) {
    visitorId = generateBrowserFingerprint()
    localStorage.setItem(STORAGE_KEY, visitorId)
  }
  
  return visitorId
}

