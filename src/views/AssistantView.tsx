import React, { useState, useRef, useEffect } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Trash2,
  RefreshCw,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export function AssistantView() {
  const messages = useNexusStore((s) => s.assistantMessages);
  const isThinking = useNexusStore((s) => s.isAssistantThinking);
  const sendMessage = useNexusStore((s) => s.sendMessageToAssistant);
  const clearChat = useNexusStore((s) => s.clearAssistantChat);
  const setTab = useNexusStore((s) => s.setTab);
  const purgeInferenceCache = useNexusStore((s) => s.purgeInferenceCache);
  const rebalanceTraffic = useNexusStore((s) => s.rebalanceTraffic);

  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isThinking) return;
    sendMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleActionExecute = (actionType: string) => {
    switch (actionType) {
      case 'DIAGNOSTIC_RUN':
      case 'NAVIGATE_ANALYTICS':
        setTab('analytics');
        break;
      case 'REBALANCE':
        rebalanceTraffic();
        break;
      case 'PURGE_CACHE':
        purgeInferenceCache();
        break;
      case 'NAVIGATE_GLOBE':
        setTab('globe');
        break;
      default:
        break;
    }
  };

  const quickPrompts = [
    'Run full health diagnostic on all clusters',
    'Rebalance planetary optical transit traffic',
    'Explain current GPU matrix VRAM utilization',
    'Purge distributed inference KV-cache',
    'Show Tokyo & Frankfurt latency metrics',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Top Copilot Header with simulation disclosure */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono tracking-wide">
                NEXUS Core AI Copilot
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono uppercase">
                Simulated Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous telemetry reasoning, traffic balancing, and system triage agent.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-cyan-500/20 text-xs font-mono flex items-center gap-1.5 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Session</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                }`}
              >
                {isUser ? <Terminal className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs font-sans leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                    : 'bg-slate-900/90 border border-violet-500/30 text-slate-200 rounded-tl-none font-mono'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggested Action Button inside assistant response */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-violet-500/20">
                    <button
                      onClick={() => handleActionExecute(msg.suggestedAction!.actionType)}
                      className="px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 text-violet-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-violet-400" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-900/90 border border-violet-500/30 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing cluster telemetry and model tensors...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSuggestedPrompt(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono whitespace-nowrap transition-all shadow-sm"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-xl"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask NEXUS Copilot to analyze telemetry, rebalance mesh, or diagnose incidents..."
          className="w-full bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isThinking}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
