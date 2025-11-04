// Approach types for combat exchanges
export type Approach = 'defend-maneuver' | 'advance-attack' | 'evade-observe' | 'none';

// Stance result from rolling dice
export interface Stance {
  result: number; // The dice roll result
  techniquesAllowed: number; // Number of techniques allowed based on stance
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
export type ConditionType = 'afraid' | 'angry' | 'guilty' | 'insecure' | 'troubled';

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

  // Core stats
  fatigue: number; // 0-5 typically
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

// Player Character with playbook info
export interface PC extends Character {
  type: 'pc';
  playbook: string; // e.g., "The Bold", "The Guardian"
  training?: string[]; // Types of training (Air, Earth, Fire, Water, Weapons)
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
