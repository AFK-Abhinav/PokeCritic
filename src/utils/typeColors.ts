export interface TypeStyle {
  bg: string;      // Tailwind background gradient
  border: string;  // Border color style
  glow: string;    // Box shadow glow
  text: string;    // Custom text styling
}

export const typeStyles: { [key: string]: TypeStyle } = {
  Normal: {
    bg: 'from-slate-400 to-slate-500',
    border: 'border-slate-400/30',
    glow: 'shadow-slate-400/20',
    text: 'text-slate-300',
  },
  Fire: {
    bg: 'from-orange-500 to-red-600',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/25',
    text: 'text-orange-400',
  },
  Water: {
    bg: 'from-blue-400 to-blue-600',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/25',
    text: 'text-blue-400',
  },
  Grass: {
    bg: 'from-emerald-400 to-green-600',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/25',
    text: 'text-emerald-400',
  },
  Electric: {
    bg: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400/30',
    glow: 'shadow-yellow-400/25',
    text: 'text-yellow-400',
  },
  Ice: {
    bg: 'from-cyan-300 to-sky-500',
    border: 'border-cyan-400/30',
    glow: 'shadow-cyan-400/25',
    text: 'text-cyan-300',
  },
  Fighting: {
    bg: 'from-red-600 to-rose-800',
    border: 'border-red-600/30',
    glow: 'shadow-red-600/25',
    text: 'text-rose-400',
  },
  Poison: {
    bg: 'from-purple-500 to-indigo-700',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/25',
    text: 'text-purple-400',
  },
  Ground: {
    bg: 'from-amber-600 to-yellow-800',
    border: 'border-amber-600/30',
    glow: 'shadow-amber-600/25',
    text: 'text-amber-500',
  },
  Flying: {
    bg: 'from-indigo-400 to-sky-400',
    border: 'border-indigo-400/30',
    glow: 'shadow-indigo-400/25',
    text: 'text-indigo-350',
  },
  Psychic: {
    bg: 'from-pink-400 to-fuchsia-600',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/25',
    text: 'text-pink-400',
  },
  Bug: {
    bg: 'from-lime-500 to-green-650',
    border: 'border-lime-500/30',
    glow: 'shadow-lime-500/25',
    text: 'text-lime-400',
  },
  Rock: {
    bg: 'from-yellow-600 to-amber-800',
    border: 'border-yellow-650/30',
    glow: 'shadow-yellow-600/25',
    text: 'text-yellow-500',
  },
  Ghost: {
    bg: 'from-purple-700 to-violet-900',
    border: 'border-purple-700/30',
    glow: 'shadow-purple-700/25',
    text: 'text-violet-400',
  },
  Dragon: {
    bg: 'from-indigo-600 to-purple-800',
    border: 'border-indigo-650/30',
    glow: 'shadow-indigo-600/25',
    text: 'text-indigo-400',
  },
  Dark: {
    bg: 'from-slate-700 to-slate-900',
    border: 'border-slate-700/35',
    glow: 'shadow-slate-800/25',
    text: 'text-slate-400',
  },
  Steel: {
    bg: 'from-zinc-400 to-slate-500',
    border: 'border-zinc-400/35',
    glow: 'shadow-zinc-400/20',
    text: 'text-zinc-300',
  },
  Fairy: {
    bg: 'from-pink-300 to-rose-450',
    border: 'border-pink-300/30',
    glow: 'shadow-pink-300/25',
    text: 'text-pink-300',
  },
};
