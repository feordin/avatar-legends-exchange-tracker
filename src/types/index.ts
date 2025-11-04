// Approach types for combat exchanges
export type Approach = 'defend-maneuver' | 'advance-attack' | 'evade-observe' | 'none';

// Stance result from rolling dice
export interface Stance {
  result: number; // The dice roll result
  techniquesAllowed: number; // Number of techniques allowed based on stance (for NPCs)
  // Technique availability for PCs based on Avatar Legends rules
  canUseBasicMastered: number; // How many basic/mastered techniques
  canUseLearnedPracticed: boolean; // Can use learned (with fatigue) or practiced
  requiresBalanceShift: boolean; // 6- requires balance shift to use technique
}

// Balance tracker - represents opposing values
export interface Balance {
  leftPrinciple: string; // e.g., "Control"
  rightPrinciple: string; // e.g., "Freedom"
  current: number; // -3 to +3, negative is left, positive is right
  min: number; // typically -3
  max: number; // typically +3
}

// Conditions that can affect characters
export type ConditionType = 'afraid' | 'angry' | 'guilty' | 'insecure' | 'troubled' |
  'foolish' | 'desperate' | 'jaded' | 'despondent' | 'hopeless' | 'frantic' |
  'disgusted' | 'morose' | 'manic' | 'offended' | 'humiliated' | 'fixated' |
  'frustrated' | 'vengeful' | 'stubborn' | 'distracted' | 'overbearing' |
  'zealous' | 'overconfident';

export interface Condition {
  type: ConditionType;
  marked: boolean;
}

// Status effects
export interface Status {
  id: string;
  name: string;
  description: string;
  techniquesModifier?: number; // Modifies number of techniques allowed
}

// Modifiers that apply to rolls or actions
export interface Modifier {
  id: string;
  type: 'forward' | 'ongoing';
  value: number; // +1, -1, etc.
  appliesTo?: string; // Specific action or roll type it applies to
  description: string;
}

// Base character interface
export interface Character {
  id: string;
  name: string;
  imageUrl?: string;

  // Combat exchange state
  approach: Approach;
  stance: Stance | null;
  techniquesModifier: number; // Manual adjustment to techniques (e.g., from balance shift)
  selectedTechniques: SelectedTechnique[]; // Techniques selected for current exchange

  // Core stats
  fatigue: number; // Current fatigue
  maxFatigue: number; // Maximum fatigue (varies by character)
  balance: Balance;

  // Conditions and effects
  conditions: Condition[];
  statuses: Status[];
  modifiers: Modifier[];

  // Base state for resetting
  baseState: {
    fatigue: number;
    balance: Balance;
    conditions: Condition[];
    statuses: Status[];
  };
}

// Technique mastery levels (only track advanced techniques - basic are universal)
export type TechniqueLevel = 'learned' | 'practiced' | 'mastered';

// Training types
export type TrainingType = 'universal' | 'air' | 'water' | 'earth' | 'fire' | 'weapons' | 'technology' | 'group';

// Character's learned technique (part of character sheet)
export interface CharacterTechnique {
  id: string;
  name: string;
  level: TechniqueLevel;
  training: TrainingType;
}

// Selected technique for current exchange
export interface SelectedTechnique {
  techniqueId: string; // References CharacterTechnique.id or 'basic' for basic techniques
  name: string;
  level: TechniqueLevel | 'basic';
  costsFatigue: boolean; // True for learned techniques
}

// Player Character with playbook info
export interface PC extends Character {
  type: 'pc';
  playbook: string; // e.g., "The Bold", "The Guardian"
  training?: string[]; // Types of training (Air, Earth, Fire, Water, Weapons)
  techniques: CharacterTechnique[]; // PC's learned techniques
}

// Non-Player Character
export interface NPC extends Character {
  type: 'npc';
  role?: string; // Brief descriptor
  difficulty?: 'minor' | 'moderate' | 'major'; // NPC power level
}

// Union type for all characters
export type AnyCharacter = PC | NPC;

// Exchange state
export interface ExchangeState {
  pcs: PC[];
  npcs: NPC[];
  round: number;
  phase: 'setup' | 'approach' | 'stance' | 'action' | 'resolution';
}

// Saved character templates for quick loading
export interface SavedTemplate {
  id: string;
  name: string;
  data: Omit<PC, 'id'> | Omit<NPC, 'id'>;
  createdAt: number;
  updatedAt: number;
}

// Action order entry
export interface ActionOrder {
  characterId: string;
  character: AnyCharacter;
  approach: Approach;
  priority: number; // Lower numbers go first
}
