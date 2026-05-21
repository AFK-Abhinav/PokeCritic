import React, { useState, useMemo } from 'react';
import { pokemonList } from '../data/pokemon';
import type { Pokemon } from '../data/pokemon';
import { Search, X, Info } from 'lucide-react';
import { typeStyles } from '../utils/typeColors';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
  currentGen: number;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPokemon,
  currentGen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // List of all unique types available to filter by
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    pokemonList.forEach(p => {
      // Filter out Fairy type if generation is < 6
      p.types.forEach(t => {
        if (currentGen >= 6 || t !== 'Fairy') {
          types.add(t);
        }
      });
    });
    return Array.from(types).sort();
  }, [currentGen]);

  // Filter Pokémon list by generation, search query, and type
  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(poke => {
      // Rule 1: Generation check
      if (poke.generation > currentGen) return false;

      // Rule 2: Search term check
      const matchesSearch = poke.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Rule 3: Type check (adjusting for Gen < 6 Fairy filter)
      const visibleTypes = currentGen < 6 ? poke.types.filter(t => t !== 'Fairy') : poke.types;
      const matchesType = !selectedType || visibleTypes.includes(selectedType);

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType, currentGen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Select Pokémon
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Obtainable in Gen {currentGen}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an eligible team member to examine and test their synergy.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 border border-slate-750 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Filters */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/20 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Pokémon name (e.g. Charizard, Garchomp...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
              autoFocus
            />
          </div>

          {/* Type filters grid */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                selectedType === null
                  ? 'bg-white text-slate-950 border-white font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            {allTypes.map(type => {
              const style = typeStyles[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? `bg-gradient-to-r ${style.bg} text-white ${style.border} font-bold shadow-md`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${style.bg}`} />
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Content - Pokémon Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
          {filteredPokemon.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
              <Info className="h-10 w-10 opacity-30 mb-3" />
              <p className="text-sm font-medium">No obtainable Pokémon found matching search conditions.</p>
              <p className="text-xs opacity-50 mt-1">Try resetting the type filter or checking Gen {currentGen} limitations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredPokemon.map((poke) => {
                // Adjust types for display if gen < 6
                const displayTypes = currentGen < 6 ? poke.types.filter(t => t !== 'Fairy') : poke.types;
                const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;

                return (
                  <button
                    key={poke.id}
                    onClick={() => {
                      onSelectPokemon(poke);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 rounded-2xl cursor-pointer text-left transition-all hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group"
                  >
                    <div className="h-16 w-16 bg-slate-950 rounded-xl flex items-center justify-center p-1.5 relative border border-slate-850 overflow-hidden">
                      <div className="absolute inset-0 bg-radial from-slate-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img 
                        src={artworkUrl} 
                        alt={poke.name}
                        className="h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to simple sprite
                          (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                          {poke.name}
                        </h4>
                        <span className="text-4xs text-slate-500 font-bold">
                          #{String(poke.id).padStart(3, '0')}
                        </span>
                      </div>
                      
                      <div className="flex gap-1 mt-1">
                        {displayTypes.map(t => {
                          const style = typeStyles[t] || typeStyles.Normal;
                          return (
                            <span 
                              key={t}
                              className={`text-4xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-gradient-to-r ${style.bg} text-white leading-none border ${style.border}`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>

                      {/* Small stats summary */}
                      <div className="grid grid-cols-6 gap-0.5 mt-2.5 text-4xs font-bold text-slate-450 text-center uppercase tracking-wider">
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.hp}</div>
                          HP
                        </div>
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.atk}</div>
                          ATK
                        </div>
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.def}</div>
                          DEF
                        </div>
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.spa}</div>
                          SPA
                        </div>
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.spd}</div>
                          SPD
                        </div>
                        <div>
                          <div className="text-3xs text-slate-350">{poke.baseStats.spe}</div>
                          SPE
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
