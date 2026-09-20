import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SendHorizonal, Sparkles, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { aiAnswer } from '@/features/chatbot/aiEngine'

const QUICK = [
  'What schemes am I eligible for?',
  'I want to start a business.',
  'How do I apply for an income certificate?',
  'Why is my application pending?',
  'What documents do I need?',
  'How does consent work?',
]

export default function CitizenAI() {
  const { chat, pushChat, resetChat } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [chat, typing])

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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary-900 flex items-center justify-center"><Sparkles className="w-5 h-5 text-saffron-400" /></span>
            MahaSetu Sahayak
          </h1>
          <p className="text-slate-500 mt-1.5">Grounded in your applications, vault and consents. Rule-based demo assistant — no external AI services.</p>
        </div>
        <button onClick={resetChat} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
          <RotateCcw className="w-4 h-4" /> Reset conversation
        </button>
      </div>

      <Card className="flex flex-col h-[540px]">
        <div ref={bodyRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3.5 bg-canvas rounded-t-2.5xl">
          {chat.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.from === 'user' ? 'bg-primary-900 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}`}>
                {m.text}
                {m.link && (
                  <button onClick={() => navigate(m.link!.to)} className="mt-2.5 block text-xs font-semibold text-primary-700 hover:text-primary-900 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2">
                    {m.link.label} →
                  </button>
                )}
                {m.chips && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.chips.map((c) => (
                      <button key={c} onClick={() => send(c)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-3 py-1.5">{c}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}
            </div></div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 bg-white rounded-b-2.5xl">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {QUICK.map((q) => <button key={q} onClick={() => send(q)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-3 py-1.5">{q}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about services, schemes, documents, status…" className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Ask MahaSetu Sahayak" />
            <button type="submit" className="w-11 h-11 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-800" aria-label="Send"><SendHorizonal className="w-4.5 h-4.5" /></button>
          </form>
        </div>
      </Card>
    </div>
  )
}
