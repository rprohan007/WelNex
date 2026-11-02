import React, { useState } from 'react';
import type { AssistantQueryPair } from '../../types/radar';
import { Badge } from '../common/Badge';
import {
  Send,
  ShieldAlert,
  Bot,
  Lightbulb,
  CheckCircle2,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';


interface AskWelNexPanelProps {
  quickQueries: AssistantQueryPair[];
  activeQuery: AssistantQueryPair | null;
  onSelectQuery: (query: AssistantQueryPair) => void;
  onAskCustom: (text: string) => void;
  isAnswering: boolean;
}

export const AskWelNexPanel: React.FC<AskWelNexPanelProps> = ({
  quickQueries,
  activeQuery,
  onSelectQuery,
  onAskCustom,
  isAnswering
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAskCustom(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="rounded-3xl border border-champagne-500/50 bg-white/85 backdrop-blur-xl p-6 sm:p-8 shadow-glass-md text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-champagne-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-copper-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-copper-glow/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-extrabold text-espresso-950">
                Ask WelNex — Alternative Intelligence Assistant
              </h3>
              <Badge variant="copper" size="xs">
                AI Shell
              </Badge>
            </div>
            <p className="text-xs text-espresso-600">
              Query statutory SEBI rules, tax regimes, and alternative structuring in real time.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-copper-700 bg-copper-500/10 px-3 py-1 rounded-full border border-copper-500/25 w-fit">
          Live Knowledge Index
        </span>
      </div>

      {/* Quick-Prompt Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-copper-600" />
          <span>Frequently Asked Regulatory Questions:</span>
        </span>

        <div className="flex flex-wrap gap-2">
          {quickQueries.map((item, idx) => {
            const isSelected = activeQuery?.query === item.query;
            return (
              <button
                key={idx}
                onClick={() => onSelectQuery(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-copper-500 text-white font-bold shadow-sm'
                    : 'bg-sand-100 text-espresso-800 border border-champagne-500/35 hover:border-copper-500/40 hover:bg-white'
                }`}
              >
                <span>{item.query}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Query Box */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about SEBI SM REIT limits, NDCF waterfall, or InvIT dividend taxation..."
          className="w-full pl-4 pr-24 py-3 rounded-2xl bg-sand-50/90 border border-champagne-500/40 text-xs sm:text-sm text-espresso-950 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isAnswering}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-copper-500 hover:bg-copper-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* RESPONSE DISPLAY AREA */}
      {isAnswering ? (
        <div className="p-6 rounded-2xl bg-sand-100 border border-champagne-500/30 flex items-center justify-center gap-3 text-xs text-espresso-700 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-copper-600" />
          <span>Searching statutory regulations and structuring knowledge base...</span>
        </div>
      ) : activeQuery ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-sand-100/90 border border-champagne-500/40 space-y-4 animate-fadeIn">
          
          {/* Query Header */}
          <div className="flex items-center justify-between gap-2 border-b border-champagne-500/25 pb-3">
            <div className="flex items-center gap-2">
              <CornerDownRight className="w-4 h-4 text-copper-600 shrink-0" />
              <span className="font-display font-extrabold text-sm sm:text-base text-espresso-950">
                {activeQuery.query}
              </span>
            </div>
            {activeQuery.categoryTag && (
              <span className="text-[10px] font-bold text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded-full border border-copper-500/20">
                {activeQuery.categoryTag}
              </span>
            )}
          </div>

          {/* Response Text */}
          <p className="text-xs sm:text-sm text-espresso-800 leading-relaxed">
            {activeQuery.response}
          </p>

          {/* Key Points Checklist */}
          {activeQuery.keyPoints && activeQuery.keyPoints.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-600 block mb-1">
                Core Takeaways:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeQuery.keyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/80 border border-champagne-500/30 text-xs text-espresso-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-copper-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}

      {/* DISCLAIMER NOTE (Explicit Requirement) */}
      <div className="p-3.5 rounded-2xl bg-sand-200/80 border border-champagne-500/40 flex items-start gap-2.5 text-xs text-espresso-700">
        <ShieldAlert className="w-4 h-4 text-copper-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Educational Notice:</strong> Responses generated by the Ask WelNex assistant are synthesized for educational context only based on publicly available statutory documents. WelNex does not provide investment, legal, or tax advice. Consult a SEBI-registered Investment Advisor (RIA) prior to making investment decisions.
        </p>
      </div>

    </div>
  );
};
