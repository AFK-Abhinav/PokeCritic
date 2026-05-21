import { useState, useRef } from 'react';
import { games } from './data/games';
import type { Game } from './data/games';
import type { Pokemon } from './data/pokemon';
import type { Item } from './data/items';
import { GameSelector } from './components/GameSelector';
import { TeamGrid } from './components/TeamGrid';
import { ReviewDashboard } from './components/ReviewDashboard';
import { evaluateTeam } from './utils/evaluator';
import type { EvaluationReport } from './utils/evaluator';
import { ShieldCheck, Play, RotateCcw, Flame } from 'lucide-react';

function App() {
  // 1. Campaign state
  const [selectedGame, setSelectedGame] = useState<Game>(games.find(g => g.id === 'sv') || games[0]);
  
  // 2. Team slot states
  const [team, setTeam] = useState<(Pokemon | null)[]>(Array(6).fill(null));
  const [selectedItems, setSelectedItems] = useState<(string | null)[]>(Array(6).fill(null));
  const [selectedTeraTypes, setSelectedTeraTypes] = useState<(string | null)[]>(Array(6).fill('default'));
  
  // 3. Evaluation trigger
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [report, setReport] = useState<EvaluationReport | null>(null);

  const dashboardRef = useRef<HTMLDivElement>(null);

  // Sync item pools and reset selections if campaign changes
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    // Clear items and tera designations to prevent cross-gen leaks
    setSelectedItems(Array(6).fill(null));
    setSelectedTeraTypes(Array(6).fill('default'));
    setIsEvaluated(false);
    setReport(null);
  };

  const handleUpdateSlot = (index: number, pokemon: Pokemon | null) => {
    const nextTeam = [...team];
    nextTeam[index] = pokemon;
    setTeam(nextTeam);
    
    // Auto-suggest resets for this slot
    const nextItems = [...selectedItems];
    nextItems[index] = pokemon ? 'none' : null;
    setSelectedItems(nextItems);

    const nextTeras = [...selectedTeraTypes];
    nextTeras[index] = pokemon ? 'default' : null;
    setSelectedTeraTypes(nextTeras);

    // If already evaluated, trigger real-time updates!
    if (isEvaluated) {
      triggerLiveEvaluation(nextTeam, nextItems, nextTeras, selectedGame);
    }
  };

  const handleUpdateItem = (index: number, itemId: string | null) => {
    const nextItems = [...selectedItems];
    nextItems[index] = itemId;
    setSelectedItems(nextItems);

    if (isEvaluated) {
      triggerLiveEvaluation(team, nextItems, selectedTeraTypes, selectedGame);
    }
  };

  const handleUpdateTera = (index: number, teraType: string | null) => {
    const nextTeras = [...selectedTeraTypes];
    nextTeras[index] = teraType;
    setSelectedTeraTypes(nextTeras);

    if (isEvaluated) {
      triggerLiveEvaluation(team, selectedItems, nextTeras, selectedGame);
    }
  };

  // Instantly equips a recommended item and triggers real-time evaluation
  const handleEquipSuggestedItem = (pokemonId: number, item: Item) => {
    const idx = team.findIndex(p => p !== null && p.id === pokemonId);
    if (idx !== -1) {
      const nextItems = [...selectedItems];
      nextItems[idx] = item.id;
      setSelectedItems(nextItems);
      
      triggerLiveEvaluation(team, nextItems, selectedTeraTypes, selectedGame);
    }
  };

  // Internal live evaluation re-runner
  const triggerLiveEvaluation = (
    currentTeam: (Pokemon | null)[],
    currentItems: (string | null)[],
    currentTeras: (string | null)[],
    currentGame: Game
  ) => {
    const res = evaluateTeam(
      currentTeam,
      currentItems,
      currentGame.id,
      currentGame.generation,
      currentGame.mechanic,
      currentTeras
    );
    setReport(res);
  };

  // Triggered by "Evaluate Team" button (scrolls user into focus)
  const handleEvaluate = () => {
    triggerLiveEvaluation(team, selectedItems, selectedTeraTypes, selectedGame);
    setIsEvaluated(true);
    
    // Smooth scroll down to analysis dashboard
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setTeam(Array(6).fill(null));
    setSelectedItems(Array(6).fill(null));
    setSelectedTeraTypes(Array(6).fill('default'));
    setIsEvaluated(false);
    setReport(null);
  };

  // Active diagnostic lights on Pokédex banner matching evaluator states
  const getLEDColorClass = () => {
    if (!isEvaluated || !report) return 'bg-slate-700 shadow-[0_0_8px_rgba(100,116,139,0.3)]';
    if (report.score >= 80) return 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse';
    if (report.score >= 65) return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]';
    if (report.score >= 50) return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]';
    return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse';
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] flex flex-col justify-between selection:bg-red-500/30 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-900/60 px-4 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Dex Styled LED Cluster */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-2.5 rounded-full border border-slate-900">
              <div className={`h-4.5 w-4.5 rounded-full ${getLEDColorClass()} transition-all duration-500`} />
              <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
              <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
                PokeTeam <span className="text-red-500">Critic</span>
              </h1>
              <p className="text-4xs text-slate-500 uppercase tracking-widest font-black leading-none mt-0.5">
                Strategic Battle Evaluator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/20 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-all outline-none"
              title="Reset Team"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 space-y-12 flex-1">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4 py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/15 text-red-400 text-3xs font-extrabold uppercase tracking-widest">
            <Flame className="h-3 w-3 animate-pulse" />
            Gen 1 to Gen 9 Tactical Check
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Construct the Ultimate Pokémon Team
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Select your game version, build your optimal lineup, and let our advanced diagnostics evaluate type coverage, stat balances, and held item synergy.
          </p>
        </section>

        {/* 1. GAME SELECTOR */}
        <section className="animate-float py-2">
          <GameSelector 
            selectedGame={selectedGame}
            onSelectGame={handleSelectGame}
          />
        </section>

        {/* 2. TEAM BUILDER */}
        <section>
          <TeamGrid 
            team={team}
            selectedItems={selectedItems}
            selectedTeraTypes={selectedTeraTypes}
            game={selectedGame}
            onUpdateSlot={handleUpdateSlot}
            onUpdateItem={handleUpdateItem}
            onUpdateTera={handleUpdateTera}
          />
        </section>

        {/* EVALUATE TRIGGER BAR */}
        {team.some(p => p !== null) && (
          <section className="flex justify-center pt-4">
            <button
              onClick={handleEvaluate}
              className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-sm tracking-wider uppercase py-4 px-10 rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all hover:scale-[1.02] outline-none"
            >
              <Play className="h-4 w-4 fill-white group-hover:scale-105 transition-transform" />
              Evaluate Team Composition
            </button>
          </section>
        )}

        {/* 3. REVIEW DASHBOARD AREA */}
        {isEvaluated && report && (
          <section 
            ref={dashboardRef} 
            className="pt-4 scroll-mt-24 border-t border-slate-900/60"
          >
            <ReviewDashboard 
              report={report}
              onEquipItem={handleEquipSuggestedItem}
              hasItems={selectedGame.hasItems}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-8 px-4 mt-12 text-center text-4xs font-bold uppercase tracking-widest text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 PokéTeam Critic. Utilizes PokeAPI assets for flavor representations.</p>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded text-slate-500 border border-slate-850">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              Tactical Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
