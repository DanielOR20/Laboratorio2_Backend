import { LoaderCircle } from 'lucide-react'

export default function Spinner({ className = 'h-5 w-5', label = 'Cargando' }) {
  return (
    <LoaderCircle
      className={`animate-spin ${className}`}
      role="status"
      aria-label={label}
    />
  )
}
