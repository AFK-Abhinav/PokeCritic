import React, { useState } from 'react';
import type { Pokemon } from '../data/pokemon';
import type { Game } from '../data/games';
import { items, getMegaStones, getZCrystals } from '../data/items';
import type { Item } from '../data/items';
import { typeStyles } from '../utils/typeColors';
import { Plus, X, Backpack, Sparkles } from 'lucide-react';
import { SearchModal } from './SearchModal';

interface TeamGridProps {
  team: (Pokemon | null)[];
  selectedItems: (string | null)[];
  selectedTeraTypes: (string | null)[];
  game: Game;
  onUpdateSlot: (index: number, pokemon: Pokemon | null) => void;
  onUpdateItem: (index: number, itemId: string | null) => void;
  onUpdateTera: (index: number, teraType: string | null) => void;
}

export const TeamGrid: React.FC<TeamGridProps> = ({
  team,
  selectedItems,
  selectedTeraTypes,
  game,
  onUpdateSlot,
  onUpdateItem,
  onUpdateTera
}) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  // Available items list for the current generation
  const getAvailableItemsForPokemon = (pokemon: Pokemon): Item[] => {
    // 1. Regular items
    let genItems = items.filter(i => i.generation <= game.generation);

    // 2. Add Megas if Gen 6
    if (game.mechanic === 'Mega' && pokemon.mega) {
      genItems = [...getMegaStones(pokemon), ...genItems];
    }

    // 3. Add Z-Crystals if Gen 7
    if (game.mechanic === 'Z-Crystal') {
      genItems = [...getZCrystals(pokemon), ...genItems];
    }

    return genItems;
  };

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
  };

  const handleCloseModal = () => {
    setModalIndex(null);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (modalIndex !== null) {
      onUpdateSlot(modalIndex, pokemon);
      onUpdateItem(modalIndex, 'none'); // Reset item selection to auto-suggest
      onUpdateTera(modalIndex, 'default'); // Reset Tera to primary type
    }
  };

  // Helper to draw mini stat bar
  const renderStatBar = (val: number, maxVal = 160) => {
    const pct = Math.min(100, (val / maxVal) * 100);
    let barColor = 'bg-slate-700';
    if (val >= 110) barColor = 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]';
    else if (val >= 90) barColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    else if (val >= 70) barColor = 'bg-amber-500';
    else barColor = 'bg-red-500';

    return (
      <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
          2. Build Your Roster
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Add up to 6 Pokémon and assign custom held items. Leave items as <strong className="text-red-400">None / Auto-Suggest</strong> to trigger the optimization engine.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = team[index];
          const selectedItemId = selectedItems[index] || 'none';
          const selectedTera = selectedTeraTypes[index] || 'default';
          
          if (!pokemon) {
            // EMPTY SLOT
            return (
              <button
                key={index}
                onClick={() => handleOpenModal(index)}
                className="group relative flex flex-col items-center justify-center h-80 rounded-3xl border border-dashed border-slate-800/80 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/35 hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer min-h-[320px] outline-none"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/60 border border-slate-800 group-hover:scale-105 group-hover:border-slate-700 transition-all shadow-inner">
                  <Plus className="h-6 w-6 text-slate-500 group-hover:text-slate-350 transition-colors" />
                </div>
                <span className="mt-3 text-sm font-bold text-slate-400 group-hover:text-slate-300 transition-colors">
                  Slot {index + 1}
                </span>
                <span className="text-3xs text-slate-550 mt-1.5 uppercase tracking-widest font-extrabold">
                  Add Pokemon
                </span>
              </button>
            );
          }

          // FILLED SLOT
          const displayTypes = game.generation < 6 ? pokemon.types.filter(t => t !== 'Fairy') : pokemon.types;
          const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
          
          const availableItems = getAvailableItemsForPokemon(pokemon);

          // Tera color styling for background glow
          const teraStyle = selectedTera && selectedTera !== 'default' ? typeStyles[selectedTera] : null;

          return (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl border glass-panel p-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-h-[320px] ${
                teraStyle 
                  ? `border-slate-800/60 shadow-[0_0_30px_rgba(255,255,255,0.02)]` 
                  : 'border-slate-850 hover:border-slate-750'
              }`}
            >
              {/* Custom background aura based on type */}
              <div 
                className={`absolute inset-0 rounded-3xl opacity-[0.02] bg-gradient-to-b pointer-events-none ${
                  typeStyles[displayTypes[0]]?.bg || 'from-slate-500'
                }`} 
              />
              
              {/* Tera border aura */}
              {teraStyle && (
                <div 
                  className={`absolute inset-0 rounded-3xl pointer-events-none border border-gradient bg-radial opacity-35 ${teraStyle.glow}`}
                  style={{
                    boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.01), 0 0 15px ${teraStyle.glow.includes('shadow-') ? 'rgba(255,255,255,0.05)' : ''}`
                  }}
                />
              )}

              {/* Slot Header */}
              <div className="flex items-center justify-between z-10">
                <span className="text-3xs font-extrabold uppercase bg-slate-950 px-2 py-0.5 rounded-md text-slate-500 border border-slate-900">
                  SLOT {index + 1}
                </span>
                <button
                  onClick={() => onUpdateSlot(index, null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 border border-slate-900 text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
                  title="Remove Pokémon"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Pokemon Info Block */}
              <div className="flex gap-4 items-start mt-4 z-10">
                <div className="h-20 w-20 bg-slate-950/80 rounded-2xl flex items-center justify-center p-2 border border-slate-850 relative overflow-hidden shrink-0 group">
                  <div className="absolute inset-0 bg-radial from-slate-800/10 to-transparent opacity-30" />
                  <img
                    src={artworkUrl}
                    alt={pokemon.name}
                    className="h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-bold text-base text-white truncate group-hover:text-red-400">
                      {pokemon.name}
                    </h3>
                    <span className="text-3xs font-extrabold text-slate-600 shrink-0">
                      #{String(pokemon.id).padStart(3, '0')}
                    </span>
                  </div>

                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {displayTypes.map(t => {
                      const style = typeStyles[t] || typeStyles.Normal;
                      return (
                        <span
                          key={t}
                          className={`text-4xs font-extrabold uppercase px-2 py-0.5 rounded bg-gradient-to-r ${style.bg} text-white border ${style.border}`}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stat Mini Bars */}
              <div className="mt-5 space-y-1.5 flex-1 z-10">
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">HP {pokemon.baseStats.hp}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.hp, 255)}</div>
                </div>
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">Atk {pokemon.baseStats.atk}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.atk)}</div>
                </div>
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">Def {pokemon.baseStats.def}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.def, 200)}</div>
                </div>
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">SpA {pokemon.baseStats.spa}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.spa)}</div>
                </div>
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">SpD {pokemon.baseStats.spd}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.spd, 150)}</div>
                </div>
                <div className="grid grid-cols-12 items-center text-4xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="col-span-3 text-slate-400">Spe {pokemon.baseStats.spe}</span>
                  <div className="col-span-9">{renderStatBar(pokemon.baseStats.spe, 142)}</div>
                </div>
              </div>

              {/* Dynamic Modifiers Selector Panels */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3 z-10">
                {/* 1. HELD ITEM SELECTOR */}
                {game.hasItems ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Backpack className="h-3 w-3 text-slate-400" />
                      Held Item
                    </label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => onUpdateItem(index, e.target.value)}
                      className={`w-full bg-slate-950 text-xs text-white px-3 py-2 border rounded-xl focus:outline-none transition-colors cursor-pointer outline-none ${
                        selectedItemId === 'none' 
                          ? 'border-dashed border-red-500/30 text-red-400 bg-red-950/5' 
                          : 'border-slate-850 focus:border-slate-700'
                      }`}
                    >
                      <option value="none">None / Auto-Suggest Item</option>
                      
                      {/* Separate category lists */}
                      <optgroup label="Competitive Hold Items">
                        {availableItems
                          .filter(i => i.category !== 'mechanic')
                          .map(i => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))
                        }
                      </optgroup>
                      
                      {/* Special mechanics category if present */}
                      {availableItems.some(i => i.category === 'mechanic') && (
                        <optgroup label={`${game.mechanicName} Options`}>
                          {availableItems
                            .filter(i => i.category === 'mechanic')
                            .map(i => (
                              <option key={i.id} value={i.id}>{i.name}</option>
                            ))
                          }
                        </optgroup>
                      )}
                    </select>
                  </div>
                ) : (
                  <div className="bg-slate-950 px-3 py-2 border border-dashed border-slate-850 rounded-xl flex items-center justify-center text-4xs font-bold uppercase tracking-wider text-slate-550">
                    Held Items Locked in Gen {game.generation}
                  </div>
                )}

                {/* 2. TERA TYPE SELECTOR (GEN 9 SV ONLY) */}
                {game.mechanic === 'Terastal' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      Tera Type
                    </label>
                    <select
                      value={selectedTera}
                      onChange={(e) => onUpdateTera(index, e.target.value)}
                      className="w-full bg-slate-950 text-xs text-white px-3 py-2 border border-slate-850 focus:border-slate-700 rounded-xl focus:outline-none cursor-pointer outline-none"
                    >
                      <option value="default">Default STAB ({displayTypes.join('/')})</option>
                      {Object.keys(typeStyles).map(type => (
                        <option key={type} value={type}>{type} Tera</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Autocomplete Selection Modal */}
      <SearchModal
        isOpen={modalIndex !== null}
        onClose={handleCloseModal}
        onSelectPokemon={handleSelectPokemon}
        currentGen={game.generation}
      />
    </div>
  );
};
