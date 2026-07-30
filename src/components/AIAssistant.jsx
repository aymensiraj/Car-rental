import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const GROQ_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function AIAssistant() {
  const { currentRole } = useAuth();
  const { cars } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Bonjour! 👋 Dites-moi ce que vous cherchez et je trouve la voiture parfaite pour vous.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ الـ check بعد كل الـ hooks
  if (currentRole !== 'user' && currentRole !== null) return null;

  const buildPrompt = (userMessage) => {
    const carsInfo = cars.map(c =>
      `- ${c.brand} ${c.model} | ${c.category} | ${c.price_per_day} MAD/j | ${c.transmission} | ${c.fuel_type} | ${c.agency_name} | ${c.is_available ? 'Disponible' : 'Indisponible'}`
    ).join('\n');

    return `Tu es un assistant expert en location de voitures pour CarRental Maroc. Tu parles français naturellement et comprends le darija marocain.

Voitures disponibles:
${carsInfo}

Règles:
- Réponds en 2-3 phrases maximum
- Si on cherche une voiture, recommande depuis la liste uniquement
- Sois naturel et chaleureux
- En darija: réponds en darija/français mélangé

Message: ${userMessage}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: buildPrompt(userMsg) }],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "Désolé, réessayez.";
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Erreur de connexion. Réessayez." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '60px', height: '60px',
          background: open ? '#1e293b' : 'linear-gradient(135deg, #ea580c, #c2410c)',
          border: 'none', borderRadius: '50%',
          boxShadow: '0 8px 32px rgba(234,88,12,0.4), 0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={24} color="white" />}
        {!open && messages.length > 1 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '18px', height: '18px', background: '#22c55e',
            borderRadius: '50%', border: '2px solid white',
            fontSize: '9px', color: 'white', fontWeight: '900',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 9998,
          width: '360px', maxHeight: '560px',
          background: 'white', borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234,88,12,0.4)',
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'white', fontWeight: '800', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Assistant CarRental
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  En ligne · IA
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: 'white' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            background: '#f8fafc', maxHeight: '380px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: '8px',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1e293b',
                  fontSize: '13px', lineHeight: '1.5', fontWeight: '500',
                  boxShadow: msg.role === 'user' ? '0 4px 12px rgba(234,88,12,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{
                  padding: '12px 16px', background: 'white', borderRadius: '18px 18px 18px 4px',
                  border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 150, 300].map(delay => (
                    <span key={delay} style={{
                      width: '6px', height: '6px', background: '#ea580c',
                      borderRadius: '50%', display: 'inline-block',
                      animation: `bounce 1s ${delay}ms infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cherchez une voiture..."
                rows={1}
                style={{
                  flex: 1, resize: 'none', border: '1.5px solid #e2e8f0',
                  borderRadius: '14px', padding: '10px 14px',
                  fontSize: '13px', fontFamily: 'inherit', color: '#1e293b',
                  background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#ea580c'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  background: input.trim() && !loading ? 'linear-gradient(135deg, #ea580c, #c2410c)' : '#e2e8f0',
                  border: 'none', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() && !loading ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}
              >
                <Send size={16} color={input.trim() && !loading ? 'white' : '#94a3b8'} />
              </button>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '10px', color: '#94a3b8', textAlign: 'center', fontWeight: '600', letterSpacing: '0.05em' }}>
              POWERED BY GROQ AI · CARRENTAL
            </p>
          </div>
        </div>
      )}
    </>
  );
}