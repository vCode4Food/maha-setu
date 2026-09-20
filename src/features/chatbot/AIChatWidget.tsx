import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { MessageSquareText, X, SendHorizonal, Sparkles } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { aiAnswer } from './aiEngine'

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const { chat, pushChat, role } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [chat, typing])

  if (location.pathname === '/login' || role === 'super_admin') return null

  const send = (text: string) => {
    if (!text.trim()) return
    pushChat({ from: 'user', text })
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      const reply = aiAnswer(text, { userName: user?.name.split(' ')[0] })
      pushChat({ from: 'bot', text: reply.text, chips: reply.chips, link: reply.link })
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-[75] bg-slate-950/20 sm:bg-transparent" onClick={() => setOpen(false)} />}

      {open && (
        <div className="fixed z-[77] inset-x-3 bottom-3 top-16 sm:inset-auto sm:right-4 sm:bottom-4 sm:top-24 sm:w-[380px] bg-white rounded-3xl sm:rounded-2xl shadow-pop border border-slate-200 flex flex-col overflow-hidden animate-fadeUp">
          <div className="bg-primary-900 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-saffron-400" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">MahaSetu Sahayak</div>
              <div className="text-[11px] text-white/60">Grounded in your data · Demo assistant</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div ref={bodyRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-canvas">
            {chat.slice(-14).map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.from === 'user' ? 'bg-primary-900 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}`}>
                  {m.text}
                  {m.link && (
                    <button
                      onClick={() => { navigate(m.link!.to); setOpen(false) }}
                      className="mt-2 block text-xs font-semibold text-primary-700 hover:text-primary-900 bg-primary-50 border border-primary-100 rounded-lg px-2.5 py-1.5"
                    >
                      {m.link.label} →
                    </button>
                  )}
                  {m.chips && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.chips.map((c) => (
                        <button key={c} onClick={() => send(c)} className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-2.5 py-1">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, schemes, status…"
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Ask MahaSetu Sahayak"
            />
            <button type="submit" className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-800" aria-label="Send">
              <SendHorizonal className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-2xl bg-primary-900 text-white shadow-pop flex items-center justify-center z-[76] hover:bg-primary-800 transition-colors"
          aria-label="Open MahaSetu Sahayak assistant"
        >
          <MessageSquareText className="w-6 h-6" />
        </button>
      )}
    </>
  )
}
