import type { Pokemon } from './pokemon';

export interface Item {
  id: string;
  name: string;
  generation: number; // Debut generation
  category: 'offensive' | 'defensive' | 'support' | 'mechanic' | 'berry';
  description: string;
  reason: string; // The reason template for auto-suggest
  evalSuitability: (poke: Pokemon) => number; // Returns score 0-100
}

export const items: Item[] = [
  // Generation 2+
  {
    id: 'leftovers',
    name: 'Leftovers',
    generation: 2,
    category: 'defensive',
    description: 'A held item that gradually restores HP during battle.',
    reason: 'it provides steady passive healing, which is invaluable for high-HP defensive pivots and walls.',
    evalSuitability: (poke: Pokemon) => {
      // Best on bulky walls and tanks
      let score = 30;
      if (poke.baseStats.hp >= 90) score += 30;
      if (poke.baseStats.def >= 90 || poke.baseStats.spd >= 90) score += 30;
      if (poke.name === 'Blissey' || poke.name === 'Snorlax' || poke.name === 'Toxapex' || poke.name === 'Umbreon') score += 10;
      return score;
    }
  },
  {
    id: 'quickclaw',
    name: 'Quick Claw',
    generation: 2,
    category: 'support',
    description: 'A held item that occasionally allows the holder to move first.',
    reason: 'it compensates for its slow speed by giving a chance to strike first in critical situations.',
    evalSuitability: (poke: Pokemon) => {
      // Good on extremely slow attackers
      if (poke.baseStats.spe <= 60 && (poke.baseStats.atk >= 100 || poke.baseStats.spa >= 100)) {
        return 75;
      }
      return 20;
    }
  },
  
  // Generation 3+
  {
    id: 'choiceband',
    name: 'Choice Band',
    generation: 3,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It boosts Attack, but only allows the use of one move.',
    reason: 'it dramatically boosts its already massive physical Attack, transforming it into an unstoppable wallbreaker at the cost of being locked into one move.',
    evalSuitability: (poke: Pokemon) => {
      // Physical sweepers
      if (poke.baseStats.atk >= 105 && poke.baseStats.spe >= 75) {
        return Math.min(100, poke.baseStats.atk - 20 + (poke.baseStats.spe / 2));
      }
      return 10;
    }
  },
  {
    id: 'shellbell',
    name: 'Shell Bell',
    generation: 3,
    category: 'defensive',
    description: 'An item to be held by a Pokémon. The holder regains a little HP every time it inflicts damage.',
    reason: 'it restores HP proportionally to the high damage it inflicts, boosting its longevity during sweep campaigns.',
    evalSuitability: (poke: Pokemon) => {
      // Decent on bulky attackers
      if ((poke.baseStats.atk >= 100 || poke.baseStats.spa >= 100) && poke.baseStats.hp >= 80) {
        return 65;
      }
      return 30;
    }
  },

  // Generation 4+
  {
    id: 'lifeorb',
    name: 'Life Orb',
    generation: 4,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It boosts the power of moves, but at the cost of some HP on each hit.',
    reason: 'it maximizes damage output on all moves by 30% without locking it into a single choice, perfect for versatile sweepers.',
    evalSuitability: (poke: Pokemon) => {
      // Glass cannons or versatile sweepers
      const maxOffense = Math.max(poke.baseStats.atk, poke.baseStats.spa);
      if (maxOffense >= 100 && poke.baseStats.spe >= 85) {
        return 90;
      }
      if (maxOffense >= 90) return 60;
      return 20;
    }
  },
  {
    id: 'choicespecs',
    name: 'Choice Specs',
    generation: 4,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It boosts Sp. Atk, but only allows the use of one move.',
    reason: 'it amplifies its high Special Attack by 1.5x, enabling devastating special sweeps without needing setup turns.',
    evalSuitability: (poke: Pokemon) => {
      // Special sweepers
      if (poke.baseStats.spa >= 105 && poke.baseStats.spe >= 75) {
        return Math.min(100, poke.baseStats.spa - 20 + (poke.baseStats.spe / 2));
      }
      return 10;
    }
  },
  {
    id: 'choicescarf',
    name: 'Choice Scarf',
    generation: 4,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It boosts Speed, but only allows the use of one move.',
    reason: 'it boosts Speed by 50%, letting it outspeed the entire unboosted metagame to act as the ultimate revenge killer.',
    evalSuitability: (poke: Pokemon) => {
      // Offensive speed control
      const maxOff = Math.max(poke.baseStats.atk, poke.baseStats.spa);
      if (maxOff >= 90 && poke.baseStats.spe >= 70 && poke.baseStats.spe <= 110) {
        return 85;
      }
      return 30;
    }
  },
  {
    id: 'focussash',
    name: 'Focus Sash',
    generation: 4,
    category: 'defensive',
    description: 'An item to be held by a Pokémon. If the holder has full HP, it will endure any potential KO attack with 1 HP.',
    reason: 'its low defensive stats make it fragile, but Focus Sash guarantees it survives at least one turn to land a devastating counter or set up hazards.',
    evalSuitability: (poke: Pokemon) => {
      // Fragile glass cannons
      const isFragile = poke.baseStats.hp < 75 && poke.baseStats.def < 75 && poke.baseStats.spd < 75;
      const isFast = poke.baseStats.spe >= 95;
      if (isFragile && isFast) return 95;
      if (isFast) return 60;
      return 15;
    }
  },
  {
    id: 'expertbelt',
    name: 'Expert Belt',
    generation: 4,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It boosts the power of super-effective moves.',
    reason: 'its diverse dual-typing and deep movepool allow it to hit a wide array of targets for super-effective damage, capitalizing on the 20% damage boost.',
    evalSuitability: (poke: Pokemon) => {
      // Good on mixed attackers with dual typing
      if (poke.types.length >= 2 && poke.baseStats.atk >= 90 && poke.baseStats.spa >= 90) {
        return 80;
      }
      if (poke.types.length >= 2) return 60;
      return 40;
    }
  },

  // Generation 5+
  {
    id: 'eviolite',
    name: 'Eviolite',
    generation: 5,
    category: 'defensive',
    description: 'A mysterious evolutionary lump. Held by a Pokémon that can still evolve, it boosts Defense and Sp. Def by 50%.',
    reason: 'as a non-fully evolved Pokémon, it receives an incredible 50% boost to both Defense and Special Defense, making it bulkier than its evolution!',
    evalSuitability: (poke: Pokemon) => {
      // Absolute gold on non-evolved monsters
      if (!poke.evolved) {
        if (poke.name === 'Chansey') return 100;
        return 90; // Excellent on Pikachu or other NFEs
      }
      return 0; // Literally useless on fully evolved
    }
  },
  {
    id: 'rockyhelmet',
    name: 'Rocky Helmet',
    generation: 5,
    category: 'defensive',
    description: 'If the holder is hit by a contact move, the attacker takes damage equal to 1/6th of their max HP.',
    reason: 'its immense physical Defense naturally draws physical contact moves, punishing attackers with severe recoil damage.',
    evalSuitability: (poke: Pokemon) => {
      // High physical defense walls
      if (poke.baseStats.def >= 100 && poke.baseStats.hp >= 70) {
        return Math.min(95, poke.baseStats.def - 15);
      }
      return 25;
    }
  },
  {
    id: 'airballoon',
    name: 'Air Balloon',
    generation: 5,
    category: 'support',
    description: 'When held, the Pokémon floats in the air. When hit, the balloon pops.',
    reason: 'it completely negates its critical Ground-type weakness upon entry, letting it safely set up or counter Ground attackers.',
    evalSuitability: (poke: Pokemon) => {
      // High value for Fire, Steel, Electric, Poison, Rock types weak to Ground
      const hasGroundWeakness = poke.types.includes('Steel') || poke.types.includes('Fire') || poke.types.includes('Electric') || poke.types.includes('Poison') || poke.types.includes('Rock');
      if (hasGroundWeakness && !poke.types.includes('Flying')) {
        return 80;
      }
      return 35;
    }
  },

  // Generation 6+
  {
    id: 'assaultvest',
    name: 'Assault Vest',
    generation: 6,
    category: 'defensive',
    description: 'An item to be held by a Pokémon. It raises Sp. Def by 50%, but prevents the use of status moves.',
    reason: 'it has high natural physical bulk and offense. Assault Vest boosts its Special Defense by 50%, making it a colossal trade tank that can take hits from both sides.',
    evalSuitability: (poke: Pokemon) => {
      // Bulky attackers with high HP, high Atk/SpA, average SpD, and poor speed
      const off = Math.max(poke.baseStats.atk, poke.baseStats.spa);
      if (poke.baseStats.hp >= 80 && off >= 95 && poke.baseStats.spd >= 70 && poke.baseStats.spe <= 85) {
        return 90;
      }
      return 30;
    }
  },
  {
    id: 'weaknesspolicy',
    name: 'Weakness Policy',
    generation: 6,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. It sharply raises Attack and Sp. Atk if hit by a super-effective move.',
    reason: 'its great natural bulk and multiple defensive resistances ensure it can comfortably survive a super-effective strike to trigger a massive +2 offensive boost.',
    evalSuitability: (poke: Pokemon) => {
      // Bulky sweepers (like Dragonite, Tyranitar, Aegislash)
      if (poke.baseStats.hp >= 80 && (poke.baseStats.def >= 80 || poke.baseStats.spd >= 80)) {
        return 75;
      }
      return 25;
    }
  },

  // Generation 8+
  {
    id: 'heavydutyboots',
    name: 'Heavy-Duty Boots',
    generation: 8,
    category: 'support',
    description: 'These boots prevent the effects of traps set on the battlefield (like Stealth Rock or Spikes).',
    reason: 'its Flying type or general hazard sensitivity makes it vulnerable to Stealth Rock. These boots immune it to entry hazards, letting it pivot safely.',
    evalSuitability: (poke: Pokemon) => {
      // Best on Flying types, Fire/Ice/Bug types, or high-switch pivots
      const weakToRocks = poke.types.includes('Flying') || poke.types.includes('Fire') || poke.types.includes('Ice') || poke.types.includes('Bug');
      if (weakToRocks) return 92;
      if (poke.name === 'Umbreon' || poke.name === 'Toxapex' || poke.name === 'Corviknight') return 80;
      return 30;
    }
  },

  // Generation 9+
  {
    id: 'loadeddice',
    name: 'Loaded Dice',
    generation: 9,
    category: 'offensive',
    description: 'An item to be held by a Pokémon. Holding it ensures multi-strike moves will hit more times.',
    reason: 'it possesses multi-strike capabilities (like Icicle Spear or Scale Shot). Loaded Dice guarantees hitting 4-5 times, maximizing its damage potential.',
    evalSuitability: (poke: Pokemon) => {
      // Specifically amazing on Baxcalibur (Icicle Spear) or Cinccino/Meowscarada, let's suggest it for Baxcalibur
      if (poke.name === 'Baxcalibur') return 95;
      return 15;
    }
  },
  {
    id: 'boosterenergy',
    name: 'Booster Energy',
    generation: 9,
    category: 'mechanic',
    description: 'An item to be held by Pokémon with Protosynthesis or Quark Drive. It boosts their highest stat in battle.',
    reason: 'as a Paradox Pokémon, this capsule immediately triggers its Protosynthesis/Quark Drive ability on switch-in, raising its highest stat without needing weather or terrain!',
    evalSuitability: (poke: Pokemon) => {
      if (poke.paradox) return 100;
      return 0; // Completely useless for non-paradox
    }
  }
];

