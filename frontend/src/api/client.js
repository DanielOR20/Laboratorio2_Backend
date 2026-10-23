import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

/**
 * Error normalizado que el interceptor lanza para toda la aplicación.
 * Las vistas solo necesitan leer `message`, `status` y los flags booleanos.
 */
export class ApiError extends Error {
  constructor(message, { status = null, isNetworkError = false, data = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = isNetworkError
    this.isConflict = status === 409
    this.isValidation = status === 400
    this.isNotFound = status === 404
    this.data = data
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Sin respuesta: servidor caído, CORS o sin red
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED'
      return Promise.reject(
        new ApiError(
          isTimeout
            ? 'El servidor tardó demasiado en responder. Intenta nuevamente.'
            : 'No se pudo conectar con la API. Verifica que el backend esté corriendo en ' +
                API_BASE_URL,
          { isNetworkError: true },
        ),
      )
    }

    const { status, data } = error.response
    const backendMessage = data && typeof data === 'object' ? data.error : null

    const fallbackByStatus = {
      400: 'La solicitud contiene datos inválidos.',
      404: 'El recurso solicitado no existe.',
      409: 'Conflicto: la operación no pudo completarse por falta de stock.',
      500: 'Error interno del servidor. Intenta más tarde.',
    }

    return Promise.reject(
      new ApiError(backendMessage || fallbackByStatus[status] || `Error inesperado (${status}).`, {
        status,
        data,
      }),
    )
  },
)

export default apiClient
