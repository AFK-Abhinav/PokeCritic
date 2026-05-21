export interface Game {
  id: string;
  name: string;
  generation: number;
  hasItems: boolean;
  mechanic?: 'Mega' | 'Z-Crystal' | 'Terastal';
  mechanicName?: string;
  description: string;
  logoColor: string; // Tailored glow color for UI
}

export const games: Game[] = [
  {
    id: 'rby',
    name: 'Red / Blue / Yellow',
    generation: 1,
    hasItems: false,
    description: 'The retro Kanto region where it all began. Simple mechanics, fast battles, and no held items or abilities.',
    logoColor: 'from-red-600 to-blue-600',
  },
  {
    id: 'gsc',
    name: 'Gold / Silver / Crystal',
    generation: 2,
    hasItems: true,
    description: 'Explore Johto and Kanto. The generation that introduced Held Items, Day/Night cycles, and Special stat split.',
    logoColor: 'from-yellow-500 to-teal-600',
  },
  {
    id: 'emerald',
    name: 'Ruby / Sapphire / Emerald',
    generation: 3,
    hasItems: true,
    description: 'The tropical Hoenn region. Introduced Pokémon Abilities and Double Battles. Held items become highly competitive.',
    logoColor: 'from-emerald-500 to-sky-500',
  },
  {
    id: 'frlg',
    name: 'FireRed / LeafGreen',
    generation: 3,
    hasItems: false, // Local campaign rules: held items are restricted or not used locally
    description: 'Return to Kanto. While in Gen 3, the local main-game campaign disables active held item usage/obtainability.',
    logoColor: 'from-red-500 to-green-500',
  },
  {
    id: 'dppt',
    name: 'Diamond / Pearl / Platinum',
    generation: 4,
    hasItems: true,
    description: 'The Sinnoh region. The legendary physical/special category split for individual moves revolutionized team building.',
    logoColor: 'from-blue-700 to-purple-700',
  },
  {
    id: 'hgss',
    name: 'HeartGold / SoulSilver',
    generation: 4,
    hasItems: true,
    description: 'A magnificent remake of Johto with Gen 4 mechanics. Follow-behind Pokémon and beautiful modern graphics.',
    logoColor: 'from-amber-400 to-slate-400',
  },
  {
    id: 'bw',
    name: 'Black / White (1 & 2)',
    generation: 5,
    hasItems: true,
    description: 'The Unova region. A rich story-focused generation featuring only new Pokémon initially, and powerful items like Eviolite.',
    logoColor: 'from-slate-800 to-slate-200',
  },
  {
    id: 'xy',
    name: 'X / Y',
    generation: 6,
    hasItems: true,
    mechanic: 'Mega',
    mechanicName: 'Mega Evolution',
    description: 'The Kalos region in full 3D! Unleash the power of Mega Evolution to temporarily transcend boundaries.',
    logoColor: 'from-sky-400 to-rose-500',
  },
  {
    id: 'sm',
    name: 'Sun / Moon / USUM',
    generation: 7,
    hasItems: true,
    mechanic: 'Z-Crystal',
    mechanicName: 'Z-Moves',
    description: 'The sunny Alola islands. Replaces Gyms with Island Trials and introduces destructive Z-Moves.',
    logoColor: 'from-amber-500 to-purple-600',
  },
  {
    id: 'swsh',
    name: 'Sword / Shield',
    generation: 8,
    hasItems: true,
    description: 'The UK-inspired Galar region. Explore the Wild Area and compete in massive stadium battles.',
    logoColor: 'from-cyan-500 to-magenta-500',
  },
  {
    id: 'sv',
    name: 'Scarlet / Violet',
    generation: 9,
    hasItems: true,
    mechanic: 'Terastal',
    mechanicName: 'Terastallization',
    description: 'The open-world Paldea region. Terastallize your Pokémon to change their types mid-battle and gain STAB boosts.',
    logoColor: 'from-orange-500 to-indigo-600',
  },
];