// Dynamically generate Mega Stones for Gen 6 evaluation
export const getMegaStones = (poke: Pokemon): Item[] => {
  if (!poke.mega) return [];
  return poke.mega.map(stoneName => ({
    id: stoneName.toLowerCase().replace(/\s+/g, ''),
    name: stoneName,
    generation: 6,
    category: 'mechanic',
    description: `A Mega Stone enabling ${poke.name} to Mega Evolve in battle.`,
    reason: `it lets ${poke.name} Mega Evolve in battle, unlocking explosive stat boosts, a new ability, and superior competitive viability.`,
    evalSuitability: () => 100 // Mega stones are always a perfect 100 for their specific pokemon!
  }));
};

// Dynamically generate Z-Crystals for Gen 7 evaluation
export const getZCrystals = (poke: Pokemon): Item[] => {
  return poke.types.map(type => ({
    id: `${type.toLowerCase()}iumz`,
    name: `${type}ium Z`,
    generation: 7,
    category: 'mechanic',
    description: `A Z-Crystal enabling the use of ${type}-type Z-Moves.`,
    reason: `it lets ${poke.name} unleash a devastating, high-powered ${type}-type Z-Move once per battle to breakthrough defensive walls.`,
    evalSuitability: () => 90 // Highly suitable since it matches their STAB types
  }));
};
