import { useState, useRef, useEffect } from 'react'
import {
  X,
  Send,
  Coffee,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import axios from 'axios'

const DEFAULT_WEBHOOK_URL =
  import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL ||
  'http://localhost:5678/webhook/ad055ef9-945f-4ce7-99cd-180e33dd64ca'

let messageCounter = 0
const createMessageId = (prefix) => `${prefix}_${++messageCounter}_${Date.now()}`
const getCurrentTimeString = () =>
  new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit' }).format(new Date())

const INITIAL_MESSAGE = {
  id: 'welcome',
  sender: 'barista',
  text: '¡Hola! ☕ Soy BaristaBot, tu asistente virtual de Café Aurora.\n\nPuedo recomendarte cafés de especialidad, explicarte los ingredientes de nuestras recetas o ayudarte a elegir según tu gusto. ¿En qué te puedo asesorar hoy?',
  time: 'Hoy',
}

const QUICK_SUGGESTIONS = [
  '¿Qué café de especialidad me recomiendas hoy?',
  '¿Tienen opciones frías con caramelo?',
  '¿Qué insumos lleva el Capuchino?',
  'Recomiéndame algo dulce de repostería',
]

/**
 * Formateador ligero para texto con negritas (**texto**), listas y saltos de línea.
 */
function FormattedText({ content = '' }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1" />
        }

        // Si es elemento de lista
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
        const textContent = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line

        // Parsear negritas **texto**
        const parts = textContent.split(/(\*\*.*?\*\*)/g)
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-amber-950">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return part
        })

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-amber-700 mt-1">•</span>
              <span>{rendered}</span>
            </div>
          )
        }

        return <p key={idx}>{rendered}</p>
      })}
    </div>
  )
}

export default function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sessionIdRef = useRef('session_aurora_default')

  useEffect(() => {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  }, [])

  // Scroll automático hacia el último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [messages, isOpen, isLoading])

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim()
    if (!text || isLoading) return

    const userMessage = {
      id: createMessageId('msg_user'),
      sender: 'user',
      text,
      time: getCurrentTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Petición al webhook de n8n con timeout de 35s
      const response = await axios.post(
        DEFAULT_WEBHOOK_URL,
        {
          chatInput: text,
          sessionId: sessionIdRef.current,
        },
        {
          timeout: 35000,
          headers: { 'Content-Type': 'application/json' },
        },
      )

      // Extraer respuesta del agente n8n
      let botResponse = ''
      if (response.data) {
        if (typeof response.data === 'string') {
          botResponse = response.data
        } else if (response.data.output) {
          botResponse = response.data.output
        } else if (response.data.text) {
          botResponse = response.data.text
        } else if (Array.isArray(response.data) && response.data[0]?.output) {
          botResponse = response.data[0].output
        } else {
          botResponse = JSON.stringify(response.data)
        }
      }

      const botMessage = {
        id: createMessageId('msg_bot'),
        sender: 'barista',
        text: botResponse || 'Disculpa, no pude procesar la respuesta. ¿Puedo ayudarte con otra consulta?',
        time: getCurrentTimeString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const isConnectionError = !error.response || error.code === 'ECONNABORTED'
      const errorMessage = {
        id: createMessageId('msg_err'),
        sender: 'barista',
        isError: true,
        text: isConnectionError
          ? '☕ No logré conectar con el servicio de IA de n8n (revisa que el webhook esté activo en ' +
            DEFAULT_WEBHOOK_URL +
            '). Mientras tanto, puedes explorar nuestro menú interactivo directamente.'
          : `Ocurrió un error al consultar con el barista (${error.response?.status || 'desconocido'}). Por favor intenta de nuevo.`,
        time: getCurrentTimeString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleResetChat = () => {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: createMessageId('welcome'),
        time: getCurrentTimeString(),
      },
    ])
  }

  return (
    <>
      {/* Botón Flotante del Barista IA */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Tooltip de sugerencia */}
        {showTooltip && !isOpen && (
          <div className="animate-fade-in hidden sm:block rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-lg">
            <span>✨ Habla con nuestro Barista IA</span>
          </div>
        )}

        <button
          type="button"
          id="barista-ia-trigger"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={isOpen ? 'Cerrar chat con Barista IA' : 'Abrir chat con Barista IA'}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white shadow-xl shadow-amber-900/30 transition-all duration-300 hover:scale-105 active:scale-95 ring-2 ring-white/50"
        >
          {isOpen ? (
            <ChevronDown className="h-6 w-6 stroke-[2.2] transition-transform duration-200" />
          ) : (
            <>
              <Coffee className="h-6 w-6 stroke-[2] transition-transform duration-200 group-hover:scale-110" />
              {/* Chispita animada */}
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-amber-400 ring-2 ring-white shadow-sm">
                <Sparkles className="h-3 w-3 animate-pulse" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Ventana de Chat Desplegable */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ventana de chat con Barista Virtual"
          className="fixed bottom-22 right-4 sm:right-6 z-50 flex h-[520px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] sm:w-96 animate-rise flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-2xl"
        >
          {/* Header del Chat */}
          <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 shadow-sm">
                <Coffee className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-stone-900" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold leading-tight">Barista Virtual</h3>
                <p className="flex items-center gap-1.5 text-[11px] text-stone-300 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En línea · Café Aurora IA</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reiniciar conversación"
                aria-label="Reiniciar conversación"
                className="rounded-full p-1.5 text-stone-300 transition hover:bg-stone-800 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                aria-label="Cerrar chat"
                className="rounded-full p-1.5 text-stone-300 transition hover:bg-stone-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="scrollbar-thin flex-1 space-y-3.5 overflow-y-auto p-4 bg-stone-50/60">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user'

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-rise`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-tr-xs'
                        : msg.isError
                          ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-xs'
                          : 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.isError ? (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <FormattedText content={msg.text} />
                      </div>
                    ) : (
                      <FormattedText content={msg.text} />
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-stone-400 font-medium">
                    {msg.time}
                  </span>
                </div>
              )
            })}

            {/* Animación: El barista está pensando */}
            {isLoading && (
              <div className="flex flex-col items-start animate-rise">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-amber-200/80 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900">
                  <Coffee className="h-3.5 w-3.5 text-amber-700 animate-spin" />
                  <span className="font-medium">El barista está pensando…</span>
                </div>
              </div>
            )}

            {/* Sugerencias rápidas si hay pocos mensajes */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Sugerencias rápidas:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSendMessage(suggestion)}
                      className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-left text-[11px] font-medium text-stone-700 transition hover:border-amber-600 hover:bg-amber-50/80 hover:text-amber-950 active:scale-95 shadow-2xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="border-t border-stone-200 bg-white p-3"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta al barista…"
                disabled={isLoading}
                aria-label="Mensaje para el Barista IA"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-2.5 pr-12 pl-3.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-600/10 focus:outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Enviar mensaje"
                className="absolute right-1.5 grid h-8 w-8 place-items-center rounded-xl bg-stone-900 text-white transition hover:bg-amber-800 disabled:opacity-30 disabled:hover:bg-stone-900 active:scale-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-center text-[10px] text-stone-400">
              Presiona Enter para enviar · Barista IA de Café Aurora
            </p>
          </form>
        </div>
      )}
    </>
  )
}
