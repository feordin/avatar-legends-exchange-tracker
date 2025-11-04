# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Avatar Legends Exchange Tracker is a single-page React application for tracking combat exchanges in the Avatar Legends: The Roleplaying Game. The app is offline-first, using browser localStorage for all data persistence.

## Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **CSS3** for styling (no CSS frameworks)
- **Local Storage API** for data persistence (no backend)

## Architecture Overview

### State Management Pattern

The application uses React Context API (`ExchangeContext`) as the single source of truth for all combat exchange state. This context manages:

- **Character collections**: Separate arrays for PCs (max 6) and NPCs (max 6)
- **Exchange phases**: setup → approach → stance → action → resolution
- **Round tracking**: Increments when returning from resolution to setup

All state mutations go through context methods (addPC, removeCharacter, modifyFatigue, etc.). Components never directly mutate state.

### Data Flow

1. **ExchangeProvider** wraps the entire app (src/main.tsx)
2. **ExchangeTracker** (main component) renders character cards and control panels
3. **CharacterCard** components display individual character state and provide controls
4. **ActionOrderPanel** calculates and displays turn order based on approaches

### Type System

All domain types are defined in `src/types/index.ts`:

- **Character hierarchy**: Base `Character` interface → `PC` / `NPC` unions → `AnyCharacter` type
- **Balance system**: Represents opposing principles (-3 to +3 range)
- **Stance mechanics**: 2d6 roll result + techniques allowed calculation
- **Statuses & Modifiers**: Track temporary effects with technique adjustments

### Key Business Logic

**Action Order Priority** (`src/utils/helpers.ts:calculateActionOrder`):
- Defend & Maneuver (priority 1) → Advance & Attack (2) → Evade & Observe (3)
- Characters with approach 'none' are excluded from action order

**Stance Rolling** (`src/utils/helpers.ts:rollStance`):
- Rolls 2d6 (standard Avatar Legends dice mechanic)
- 10+ = 3 techniques, 7-9 = 2 techniques, 2-6 = 1 technique
- Status effects can modify final technique count

**Balance Tracking**:
- Ranges from -3 (left principle) to +3 (right principle)
- Examples: "Control ↔ Freedom" or "Flexibility ↔ Structure"
- Clamped to min/max bounds on all modifications

### Base State System

Characters store a `baseState` snapshot containing:
- Initial fatigue level
- Starting balance position
- Default conditions (all unmarked)
- Persistent statuses

This allows "Reset to Base" functionality to restore characters to rested state between sessions while preserving their fundamental configuration.

### Template System

Templates (`src/hooks/useTemplates.ts`) save character configurations to localStorage:
- PC templates: Include playbook, training types, balance principles
- NPC templates: Include role, difficulty, base stats
- Templates are loaded via AddCharacterForm with pre-filled data

## Component Responsibilities

- **ExchangeTracker**: Main orchestrator, renders PC/NPC grids and control panels
- **CharacterCard**: Self-contained character display with inline editing controls
- **AddCharacterForm**: Character creation with optional template saving
- **ActionOrderPanel**: Calculates and displays turn order (read-only)
- **TemplateManager**: Load/delete saved character templates

## Local Storage Keys

- `avatar-exchange-state`: Current exchange state (auto-saved)
- `avatar-pc-templates`: Saved PC templates
- `avatar-npc-templates`: Saved NPC templates

## TypeScript Configuration

- Strict mode enabled with all recommended linting rules
- Module resolution: "bundler" (Vite-specific)
- No emitted JS files (Vite handles compilation)

## Game Rules Implementation

The app implements specific Avatar Legends mechanics:

1. **Exchange phases**: Linear progression with round tracking
2. **Approach selection**: Three action types + "not acting" option
3. **Stance rolling**: 2d6 with breakpoints at 7 and 10
4. **Fatigue**: 0-5 scale (representing exhaustion in combat)
5. **Conditions**: Five core emotional states (Afraid, Angry, Guilty, Insecure, Troubled)
6. **Balance principles**: Customizable opposing values representing character philosophy
