'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Bot,
  User,
} from 'lucide-react';
import chatScenarios from '@/data/chat-scenarios.json';

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Lightbulb: <Lightbulb size={20} />,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scenario = chatScenarios.find((s) => s.id === selectedScenario);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isTyping]);

  const startScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const sc = chatScenarios.find((s) => s.id === scenarioId);
    if (sc && sc.messages.length > 0) {
      setVisibleMessages([]);
      setCurrentIndex(0);
      // Show first message with typing animation
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages([sc.messages[0] as Message]);
        setCurrentIndex(1);
      }, 1000);
    }
  };

  const sendNextMessage = () => {
    if (!scenario) return;
    const remaining = scenario.messages.slice(currentIndex);
    if (remaining.length === 0) return;

    // Show user message immediately
    const userMsg = remaining[0] as Message;
    setVisibleMessages((prev) => [...prev, userMsg]);
    setCurrentIndex((prev) => prev + 1);
    setInputValue('');

    // Show assistant response with delay
    if (remaining.length > 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const assistantMsg = remaining[1] as Message;
        setVisibleMessages((prev) => [...prev, assistantMsg]);
        setCurrentIndex((prev) => prev + 1);
      }, 1500);
    }
  };

  const getNextUserMessage = () => {
    if (!scenario) return '';
    const next = scenario.messages[currentIndex];
    if (next && next.role === 'user') return next.content;
    return '';
  };

  if (!selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--neutral-800)]">AI-Assistent</h1>
          <p className="text-[var(--neutral-200)] mt-1">Wähle ein Szenario, um eine Konversation zu starten.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {chatScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc.id)}
              className="bg-white rounded-xl border border-[var(--neutral-30)] p-6 text-left hover:border-[var(--primary)] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {iconMap[sc.icon] || <Sparkles size={20} />}
              </div>
              <h3 className="font-semibold text-[var(--neutral-800)] mb-1">{sc.title}</h3>
              <p className="text-sm text-[var(--neutral-200)]">{sc.description}</p>
              <div className="mt-3 text-xs text-[var(--primary)] font-medium">
                {sc.messages.length} Nachrichten · Demo starten →
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Chat Header */}
      <div className="bg-white rounded-t-xl border border-[var(--neutral-30)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-semibold text-sm text-[var(--neutral-800)]">{scenario?.title}</div>
            <div className="text-xs text-[var(--neutral-100)]">AI-Assistent · Simuliertes Szenario</div>
          </div>
        </div>
        <button
          onClick={() => { setSelectedScenario(null); setVisibleMessages([]); setCurrentIndex(0); }}
          className="text-sm text-[var(--neutral-200)] hover:text-[var(--neutral-800)] px-3 py-1.5 rounded-lg hover:bg-[var(--neutral-20)] transition-colors"
        >
          Szenario wechseln
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-[var(--neutral-10)] border-x border-[var(--neutral-30)] overflow-y-auto px-6 py-4 space-y-4">
        {visibleMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white'
                : 'bg-[var(--primary)] text-white'
            }`}>
              {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
            </div>
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'assistant'
                  ? 'bg-white border border-[var(--neutral-30)] text-[var(--neutral-800)] rounded-tl-sm'
                  : 'bg-[var(--primary)] text-white rounded-tr-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A7075] to-[#14919B] text-white flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-white border border-[var(--neutral-30)] px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--neutral-100)] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[var(--neutral-100)] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[var(--neutral-100)] typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-xl border border-[var(--neutral-30)] border-t-0 px-6 py-4">
        {getNextUserMessage() ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue || getNextUserMessage()}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => !inputValue && setInputValue(getNextUserMessage())}
                placeholder="Nachricht eingeben..."
                className="w-full px-4 py-3 bg-[var(--neutral-20)] rounded-xl text-sm border border-transparent focus:border-[var(--primary)] focus:bg-white focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && sendNextMessage()}
              />
            </div>
            <button
              onClick={sendNextMessage}
              className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center hover:bg-[#013438] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-[var(--neutral-100)]">
              Demo-Szenario beendet.{' '}
              <button
                onClick={() => { setSelectedScenario(null); setVisibleMessages([]); setCurrentIndex(0); }}
                className="text-[var(--primary)] hover:underline"
              >
                Neues Szenario starten
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
