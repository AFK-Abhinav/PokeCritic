import React from 'react';
import type { EvaluationReport } from '../utils/evaluator';
import { typeStyles } from '../utils/typeColors';
import { ShieldCheck, ShieldAlert, Zap, BookOpen, Sparkles } from 'lucide-react';
import type { Item } from '../data/items';

interface ReviewDashboardProps {
  report: EvaluationReport;
  onEquipItem: (pokemonId: number, item: Item) => void;
  hasItems: boolean;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  report,
  onEquipItem,
  hasItems
}) => {
  const {
    score,
    ratingText,
    ratingColor,
    typeCoverageScore,
    itemSynergyScore,
    statBalanceScore,
    mechanicsScore,
    weaknesses,
    resistances,
    offensiveCoverageGapTypes,
    suggestions,
    criticFeedback
  } = report;

  // SVG parameters for circular score gauge
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color map for score progress ring
  const getScoreRingColor = (val: number) => {
    if (val >= 80) return 'stroke-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]';
    if (val >= 65) return 'stroke-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]';
    if (val >= 50) return 'stroke-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    return 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 glow-pulse-cyan"></span>
          3. Evaluator Dashboard
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Review your overall tactical viability rating, item corrections, type coverage maps, and critic guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* OVERALL SCORE PANEL (LEFT COLUMN) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-850 bg-slate-900/40 relative overflow-hidden text-center min-h-[360px]">
          <div className="absolute inset-0 bg-radial from-slate-800/10 to-transparent pointer-events-none" />
          
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-6 z-10">
            Team Viability Rating
          </h3>

          {/* Animated SVG Gauge */}
          <div className="relative flex items-center justify-center h-44 w-44 z-10 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              {/* Backtrack circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Active animated stroke */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className={`transition-stroke duration-1000 ease-out ${getScoreRingColor(score)}`}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {score}
              </span>
              <span className="text-4xs font-extrabold uppercase tracking-widest text-slate-500 mt-0.5">
                MAX 100
              </span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest z-10 shadow-lg ${ratingColor}`}>
            {ratingText}
          </div>

          {/* Subscores breakdown list */}
          <div className="w-full grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-850/60 text-left text-3xs font-extrabold uppercase tracking-wider text-slate-550 z-10">
            <div className="space-y-1">
              <div className="text-slate-400 flex items-center gap-1">
                Type Coverage
              </div>
              <div className="text-sm font-bold text-slate-350">{typeCoverageScore}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 flex items-center gap-1">
                Item Synergy
              </div>
              <div className="text-sm font-bold text-slate-350">{hasItems ? `${itemSynergyScore}%` : 'N/A'}</div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="text-slate-400 flex items-center gap-1">
                Stat Balance
              </div>
              <div className="text-sm font-bold text-slate-350">{statBalanceScore}%</div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="text-slate-400 flex items-center gap-1">
                Generational Synergy
              </div>
              <div className="text-sm font-bold text-slate-350">{mechanicsScore}%</div>
            </div>
          </div>
        </div>

        {/* DETAILED FEEDBACK PANEL (RIGHT COLUMN) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          
          {/* AI STYLE CRITIC FEEDBACK CARD */}
          <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/30 space-y-4 flex-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              AI Critic Strategic Analysis
            </h3>
            
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
              {criticFeedback.map((text, idx) => {
                // Parse brief bold elements for formatting
                const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
                return (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-slate-900">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <p dangerouslySetInnerHTML={{ __html: formattedText }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SMART ITEM SUGGESTIONS PANEL */}
      {hasItems && suggestions.length > 0 && (
        <div className="p-6 rounded-3xl border border-red-500/10 bg-gradient-to-r from-red-500/[0.02] to-transparent space-y-5">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-400 animate-pulse" />
              Smart Suggestions: Held Item Auto-Equips
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              We identified blank item slots. Our optimization engine has analyzed stats and typing to recommend these builds. Equipping raises overall synergy instantly!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => {
              const formattedReason = sug.reason.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-255 font-bold">$1</strong>');
              return (
                <div 
                  key={sug.pokemonId}
                  className="flex flex-col justify-between p-5 bg-slate-950/60 border border-slate-850 hover:border-slate-750 transition-colors rounded-2xl gap-4 group"
                >
                  <div className="flex gap-4 items-start">
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center p-1 border border-slate-800 shrink-0">
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sug.pokemonId}.png`} 
                        alt={sug.pokemonName}
                        className="h-full w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {sug.pokemonName} Suggestion
                      </h4>
                      <p 
                        className="text-xs text-slate-400 mt-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formattedReason }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onEquipItem(sug.pokemonId, sug.suggestedItem)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
                  >
                    Equip {sug.suggestedItem.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TYPE VULNERABILITIES & RESISTANCES MAPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DEFENSIVE ANALYSIS */}
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/20 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Defensive Team Balance
            </h3>
            <p className="text-4xs text-slate-500 uppercase tracking-widest font-extrabold mt-0.5">
              Vulnerabilities vs. Resistances
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Heavy Vulnerabilities */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                Overlapping Weaknesses (Double Damage Taken)
              </span>
              {weaknesses.length === 0 ? (
                <div className="text-xs text-slate-500 italic bg-slate-950/20 p-3 border border-slate-900/60 rounded-xl">
                  No overlapping weaknesses found. Beautiful defensive spacing!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map(({ type, count }) => {
                    const style = typeStyles[type] || typeStyles.Normal;
                    const isSevere = count >= 3;
                    return (
                      <div 
                        key={type}
                        className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-lg border text-xs font-semibold ${
                          isSevere 
                            ? 'bg-red-500/10 border-red-500/25 text-red-400' 
                            : 'bg-slate-950/50 border-slate-850 text-slate-300'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded text-4xs font-extrabold uppercase text-white bg-gradient-to-r ${style.bg} border ${style.border}`}>
                          {type}
                        </span>
                        <span>{count}x Weak</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Team Resistances */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Immunities & Resistances (Damage Absorbers)
              </span>
              {resistances.length === 0 ? (
                <div className="text-xs text-slate-500 italic bg-slate-950/20 p-3 border border-slate-900/60 rounded-xl">
                  No passive resistances. Your team takes fully neutral damage from all attacks.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {resistances.map(({ type, count }) => {
                    const style = typeStyles[type] || typeStyles.Normal;
                    return (
                      <div 
                        key={type}
                        className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-slate-950/50 border border-slate-850 rounded-lg text-xs font-semibold text-slate-350"
                      >
                        <span className={`px-2 py-0.5 rounded text-4xs font-extrabold uppercase text-white bg-gradient-to-r ${style.bg} border ${style.border}`}>
                          {type}
                        </span>
                        <span>{count}x Absorbs</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OFFENSIVE COVERAGE MATRIX */}
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/20 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              Offensive STAB Coverage Grid
            </h3>
            <p className="text-4xs text-slate-500 uppercase tracking-widest font-extrabold mt-0.5">
              Super-effective targets hit by your team's types
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Object.keys(typeStyles)
              .filter(type => report.offensiveCoverageGapTypes.concat(report.offensiveSTABTypes).includes(type) || true)
              .map((type) => {
                const isCovered = !offensiveCoverageGapTypes.includes(type) && type !== 'Normal';
                const style = typeStyles[type];
                
                return (
                  <div
                    key={type}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all text-xs font-extrabold uppercase tracking-wider ${
                      isCovered
                        ? `bg-emerald-500/10 ${style.border} text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.05)]`
                        : type === 'Normal' 
                          ? 'bg-slate-900/20 border-slate-850 text-slate-500 opacity-40'
                          : 'bg-red-500/5 border-red-500/10 text-slate-500 opacity-45'
                    }`}
                  >
                    <span>{type}</span>
                    {isCovered ? (
                      <span className="text-5xs bg-emerald-500 text-slate-950 font-black rounded px-1 flex leading-none py-0.5">
                        OK
                      </span>
                    ) : (
                      type !== 'Normal' && (
                        <span className="text-5xs bg-red-500/20 text-red-500 font-bold rounded px-1 flex leading-none py-0.5">
                          GAP
                        </span>
                      )
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
