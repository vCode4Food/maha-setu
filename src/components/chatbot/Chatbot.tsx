import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, X, Send, Search, Car, MapPin, ClipboardCheck } from 'lucide-react';
import {
  createMessage,
  getAssistantResponse,
  getContextualHint,
  quickPrompts,
  type ChatMessage,
} from '../../services/mockChatbot';
import type { ChatAction } from '../../data/chatbot';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

const promptIcons: Record<string, typeof Search> = {
  'chat.find': Search, 'chat.car': Car, 'chat.address': MapPin, 'chat.track': ClipboardCheck,
};

export function Chatbot() {
  const { language } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const hint = getContextualHint(location.pathname, undefined, language);
      const welcome = createMessage(
        'assistant',
        hint || t('chat.welcome', language)
      );
      setMessages([welcome]);
    }
  }, [open, location.pathname, messages.length, language]);

  const handleAction = useCallback(
    (action: ChatAction) => {
      if (action.type === 'navigate' && action.target) {
        navigate(action.target);
        setOpen(false);
      } else if (action.type === 'scroll' && action.target) {
        setOpen(false);
        setTimeout(() => {
          document.getElementById(action.target!)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    },
    [navigate]
  );

  const handleSend = useCallback(
    (text?: string) => {
      const userText = (text ?? input).trim();
      if (!userText) return;

      const userMsg = createMessage('user', userText);
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      setTimeout(() => {
        const response = getAssistantResponse(userText, language);
        const assistantMsg = createMessage('assistant', response.content, response.actions);
        setMessages((prev) => [...prev, assistantMsg]);
        setTyping(false);
      }, 400 + Math.random() * 300);
    },
    [input, language]
  );

  return (
    <>
      <button
        type="button"
        className={`chatbot-fab ${open ? 'chatbot-fab-hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={t('chat.open', language)}
        aria-expanded={open}
        title={t('chat.ask', language)}
      >
        <Bot size={20} strokeWidth={1.8} />
        <span className="chatbot-fab-label">{t('chat.ask', language)}</span>
        <span className="chatbot-fab-dot" aria-hidden="true" />
      </button>

      {open && (
        <>
          <div className="chatbot-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="chatbot-panel" role="dialog" aria-label={t('chat.title', language)}>
            <header className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="chatbot-title">{t('chat.title', language)}</h2>
                  <p className="chatbot-subtitle">{t('chat.subtitle', language)}</p>
                </div>
              </div>
              <button
                type="button"
                className="chatbot-close"
                onClick={() => setOpen(false)}
                aria-label={t('chat.close', language)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chatbot-message chatbot-message-${msg.role}`}>
                  <div className="chatbot-bubble">{msg.content}</div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="chatbot-actions">
                      {msg.actions.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          className="chatbot-action-btn"
                          onClick={() => handleAction(action)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="chatbot-message chatbot-message-assistant">
                  <div className="chatbot-bubble chatbot-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="chatbot-quick-prompts">
                {quickPrompts.map((prompt) => {
                  const Icon = promptIcons[prompt] ?? Search;
                  return (
                    <button
                      key={prompt}
                      type="button"
                      className="chatbot-quick-btn"
                      onClick={() => handleSend(t(prompt, language))}
                    >
                      <Icon size={14} /> {t(prompt, language)}
                    </button>
                  );
                })}
              </div>
            )}

            <form
              className="chatbot-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="chatbot-input"
                placeholder={t('chat.placeholder', language)}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label={t('chat.message', language)}
              />
              <button type="submit" className="chatbot-send" disabled={!input.trim()} aria-label={t('chat.send', language)}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
