import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MapPin, Navigation2, Bot, User, ArrowRight } from 'lucide-react';
import { askCampusAi, type AiResponse, type AiAction } from '../utils/aiEngine';
import { formatDistance, type LatLng } from '../utils/routing';
import { CATEGORY_META, type CampusCategory, type CampusLocation } from '../data/campusData';
import { getIcon } from '../utils/icons';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedLocations?: { location: CampusLocation; distance: number }[];
  action?: AiAction;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userLocation: LatLng;
  onSelectLocation: (loc: CampusLocation) => void;
  onRouteToLocation: (loc: CampusLocation) => void;
  onFilterCategory: (cat: CampusCategory) => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  'Where can I eat lunch right now?',
  'Directions to Technical Hub',
  'Quiet study zone with AC',
  'Where is Sri Hanuman Temple?',
  'Outdoor sports and stadium',
  'Nearest ATM & cash point',
  'Urgent 24/7 medical help',
];

export default function CampusAiModal({
  isOpen,
  onClose,
  userLocation,
  onSelectLocation,
  onRouteToLocation,
  onFilterCategory,
  initialPrompt,
}: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your **Aditya AI Campus Copilot**. Ask me anything about our 180-acre Surampalem campus — including finding Bhavans, labs, canteens, hostels, or real-time walking directions.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (typeof initialPrompt === 'string' && initialPrompt.trim().length > 0) {
        handleSend(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText ?? input;
    if (!textToSend || textToSend.trim().length === 0 || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response: AiResponse = await askCampusAi(textToSend, userLocation);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        recommendedLocations: response.recommendedLocations,
        action: response.action,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I apologize, but I could not retrieve that information right now. Please try asking about a specific building, canteen, or lab.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (action?: AiAction) => {
    if (!action) return;
    if (action.type === 'route' && action.targetLocation) {
      onRouteToLocation(action.targetLocation);
      onClose();
    } else if (action.type === 'select' && action.targetLocation) {
      onSelectLocation(action.targetLocation);
      onClose();
    } else if (action.type === 'filter' && action.category) {
      onFilterCategory(action.category);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-strong relative flex flex-col w-full max-w-2xl h-[85vh] max-h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-brand-200/80 dark:border-brand-800/80 bg-white/95 dark:bg-[#071326]/95">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-brand-800/70 bg-slate-50/50 dark:bg-brand-950/40">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-accent-500 to-amber-400 flex items-center justify-center text-white shadow-cta">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-extrabold text-brand-900 dark:text-white">
                  Aditya AI Campus Copilot
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Natural language map assistant · 58 Verified Zones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-btn h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close AI Copilot"
          >
            <X size={17} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-7 w-7 rounded-xl bg-accent-500/15 text-accent-600 dark:text-accent-400 shrink-0 flex items-center justify-center mt-1 border border-accent-500/30">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-accent-500 text-white shadow-cta rounded-tr-none'
                    : 'glass-panel border border-slate-200/80 dark:border-brand-800/60 bg-white dark:bg-campus-cardDark/90 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line prose-sm dark:prose-invert">
                  {m.text}
                </div>

                {/* Primary Action Button */}
                {m.action && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-brand-800/50">
                    <button
                      onClick={() => executeAction(m.action)}
                      className="btn-accent inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-cta"
                    >
                      {m.action.type === 'route' ? <Navigation2 size={13} /> : <MapPin size={13} />}
                      <span>{m.action.label ?? 'Execute Action'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {/* Recommended Places Mini-Cards */}
                {m.recommendedLocations && m.recommendedLocations.length > 0 && (
                  <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-200/60 dark:border-brand-800/50">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Recommended Locations
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.recommendedLocations.map(({ location, distance }) => {
                        const Icon = getIcon(location.icon);
                        return (
                          <div
                            key={location.id}
                            className="rounded-xl border border-slate-200/80 dark:border-brand-800/60 bg-slate-50/70 dark:bg-brand-950/50 p-2.5 flex flex-col justify-between gap-2 hover:border-accent-500/50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs"
                                style={{ backgroundColor: location.color === '#0B2D6B' ? '#F5821F' : location.color }}
                              >
                                <Icon size={14} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-heading text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {location.name}
                                </p>
                                <p className="text-[10px] text-accent-600 dark:text-accent-400 font-semibold">
                                  {formatDistance(distance)} away · {CATEGORY_META[location.category].label}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/50 dark:border-white/10">
                              <button
                                onClick={() => {
                                  onSelectLocation(location);
                                  onClose();
                                }}
                                className="flex-1 py-1 px-1.5 rounded-lg text-[10.5px] font-bold text-center bg-white dark:bg-brand-900/60 text-slate-700 dark:text-slate-200 hover:bg-brand-50 border border-slate-200/60 dark:border-brand-800/40"
                              >
                                Map
                              </button>
                              <button
                                onClick={() => {
                                  onRouteToLocation(location);
                                  onClose();
                                }}
                                className="flex-1 py-1 px-1.5 rounded-lg text-[10.5px] font-bold text-center bg-accent-500 hover:bg-accent-600 text-white"
                              >
                                Route
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-xl bg-brand-700 text-white shrink-0 flex items-center justify-center mt-1 shadow-xs">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="h-7 w-7 rounded-xl bg-accent-500/15 text-accent-600 dark:text-accent-400 shrink-0 flex items-center justify-center border border-accent-500/30">
                <Bot size={15} />
              </div>
              <div className="glass-panel rounded-2xl px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.4s]" />
                <span>Thinking & calculating campus paths…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-brand-950/60 border-t border-slate-200/70 dark:border-brand-800/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
            Ask:
          </span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium bg-white/80 dark:bg-brand-900/50 text-slate-700 dark:text-slate-200 hover:border-accent-500/50 hover:text-accent-600 border border-slate-200/80 dark:border-brand-800/60 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#071326] border-t border-slate-200/80 dark:border-brand-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Where is North Mess?', 'Find labs')..."
              className="flex-1 rounded-2xl px-4 py-2.5 text-xs sm:text-sm bg-slate-100/80 dark:bg-brand-950/70 border border-slate-200/80 dark:border-brand-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-accent-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-accent h-10 w-10 sm:w-auto sm:px-4 rounded-2xl flex items-center justify-center gap-1.5 shadow-cta disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Send message"
            >
              <Send size={15} />
              <span className="hidden sm:inline text-xs font-bold">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
