# 🎮 PokéTeam Critic
# PokeCritic
**PokéTeam Critic** is a premium, client-side, Pokédex-inspired Pokémon Team Evaluator and Auto-Suggestion engine. Built with **React**, **TypeScript**, and **Tailwind CSS v4**, this application empowers trainers to draft a custom roster of up to 6 Pokémon, assign held items, and instantly calculate a dynamic **Team Synergy & Viability Score** adjusted for the specific mechanics of their chosen campaign version (Generation 1 to Generation 9).
A modern, AI‑powered Pokémon critique web app that lets users explore, rate, and discuss Pokémon. Built with a sleek UI, responsive design, and a backend powered by cutting‑edge machine learning models.
---
## Features
- Interactive pokémon catalog with stats and abilities
- AI generated critiques and battle tips
- User comments and rating system
- Dark mode with vibrant gradients and glassmorphism UI
- Responsive layout for desktop and mobile
## 🌟 Key Features
## Tech Stack
- **Frontend**: HTML, vanilla CSS (custom design system with gradients, Google Fonts *Inter*), JavaScript
- **Backend**: Node.js/Express (or your preferred stack) handling AI inference
- **AI**: OpenAI/GPT‑4 Turbo for critique generation
### 1. 📂 Complete 1,025 National Pokédex Integration
- Access the entire library of official Pokémon species from Bulbasaur (ID 1) in Generation 1 up to Pecharunt (ID 1025) in Generation 9.
- Dynamically sourced via a custom PokeAPI GraphQL utility to gather accurate base stats, primary/secondary typings, and evolutionary trees.
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/PokeCritic.git
   cd PokeCritic
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.
### 2. 🎮 Generational Boundary Adaptations
Select one of 11 mainline game campaigns to automatically restrict items, battles, and typing rules:
- **Classic Runs (Gen 1 & Gen 3 FR/LG)**: Held items are disabled entirely, conforming to retro rules.
- **Old-School Type Charts**: In Generations 2–5, the **Fairy** type is automatically removed, and the **Steel** type's retro resistances (resisting Ghost and Dark) are dynamically restored.
- **Mega Evolution (Gen 6)**: Activates specific Mega Stone compatibility (e.g., *Charizardite*, *Pidgeotite*, etc.) for eligible species.
- **Z-Crystals (Gen 7)**: Generates STAB-compatible Z-Crystals per species card.
- **Terastallization (Gen 9)**: Unlocks custom Tera Type dropdown selectors per Pokémon card to preview dynamic defensive overrides.
## Usage
- Browse the Pokémon gallery and click any Pokémon to view detailed stats.
- Press **Generate Critique** to receive an AI‑powered analysis.
- Share your thoughts via the comment section.
### 3. 🎒 Intelligent Auto-Suggestion Held Item Engine
- If a held item is left as **None / Auto-Suggest**, a custom heuristic engine analyzes the Pokémon's stats to deduce its competitive role:
  - **Bulky Defense/Pivot** (e.g., Toxic, Wall, Recovery) $\to$ Suggests *Leftovers* or *Rocky Helmet*.
  - **Physical / Special Sweeper** $\to$ Suggests *Choice Band*, *Choice Specs*, *Life Orb*, or *Expert Belt*.
  - **Glass Cannons** $\to$ Suggests *Focus Sash*.
- **Specialized Item Synergy Rules**:
  - Automatically restricts **Eviolite** (Defense/SpD +50%) exclusively to non-fully-evolved species (like Chansey, Pikachu, or Torchic).
  - Reserves **Booster Energy** exclusively for Gen 9 Paradox Pokémon to trigger *Protosynthesis/Quark Drive*.
  - Suggests signature **Mega Stones** for corresponding species.
## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug‑fix.
3. Ensure code follows the existing style (CSS variables, BEM naming).
4. Submit a pull request with a clear description of changes.
### 4. 📊 High-Fidelity Review Dashboard
- **Animated Circular SVG Score Gauge**: An interactive circular indicator that reflects your overall team score (0–100%) and shifts color dynamically (Cyan $\to$ Green $\to$ Amber $\to$ Red).
- **One-Click Equip Action**: View suggested items directly on the dashboard. Click **"Equip"** to instantly assign the recommended item to your Pokémon and watch your Synergy Score and feedback update in real time.
- **Defensive Type Matchups Grid**: Displays overall team immunities, resistances, weaknesses, and critical double weaknesses (4x damage).
- **AI-Style Critic Feedback**: Offers snappy, tactical, and highly contextual review lines analyzing speed tiers, physical/special balance, and held item synergy.
## License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
---
## 🛠️ Tech Stack
- **Frontend Core**: React 19 + TypeScript (enforced with strict `verbatimModuleSyntax`)
- **Scaffolder / Bundler**: Vite 8
- **Styling & Theme**: Tailwind CSS v4 (Custom dark mode, glassmorphic panels, dynamic type neon-glows)
- **Icons**: Lucide React
- **Data Gathering**: PokeAPI (compiled via a custom Node GraphQL scraper script)
---
## 🚀 Local Development
### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).
### 2. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/your-username/PokeCritic.git
# Navigate into the project folder
cd PokeCritic
# Install dependencies
npm install
```
### 3. Running Locally
To start the Vite local development server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.
### 4. Production Build
To test the production compilation and bundle optimization:
```bash
npm run build
```
---
## 📊 How the Synergy Score is Calculated
The team evaluator calculates a **100-point composite rating** weighted as follows:
|
 Category 
|
 Weight 
|
 Evaluation Logic 
|
|
:---
|
:---:
|
:---
|
|
**
Type Matchups & STAB
**
|
**
40%
**
|
 Rewards team-wide typing diversity. Penalizes overlapping weaknesses to a single type (e.g. multiple Ground weaknesses) and rewards STAB attack coverages. 
|
|
**
Held Item Synergy
**
|
**
30%
**
|
 Validates item choices. Rewards optimal combinations (e.g., Eviolite on Chansey, Booster Energy on Great Tusk) and penalizes empty slots or anti-synergy holds. 
|
|
**
Stat Balance
**
|
**
20%
**
|
 Measures standard speed distributions, presence of defensive pivots, and physical vs. special attacking ratios. 
|
|
**
Campaign Mechanics
**
|
**
10%
**
|
 Checks usage of Mega Stones, Z-Crystals, or custom Terastallization based on the campaign version. 
|
---
## 📈 Running the Pokédex Scraper
To manually fetch or update the 1,025 Pokémon database from PokéAPI's GraphQL server:
```bash
node src/scripts/fetch_pokedex.cjs
```
This script queries PokeAPI, maps stats and types, deduces evolution chains for Eviolite eligibility, and overwrites the local `src/data/pokemon.ts` automatically.
