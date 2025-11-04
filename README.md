# Avatar Legends Exchange Tracker

A single-page web application that helps Game Masters track combat exchanges in the Avatar Legends: The Roleplaying Game.

## Description

This tracker is designed to streamline the complex mechanics of Avatar Legends combat exchanges by providing:
- **Real-time stat tracking** for up to 6 PCs and 6 NPCs on a single screen
- **Automated calculations** for action order, stance rolls, and technique counts
- **Comprehensive state management** including fatigue, balance, conditions, statuses, and modifiers
- **Offline functionality** with local storage persistence - no internet connection required
- **Template system** to save and quickly load frequently-used characters

Built with React and TypeScript, this tool eliminates the need for manual tracking sheets and dice calculators, allowing GMs to focus on storytelling while the app handles the mechanical overhead.

## Quick Start

### Installation and Development

```bash
# Clone the repository
git clone https://github.com/feordin/avatar-legends-exchange-tracker.git
cd avatar-legends-exchange-tracker

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally (optional)
npm run preview
```

The production-ready files will be in the `dist/` directory, which can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

### Prerequisites

- **Node.js** v16 or higher
- **npm** v7 or higher (comes with Node.js)

## Features

### Character Management
- **Support for 6 PCs and 6 NPCs** simultaneously on one screen
- Add, remove, and manage characters with detailed stats
- Save character templates for quick loading in future sessions
- Character images and names for easy identification

### Combat Exchange Tracking
- **Approach Selection**: Choose between Defend & Maneuver, Advance & Attack, Evade & Observe, or Not Acting
- **Automatic Action Order**: Characters are automatically sorted by approach priority
- **Stance Rolling**: Roll 2d6 for stance and automatically calculate techniques allowed
- **Technique Calculation**: Accounts for both stance rolls and status modifiers

### Character Stats
- **Fatigue Tracking**: Track fatigue from 0-5 with easy increment/decrement
- **Balance Tracker**: Customizable balance principles (e.g., Control ↔ Freedom) with -3 to +3 tracking
- **Conditions**: Mark and track the five core conditions (Afraid, Angry, Guilty, Insecure, Troubled)
- **Statuses**: Add custom statuses with technique modifiers
- **Modifiers**: Track Forward and Ongoing modifiers with context-specific application

### Session Management
- **Exchange Phases**: Track rounds and phases (Setup, Approach, Stance, Action, Resolution)
- **Reset to Base**: Restore characters to their rested state
- **Persistent Storage**: All data saved locally in the browser
- **Template System**: Save and load PC playbooks and NPC stat blocks

### Offline-First
- Fully functional without an internet connection
- All data stored locally in browser storage
- No server required

## Usage

### Adding Characters

1. Click "Add PC" or "Add NPC" in the control panel
2. Fill in the character details:
   - Name (required)
   - Image URL (optional)
   - For PCs: Select playbook and training types
   - For NPCs: Add role and difficulty level
   - Set balance principles
3. Optionally check "Save as template" to reuse this character later
4. Click "Add Character"

### Running a Combat Exchange

1. **Setup Phase**: Add all participating characters
2. **Approach Phase**: Each character selects their approach
3. **Stance Phase**: Roll stance for each character
4. **Action Phase**: Follow the action order panel to resolve actions
   - Characters are automatically sorted: Defend & Maneuver → Advance & Attack → Evade & Observe
   - Track fatigue, balance shifts, conditions, and modifiers as the exchange progresses
5. **Resolution Phase**: Apply lasting effects
6. Click "Next Phase" to advance or "Reset Phase" to start over

### Managing Character State

- **Fatigue**: Use +/- buttons to adjust (0-5 range)
- **Balance**: Use ← → arrows to shift balance
- **Conditions**: Click condition buttons to toggle marked status
- **Statuses**: Add custom statuses with technique modifiers
- **Modifiers**: Add Forward or Ongoing modifiers with descriptions
- **Reset**: Click "Reset to Base" to restore character to rested state

### Templates

- When adding a character, check "Save as template" to save for future use
- Click "Load PC Template" or "Load NPC Template" to quickly add saved characters
- Templates are stored locally and persist between sessions

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with responsive design
- **Local Storage API** - Data persistence

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server with hot module replacement at `http://localhost:5173`

### `npm run build`
Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`
Locally preview the production build before deploying.

### `npm run lint`
Runs ESLint to check code quality and consistency.

## Deployment

The built application is a static site that can be deployed to any static hosting service:

**Netlify / Vercel:**
- Connect your repository and set build command to `npm run build`
- Set publish directory to `dist`

**GitHub Pages:**
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

**Other Static Hosts:**
Simply upload the contents of the `dist/` folder after running `npm run build`

## Project Structure

```
src/
├── components/          # React components
│   ├── CharacterCard.tsx       # Individual character display
│   ├── ExchangeTracker.tsx     # Main tracker component
│   ├── AddCharacterForm.tsx    # Character creation form
│   ├── ActionOrderPanel.tsx    # Action order display
│   └── TemplateManager.tsx     # Template management
├── context/            # React Context for state management
│   └── ExchangeContext.tsx
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useTemplates.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built for the Avatar Legends: The Roleplaying Game by Magpie Games
- Inspired by the need for better combat exchange tracking tools
