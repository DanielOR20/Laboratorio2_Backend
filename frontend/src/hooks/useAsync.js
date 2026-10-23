import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook genérico para cargar datos asíncronos.
 * - Evita setState tras desmontar o con respuestas obsoletas (race conditions).
 * - `reload()` permite refrescos manuales y devuelve una promesa.
 *
 * @param {() => Promise<any>} fetcher función estable (envuelta en useCallback o definida a nivel módulo)
 */
export function useAsync(fetcher) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const requestId = useRef(0)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (!mounted.current || currentRequest !== requestId.current) return
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      if (!mounted.current || currentRequest !== requestId.current) return
      setError(err)
    } finally {
      if (mounted.current && currentRequest === requestId.current) setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  return { data, error, loading, lastUpdated, reload: load }
}
