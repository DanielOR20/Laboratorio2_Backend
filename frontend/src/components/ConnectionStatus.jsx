import { Wifi, WifiOff } from 'lucide-react'

const STATUS_CONFIG = {
  online: {
    label: 'API conectada',
    dot: 'bg-emerald-400',
    text: 'text-emerald-200',
    ring: 'ring-emerald-400/30 bg-emerald-400/10',
    Icon: Wifi,
  },
  offline: {
    label: 'API sin conexión',
    dot: 'bg-red-400',
    text: 'text-red-200',
    ring: 'ring-red-400/30 bg-red-400/10',
    Icon: WifiOff,
  },
  checking: {
    label: 'Conectando…',
    dot: 'bg-amber-glow',
    text: 'text-amber-100',
    ring: 'ring-amber-glow/30 bg-amber-glow/10',
    Icon: Wifi,
  },
}

export default function ConnectionStatus({ status }) {
  const { label, dot, text, ring, Icon } = STATUS_CONFIG[status]

  return (
    <div
      role="status"
      title={label}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${ring} ${text}`}
    >
      <span className="relative flex h-2 w-2">
        {status !== 'offline' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dot}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      <Icon className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
      <span className="hidden lg:inline">{label}</span>
    </div>
  )
}
