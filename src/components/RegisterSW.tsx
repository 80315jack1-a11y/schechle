'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/schechle/sw.js').catch(() => {
        // SW registration failed, not critical
      })
    }
  }, [])

  return null
}
