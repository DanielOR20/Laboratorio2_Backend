import { useEffect, useState } from 'react'
import { checkHealth } from '../api/cafeteriaApi'

/**
 * Consulta periódicamente GET /api/health.
 * status: 'checking' | 'online' | 'offline'
 */
export function useApiHealth(intervalMs = 15000) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true

    const ping = async () => {
      const ok = await checkHealth()
      if (active) setStatus(ok ? 'online' : 'offline')
    }

    ping()
    const timer = window.setInterval(ping, intervalMs)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [intervalMs])

  return status
}
