import type { Pokemon } from '../data/pokemon';
import { items, getMegaStones, getZCrystals } from '../data/items';
import type { Item } from '../data/items';

// Types mapping for generations
export const ALL_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

// Helper to determine type relations defensively
interface DefensiveMatchups {
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}

export const getDefensiveMatchups = (type: string, gen: number): DefensiveMatchups => {
  const matchups: { [key: string]: { weak: string[]; resist: string[]; immune: string[] } } = {
    Normal: { weak: ['Fighting'], resist: [], immune: ['Ghost'] },
    Fire: {
      weak: ['Water', 'Ground', 'Rock'],
      resist: ['Fire', 'Grass', 'Ice', 'Bug', 'Steel', 'Fairy'],
      immune: []
    },
    Water: { weak: ['Electric', 'Grass'], resist: ['Fire', 'Water', 'Ice', 'Steel'], immune: [] },
    Electric: { weak: ['Ground'], resist: ['Electric', 'Flying', 'Steel'], immune: [] },
    Grass: { weak: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'], resist: ['Water', 'Electric', 'Grass', 'Ground'], immune: [] },
    Ice: { weak: ['Fire', 'Fighting', 'Rock', 'Steel'], resist: ['Ice'], immune: [] },
    Fighting: { weak: ['Flying', 'Psychic', 'Fairy'], resist: ['Bug', 'Rock', 'Dark'], immune: [] },
    Poison: { weak: ['Ground', 'Psychic'], resist: ['Grass', 'Fighting', 'Poison', 'Bug', 'Fairy'], immune: [] },
    Ground: { weak: ['Water', 'Grass', 'Ice'], resist: ['Poison', 'Rock'], immune: ['Electric'] },
    Flying: { weak: ['Electric', 'Ice', 'Rock'], resist: ['Grass', 'Fighting', 'Bug'], immune: ['Ground'] },
    Psychic: { weak: ['Bug', 'Ghost', 'Dark'], resist: ['Fighting', 'Psychic'], immune: [] },
    Bug: { weak: ['Fire', 'Flying', 'Rock'], resist: ['Grass', 'Fighting', 'Ground'], immune: [] },
    Rock: { weak: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'], resist: ['Normal', 'Fire', 'Poison', 'Flying'], immune: [] },
    Ghost: { weak: ['Ghost', 'Dark'], resist: ['Poison', 'Bug'], immune: ['Normal', 'Fighting'] },
    Dragon: { weak: ['Ice', 'Dragon', 'Fairy'], resist: ['Fire', 'Water', 'Electric', 'Grass'], immune: [] },
    Dark: { weak: ['Fighting', 'Bug', 'Fairy'], resist: ['Ghost', 'Dark'], immune: ['Psychic'] },
    Steel: {
      weak: ['Fire', 'Fighting', 'Ground'],
      resist: ['Normal', 'Grass', 'Ice', 'Flying', 'Psychic', 'Bug', 'Rock', 'Dragon', 'Steel', 'Fairy'],
      immune: ['Poison']
    },
    Fairy: { weak: ['Poison', 'Steel'], resist: ['Fighting', 'Bug', 'Dark'], immune: ['Dragon'] }
  };

  const data = matchups[type] || { weak: [], resist: [], immune: [] };

  // Adjust for Gen 2-5
  if (gen < 6) {
    // 1. Remove Fairy from all lists
    const filterFairy = (arr: string[]) => arr.filter(t => t !== 'Fairy');
    const weak = filterFairy(data.weak);
    let resist = filterFairy(data.resist);
    const immune = filterFairy(data.immune);

    // 2. Retro-adjust Steel resistances (Steel resisted Dark and Ghost in Gen 2-5)
    if (type === 'Steel') {
      if (!resist.includes('Dark')) resist.push('Dark');
      if (!resist.includes('Ghost')) resist.push('Ghost');
    }

    return { weaknesses: weak, resistances: resist, immunities: immune };
  }

  return { weaknesses: data.weak, resistances: data.resist, immunities: data.immune };
};

// Calculate damage multiplier taken by a dual-type Pokémon from an attacking type
export const getDamageMultiplier = (attackType: string, pokemonTypes: string[], gen: number): number => {
  if (gen < 6 && attackType === 'Fairy') return 1; // Fairy did not exist
  
  let multiplier = 1;
  for (const pType of pokemonTypes) {
    if (gen < 6 && pType === 'Fairy') continue;
    const matchups = getDefensiveMatchups(pType, gen);
    if (matchups.immunities.includes(attackType)) {
      return 0; // Immunity cancels everything
    } else if (matchups.weaknesses.includes(attackType)) {
      multiplier *= 2;
    } else if (matchups.resistances.includes(attackType)) {
      multiplier *= 0.5;
    }
  }
  return multiplier;
};

// Offensive STAB coverage map
export const STAB_SUPER_EFFECTIVE: { [key: string]: string[] } = {
  Normal: [],
  Fire: ['Grass', 'Ice', 'Bug', 'Steel'],
  Water: ['Fire', 'Ground', 'Rock'],
  Electric: ['Water', 'Flying'],
  Grass: ['Water', 'Ground', 'Rock'],
  Ice: ['Grass', 'Ground', 'Flying', 'Dragon'],
  Fighting: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'],
  Poison: ['Grass', 'Fairy'],
  Ground: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
  Flying: ['Grass', 'Fighting', 'Bug'],
  Psychic: ['Fighting', 'Poison'],
  Bug: ['Grass', 'Psychic', 'Dark'],
  Rock: ['Fire', 'Ice', 'Flying', 'Bug'],
  Ghost: ['Psychic', 'Ghost'],
  Dragon: ['Dragon'],
  Dark: ['Psychic', 'Ghost'],
  Steel: ['Ice', 'Rock', 'Fairy'],
  Fairy: ['Fighting', 'Dragon', 'Dark']
};

export const getOffensiveCoverage = (attackerType: string, gen: number): string[] => {
  const coverage = STAB_SUPER_EFFECTIVE[attackerType] || [];
  if (gen < 6) {
    return coverage.filter(t => t !== 'Fairy');
  }
  return coverage;
};

// Determine role based on base stats
export type PokemonRole =
  | 'Physical Sweeper'
  | 'Special Sweeper'
  | 'Mixed Sweeper'
  | 'Physical Wall'
  | 'Special Wall'
  | 'Tank'
  | 'Support';

export const deducePokemonRole = (poke: Pokemon): PokemonRole => {
  const { hp, atk, def, spa, spd, spe } = poke.baseStats;

  // Fast attacker
  if (spe >= 85) {
    if (atk >= 95 && spa >= 95) return 'Mixed Sweeper';
    if (atk >= 95) return 'Physical Sweeper';
    if (spa >= 95) return 'Special Sweeper';
    if (spe >= 110 && hp >= 80) return 'Support'; // Fast Pivot
    // Fallback offensive
    return atk > spa ? 'Physical Sweeper' : 'Special Sweeper';
  }

  // Defensive
  if (hp >= 100 || def >= 95 || spd >= 95) {
    if (def > spd + 15) return 'Physical Wall';
    if (spd > def + 15) return 'Special Wall';
    if (atk >= 90 || spa >= 90) return 'Tank'; // Heavy hitter with bulk
    return def >= spd ? 'Physical Wall' : 'Special Wall';
  }

  // General Bulky Attacker
  if (atk >= 90 || spa >= 90) {
    return 'Tank';
  }

  return 'Support';
};

// Evaluate item suitability for a specific Pokémon in a generation
export interface ItemSynergyResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  isAutoSuggested: boolean;
  suggestedItem?: Item;
  reason: string;
}

export const evaluatePokemonItem = (
  pokemon: Pokemon,
  itemId: string,
  gen: number,
  mechanic?: 'Mega' | 'Z-Crystal' | 'Terastal'
): ItemSynergyResult => {
  // If empty or auto-suggest
  if (!itemId || itemId === 'none' || itemId === 'auto') {
    const suggestion = getAutoSuggestion(pokemon, gen, mechanic);
    return {
      score: 100, // No penalty for empty slots, since engine auto-suggests perfect fit
      grade: 'A+',
      isAutoSuggested: true,
      suggestedItem: suggestion.item,
      reason: suggestion.reason
    };
  }

  // Search items list
  let item = items.find(i => i.id === itemId);
  
  // Also check dynamic Mega Stones
  if (!item && mechanic === 'Mega') {
    const megas = getMegaStones(pokemon);
    item = megas.find(m => m.id === itemId);
  }

  // Also check dynamic Z-Crystals
  if (!item && mechanic === 'Z-Crystal') {
    const zCrystals = getZCrystals(pokemon);
    item = zCrystals.find(z => z.id === itemId);
  }

  if (!item) {
    return {
      score: 50,
      grade: 'C',
      isAutoSuggested: false,
      reason: `Unknown or unavailable item in this game.`
    };
  }

  // Check generational availability
  if (item.generation > gen) {
    return {
      score: 0,
      grade: 'F',
      isAutoSuggested: false,
      reason: `${item.name} does not exist in Gen ${gen} games. Equipped item is invalid for this generation.`
    };
  }

  // Calculate suitability score
  const baseSuitability = item.evalSuitability(pokemon);
  
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (baseSuitability >= 95) grade = 'A+';
  else if (baseSuitability >= 80) grade = 'A';
  else if (baseSuitability >= 60) grade = 'B';
  else if (baseSuitability >= 40) grade = 'C';
  else if (baseSuitability >= 20) grade = 'D';
  else grade = 'F';

  let roleText = deducePokemonRole(pokemon);
  let rationale = `Equipped ${item.name} (${grade} Rating). `;
  
  if (grade === 'A+' || grade === 'A') {
    rationale += `Excellent synergy! As a ${roleText}, ${pokemon.name} fully benefits from the item's effects: ${item.description}`;
  } else if (grade === 'B') {
    rationale += `Decent choice. It fits ${pokemon.name}'s general stats, but there are potentially more optimized options.`;
  } else if (grade === 'C' || grade === 'D') {
    rationale += `Sub-optimal. A ${roleText} like ${pokemon.name} rarely makes high-value use of ${item.name}.`;
  } else {
    rationale += `Incompatible! This item is completely wasted or counter-productive on ${pokemon.name}.`;
  }

  return {
    score: baseSuitability,
    grade,
    isAutoSuggested: false,
    reason: rationale
  };
};

// Find the absolute best item for a Pokémon
export const getAutoSuggestion = (
  pokemon: Pokemon,
  gen: number,
  mechanic?: 'Mega' | 'Z-Crystal' | 'Terastal'
): { item: Item; reason: string } => {
  // Pool of available items
  let availableItems = items.filter(i => i.generation <= gen);

  // Add Megas if game supports Mega
  if (mechanic === 'Mega' && pokemon.mega) {
    const megas = getMegaStones(pokemon);
    availableItems = [...megas, ...availableItems];
  }

  // Add Z-Crystals if game supports Z-Crystals
  if (mechanic === 'Z-Crystal') {
    const zCrystals = getZCrystals(pokemon);
    availableItems = [...zCrystals, ...availableItems];
  }

  let bestItem = availableItems[0];
  let bestScore = -1;

  for (const item of availableItems) {
    const score = item.evalSuitability(pokemon);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  const role = deducePokemonRole(pokemon);
  const typeText = pokemon.types.join('/');
  const reason = `We highly recommend equipping **${bestItem.name}** because it perfectly suits its role as a **${role}** (${typeText} type) - ${bestItem.reason}`;

  return {
    item: bestItem,
    reason
  };
};

// Interface for final evaluation report
export interface EvaluationReport {
  score: number;
  ratingText: string;
  ratingColor: string;
  typeCoverageScore: number;
  itemSynergyScore: number;
  statBalanceScore: number;
  mechanicsScore: number;
  
  // Dashboard details
  weaknesses: { type: string; count: number }[];
  resistances: { type: string; count: number }[];
  offensiveSTABTypes: string[];
  offensiveCoverageGapTypes: string[];
  
  suggestions: { pokemonId: number; pokemonName: string; suggestedItem: Item; reason: string }[];
  criticFeedback: string[];
}

// MAIN EVALUATOR FUNCTION
export const evaluateTeam = (
  team: (Pokemon | null)[],
  itemIds: (string | null)[],
  gameId: string,
  gen: number,
  mechanic?: 'Mega' | 'Z-Crystal' | 'Terastal',
  teraTypes?: (string | null)[] // Paldea Terastallization mapping
): EvaluationReport => {
  const activeTeam = team.filter((p): p is Pokemon => p !== null);
  const activeItems = itemIds.slice(0, activeTeam.length).map(id => id || 'none');
  const activeTeraTypes = teraTypes ? teraTypes.slice(0, activeTeam.length) : [];

  if (activeTeam.length === 0) {
    return {
      score: 0,
      ratingText: 'Empty Team',
      ratingColor: 'text-slate-400',
      typeCoverageScore: 0,
      itemSynergyScore: 0,
      statBalanceScore: 0,
      mechanicsScore: 0,
      weaknesses: [],
      resistances: [],
      offensiveSTABTypes: [],
      offensiveCoverageGapTypes: ALL_TYPES,
      suggestions: [],
      criticFeedback: ['Assemble a team of up to 6 Pokémon to receive a comprehensive strategic critique.']
    };
  }

  const gameHasItems = gen > 1 && gameId !== 'frlg';

  // 1. TYPE COVERAGE & WEAKNESSES (40%)
  let typeCoverageScore = 0;
  const weaknessCount: { [key: string]: number } = {};
  const resistanceCount: { [key: string]: number } = {};
  const activeGenTypes = ALL_TYPES.filter(t => gen >= 6 || t !== 'Fairy');

  // Defensive Matrix computation
  for (const type of activeGenTypes) {
    weaknessCount[type] = 0;
    resistanceCount[type] = 0;
    
    for (const p of activeTeam) {
      const mult = getDamageMultiplier(type, p.types, gen);
      if (mult > 1) {
        weaknessCount[type]++;
      } else if (mult < 1 && mult > 0) {
        resistanceCount[type]++;
      } else if (mult === 0) {
        resistanceCount[type] += 2; // Immunities count double for defense!
      }
    }
  }

  // Score defensive coverage:
  // Penalty for overlapping weaknesses (3+ members weak to same type)
  // Reward for immunity/resistances covering all types
  let overlappingWeaknessesPenalty = 0;
  let uncoveredTypesPenalty = 0;

  for (const type of activeGenTypes) {
    if (weaknessCount[type] >= 3 && resistanceCount[type] < 2) {
      overlappingWeaknessesPenalty += 10; // Severe overlapping weakness
    } else if (weaknessCount[type] >= 2 && resistanceCount[type] === 0) {
      overlappingWeaknessesPenalty += 5; // Uncovered double weakness
    }

    if (resistanceCount[type] === 0) {
      uncoveredTypesPenalty += 2; // Nobody resists this type
    }
  }

  // Offensive STAB coverage
  const hitSuperEffectively = new Set<string>();
  const teamSTABs = new Set<string>();
  activeTeam.forEach(p => {
    p.types.forEach(t => {
      if (gen >= 6 || t !== 'Fairy') {
        teamSTABs.add(t);
        const superEff = getOffensiveCoverage(t, gen);
        superEff.forEach(covered => hitSuperEffectively.add(covered));
      }
    });
  });

  const totalTypesCount = activeGenTypes.length;
  const offensiveCoverageRatio = hitSuperEffectively.size / totalTypesCount; // Score based on coverage
  const offensiveCoveragePoints = Math.round(offensiveCoverageRatio * 40); // Max 40 points

  typeCoverageScore = Math.max(0, 60 - overlappingWeaknessesPenalty - uncoveredTypesPenalty) + offensiveCoveragePoints;
  // Cap typeCoverageScore at 100
  typeCoverageScore = Math.min(100, typeCoverageScore);

  // 2. ITEM SYNERGY & OPTIMIZATION (30%)
  let itemSynergyScore = 0;
  const suggestions: EvaluationReport['suggestions'] = [];

  if (!gameHasItems) {
    // If the game doesn't support held items, grant a perfect score so it doesn't drag the score down.
    itemSynergyScore = 100;
  } else {
    let totalItemScore = 0;
    activeTeam.forEach((p, idx) => {
      const itemId = activeItems[idx];
      const result = evaluatePokemonItem(p, itemId, gen, mechanic);
      
      totalItemScore += result.score;
      
      if (result.isAutoSuggested && result.suggestedItem) {
        suggestions.push({
          pokemonId: p.id,
          pokemonName: p.name,
          suggestedItem: result.suggestedItem,
          reason: result.reason
        });
      }
    });
    itemSynergyScore = Math.round(totalItemScore / activeTeam.length);
  }

  // 3. STAT BALANCE (20%)
  let statBalanceScore = 0;
  let hasPhysSweeper = false;
  let hasSpecSweeper = false;
  let hasPhysWall = false;
  let hasSpecWall = false;
  let hasSpeedControl = false;

  activeTeam.forEach(p => {
    const role = deducePokemonRole(p);
    if (role === 'Physical Sweeper' || (p.baseStats.atk >= 110 && p.baseStats.spe >= 80)) hasPhysSweeper = true;
    if (role === 'Special Sweeper' || (p.baseStats.spa >= 110 && p.baseStats.spe >= 80)) hasSpecSweeper = true;
    if (role === 'Physical Wall' || p.baseStats.def >= 110) hasPhysWall = true;
    if (role === 'Special Wall' || p.baseStats.spd >= 110) hasSpecWall = true;
    if (p.baseStats.spe >= 100) hasSpeedControl = true;
  });

  if (hasPhysSweeper) statBalanceScore += 20;
  if (hasSpecSweeper) statBalanceScore += 20;
  if (hasPhysWall) statBalanceScore += 20;
  if (hasSpecWall) statBalanceScore += 20;
  if (hasSpeedControl) statBalanceScore += 20;

  // 4. GENERATION-SPECIFIC MECHANICS (10%)
  let mechanicsScore = 0;
  if (!mechanic) {
    mechanicsScore = 100; // Perfect score if the game has no special mechanics (Gens 1-5, Gen 8 standard)
  } else if (mechanic === 'Mega') {
    // Check if at least one Pokémon holds its Mega Stone
    const hasMega = activeTeam.some((p, idx) => {
      const itemId = activeItems[idx];
      return p.mega && p.mega.some(stone => stone.toLowerCase().replace(/\s+/g, '') === itemId);
    });
    mechanicsScore = hasMega ? 100 : 30; // 30 points base, 100 if utilized
  } else if (mechanic === 'Z-Crystal') {
    // Check if at least one Pokémon holds a Z-Crystal
    const hasZ = activeTeam.some((_, idx) => {
      const itemId = activeItems[idx];
      return itemId && itemId.endsWith('iumz');
    });
    mechanicsScore = hasZ ? 100 : 30;
  } else if (mechanic === 'Terastal') {
    // Paldea Terastallization check: If a non-default Tera type is selected, boost!
    const hasTera = activeTeraTypes.some(type => type && type !== 'default');
    mechanicsScore = hasTera ? 100 : 40;
  }

  // COMPUTE FINAL AGGREGATE SCORE
  let overallScore = 0;
  if (!gameHasItems) {
    // Redistribute weight since items are disabled: Coverage 50%, Stat Balance 35%, Mechanics 15%
    const coverageWeight = typeCoverageScore * 0.50;
    const statWeight = statBalanceScore * 0.35;
    const mechWeight = mechanicsScore * 0.15;
    overallScore = Math.round(coverageWeight + statWeight + mechWeight);
  } else {
    // Standard weight: Coverage 40%, Item Synergy 30%, Stat Balance 20%, Mechanics 10%
    const coverageWeight = typeCoverageScore * 0.40;
    const itemWeight = itemSynergyScore * 0.30;
    const statWeight = statBalanceScore * 0.20;
    const mechWeight = mechanicsScore * 0.10;
    overallScore = Math.round(coverageWeight + itemWeight + statWeight + mechWeight);
  }

  // Adjust score for small team sizes (penalize slightly if team is under 4 Pokémon to encourage full builders)
  if (activeTeam.length < 3) {
    overallScore = Math.max(10, Math.round(overallScore * 0.5));
  } else if (activeTeam.length < 6) {
    overallScore = Math.max(20, Math.round(overallScore * 0.85));
  }

  // Rating translation
  let ratingText = 'Fledgling Trainer';
  let ratingColor = 'text-red-500 border-red-500/20 bg-red-500/10 shadow-red-500/10';
  
  if (overallScore >= 95) {
    ratingText = 'Champion Tier';
    ratingColor = 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10 shadow-cyan-400/20';
  } else if (overallScore >= 80) {
    ratingText = 'Elite Four Caliber';
    ratingColor = 'text-indigo-400 border-indigo-400/20 bg-indigo-400/10 shadow-indigo-400/20';
  } else if (overallScore >= 65) {
    ratingText = 'Gym Leader Material';
    ratingColor = 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10 shadow-emerald-400/20';
  } else if (overallScore >= 50) {
    ratingText = 'Rising Star';
    ratingColor = 'text-amber-400 border-amber-400/20 bg-amber-400/10 shadow-amber-400/20';
  }

  // AI Critic text comments
  const criticFeedback: string[] = [];
  
  // 1. Weakness Critique
  const heavyWeaknesses = Object.entries(weaknessCount)
    .filter(([_, count]) => count >= 3)
    .map(([type]) => type);

  if (heavyWeaknesses.length > 0) {
    criticFeedback.push(
      `⚠️ **Severe defensive overlap:** Your team is highly vulnerable to **${heavyWeaknesses.join(', ')}** (3+ members take super-effective damage). Consider replacing a member with a Flying-type, a Ground-type, or a Steel-type to absorb these hits.`
    );
  }

  // 2. STAB Critique
  const missingCoverage = activeGenTypes.filter(t => !hitSuperEffectively.has(t) && t !== 'Normal');
  if (missingCoverage.length > 5) {
    criticFeedback.push(
      `⚔️ **Offensive gaps:** You lack super-effective STAB coverage against **${missingCoverage.slice(0, 4).join(', ')}** and others. Expanding type varieties will let you break through tough walls.`
    );
  } else if (missingCoverage.length === 0) {
    criticFeedback.push(
      `🌟 **Flawless offensive coverage!** Your team's STAB types can hit every single defending type in the game for super-effective damage.`
    );
  }

  // 3. Bulky Walls / Speed Balance Critique
  const critStats: string[] = [];
  if (!hasSpeedControl) critStats.push('a fast sweeper (Speed ≥ 100)');
  if (!hasPhysWall && !hasSpecWall) critStats.push('a dedicated wall/defensive pivot (Defense/Sp.Def ≥ 110)');
  if (!hasPhysSweeper && !hasSpecSweeper) critStats.push('a setup sweeper (Attack/Sp.Atk ≥ 110)');

  if (critStats.length > 0) {
    criticFeedback.push(
      `📊 **Stat imbalance:** Your roster lacks ${critStats.join(' or ')}. A balanced team needs speed control and bulky pivots to handle competitive switch-ins.`
    );
  }

  // 4. Mechanic Critique
  if (mechanic === 'Mega' && !activeItems.some(id => id && id.endsWith('ite'))) {
    criticFeedback.push(
      `🌀 **Mega Evolution unused:** You are in Kalos (Gen 6) but none of your Pokémon are carrying a **Mega Stone**. Equipping a Mega Stone (e.g. Lucarionite on Lucario) will unlock massive stat increases!`
    );
  } else if (mechanic === 'Z-Crystal' && !activeItems.some(id => id && id.endsWith('iumz'))) {
    criticFeedback.push(
      `💎 **Z-Moves unused:** You have no **Z-Crystals** equipped. In Alola, utilizing a Z-Crystal lets a Pokémon launch a devastating, un-blockable strike once per battle.`
    );
  } else if (mechanic === 'Terastal' && !activeTeraTypes.some(t => t && t !== 'default')) {
    criticFeedback.push(
      `✨ **Terastallization unused:** You have not designated a custom **Tera Type** for your team. Fine-tuning a Pokémon's Tera Type in Paldea lets you change type defensively or maximize STAB damage.`
    );
  }

  // Default encouraging feedback
  if (criticFeedback.length === 0) {
    criticFeedback.push(
      `💎 **Masterfully constructed team!** Your synergy, held items, stat distribution, and coverage match elite championship standards. Good luck in battle!`
    );
  }

  // Format weaknesses and resistances lists
  const sortedWeaknesses = Object.entries(weaknessCount)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const sortedResistances = Object.entries(resistanceCount)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    score: overallScore,
    ratingText,
    ratingColor,
    typeCoverageScore,
    itemSynergyScore,
    statBalanceScore,
    mechanicsScore,
    weaknesses: sortedWeaknesses,
    resistances: sortedResistances,
    offensiveSTABTypes: Array.from(teamSTABs),
    offensiveCoverageGapTypes: missingCoverage,
    suggestions,
    criticFeedback
  };
};
