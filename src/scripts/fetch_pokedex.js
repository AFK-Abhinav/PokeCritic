const fs = require('fs');
const path = require('path');

const query = `
query getPokedex {
  pokemon_v2_pokemon(limit: 1025, order_by: {id: asc}) {
    id
    name
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemonspecy {
      generation_id
      evolves_from_species_id
    }
  }
}
`;

async function fetchPokedex() {
  console.log("Fetching Pokedex from PokeAPI GraphQL...");
  try {
    const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const pokemons = json.data.pokemon_v2_pokemon;
    console.log(`Successfully fetched ${pokemons.length} Pokemon!`);

    // 1. Gather not fully evolved IDs
    const notFullyEvolvedSet = new Set();
    pokemons.forEach(p => {
      const specy = p.pokemon_v2_pokemonspecy;
      if (specy && specy.evolves_from_species_id) {
        notFullyEvolvedSet.add(specy.evolves_from_species_id);
      }
    });

    // 2. Define Mega maps and Paradox ranges
    const megaMap = {
      3: ['Venusaurite'],
      6: ['Charizardite X', 'Charizardite Y'],
      9: ['Blastoisinite'],
      18: ['Pidgeotite'],
      65: ['Alakazite'],
      94: ['Gengarite'],
      130: ['Gyaradosite'],
      150: ['Mewtwonite X', 'Mewtwonite Y'],
      181: ['Ampharosite'],
      208: ['Steelixite'],
      212: ['Scizorite'],
      214: ['Heracronite'],
      229: ['Houndoominite'],
      248: ['Tyranitarite'],
      254: ['Sceptilite'],
      257: ['Blazikenite'],
      260: ['Swampertite'],
      282: ['Gardevoirite'],
      302: ['Sableyite'],
      303: ['Mawilite'],
      306: ['Aggronite'],
      308: ['Medichamite'],
      310: ['Manectrite'],
      319: ['Sharpedonite'],
      323: ['Cameruptite'],
      334: ['Altarianite'],
      354: ['Banettite'],
      359: ['Absolite'],
      362: ['Glalitite'],
      373: ['Salamencite'],
      376: ['Metagrossite'],
      380: ['Latiasite'],
      381: ['Latiosite'],
      428: ['Lopunnite'],
      445: ['Garchompite'],
      448: ['Lucarionite'],
      475: ['Galladite'],
      531: ['Audinite'],
      719: ['Diancite']
    };

    const isParadox = (id) => 
      (id >= 984 && id <= 995) || 
      (id >= 1005 && id <= 1010) || 
      (id >= 1020 && id <= 1023);

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Mapped Pokemon array
    const mappedList = pokemons.map(p => {
      const id = p.id;
      
      // Clean up names (e.g. "ho-oh" -> "Ho-Oh", "porygon-z" -> "Porygon-Z", otherwise capitalize)
      let name = p.name.split('-').map(capitalize).join('-');
      if (name.toLowerCase() === 'ho-oh') name = 'Ho-Oh';
      if (name.toLowerCase() === 'porygon-z') name = 'Porygon-Z';
      if (name.toLowerCase() === 'porygon2') name = 'Porygon2';
      
      const types = p.pokemon_v2_pokemontypes.map(t => capitalize(t.pokemon_v2_type.name));
      
      // Stats mapping
      const stats = {};
      p.pokemon_v2_pokemonstats.forEach(s => {
        const statName = s.pokemon_v2_stat.name;
        const val = s.base_stat;
        if (statName === 'hp') stats.hp = val;
        else if (statName === 'attack') stats.atk = val;
        else if (statName === 'defense') stats.def = val;
        else if (statName === 'special-attack') stats.spa = val;
        else if (statName === 'special-defense') stats.spd = val;
        else if (statName === 'speed') stats.spe = val;
      });

      // Default fallback stats if missing
      const baseStats = {
        hp: stats.hp || 60,
        atk: stats.atk || 60,
        def: stats.def || 60,
        spa: stats.spa || 60,
        spd: stats.spd || 60,
        spe: stats.spe || 60
      };

      const generation = p.pokemon_v2_pokemonspecy ? p.pokemon_v2_pokemonspecy.generation_id : 1;
      const evolved = !notFullyEvolvedSet.has(id);

      const entry = {
        id,
        name,
        types,
        baseStats,
        generation,
        evolved
      };

      if (megaMap[id]) entry.mega = megaMap[id];
      if (isParadox(id)) entry.paradox = true;

      return entry;
    });

    // Write to typescript file
    const fileContent = `export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStats;
  generation: number;
  evolved: boolean; // false for non-fully evolved (vital for Eviolite)
  paradox?: boolean; // Paradox Pokémon in Gen 9 (vital for Booster Energy)
  mega?: string[]; // Mega stones compatible in Gen 6
}

export const pokemonList: Pokemon[] = ${JSON.stringify(mappedList, null, 2)};
`;

    const outputPath = path.join(__dirname, '../data/pokemon.ts');
    fs.writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`Successfully generated complete Pokedex with ${mappedList.length} entries at ${outputPath}!`);

  } catch (error) {
    console.error("Error fetching or generating pokedex:", error);
    process.exit(1);
  }
}

fetchPokedex();
