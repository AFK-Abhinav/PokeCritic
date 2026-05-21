import React from 'react';
import { games } from '../data/games';
import type { Game } from '../data/games';
import { ShieldAlert, Award } from 'lucide-react';

interface GameSelectorProps {
  selectedGame: Game;
  onSelectGame: (game: Game) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({ selectedGame, onSelectGame }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            1. Select Campaign Version
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generational rules filter obtainable Pokémon, active items pool, and signature battle mechanics.
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-350 border border-slate-700">
            Current Filter: Gen {selectedGame.generation} Rules
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {games.map((game) => {
          const isSelected = game.id === selectedGame.id;
          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer outline-none ${
                isSelected
                  ? `border-white bg-slate-900/80 shadow-[0_0_20px_rgba(255,255,255,0.06)]`
                  : 'border-slate-800/60 bg-slate-900/30 hover:border-slate-750 hover:bg-slate-900/60'
              }`}
            >
              {/* Active selection glow accent */}
              {isSelected && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${game.logoColor}`} />
              )}
              
              <div className="flex justify-between items-center w-full mb-1">
                <span className="text-2xs font-extrabold tracking-wider uppercase opacity-45">
                  GEN {game.generation}
                </span>
                {game.mechanic && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400" title={`${game.mechanicName} enabled`} />
                )}
              </div>
              
              <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">
                {game.name}
              </h3>
              
              <span className="text-3xs text-slate-450 mt-2 line-clamp-1 block">
                {game.mechanic ? `${game.mechanicName}` : game.hasItems ? 'Held Items Active' : 'No Held Items'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected game detail box */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${selectedGame.logoColor} shadow-md`}>
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center gap-2">
              Playing {selectedGame.name}
              {selectedGame.mechanic && (
                <span className="text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                  {selectedGame.mechanicName} Active
                </span>
              )}
            </h4>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {selectedGame.description}
            </p>
          </div>
        </div>

        {/* Informational banner for item limitations */}
        {!selectedGame.hasItems && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/15 text-amber-400 p-4 rounded-xl max-w-md shrink-0">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Held Items Restricted:</span> Held items were not introduced or used in local main-game campaigns for this generation. Roster evaluator adjusts scoring weights automatically.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
