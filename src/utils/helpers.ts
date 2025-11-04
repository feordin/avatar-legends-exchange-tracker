import type { Approach, AnyCharacter, ActionOrder, Balance, Stance, Status, TrainingType } from '../types';

// Predefined statuses from Avatar Legends
export interface StatusPreset {
  name: string;
  description: string;
  techniquesModifier?: number;
}

export const STATUS_PRESETS: Record<string, StatusPreset> = {
  doomed: {
    name: 'Doomed',
    description: '1 fatigue every exchange',
    techniquesModifier: 0,
  },
  impaired: {
    name: 'Impaired',
    description: '1 fatigue or -2 on dice rolls for PCs, NPCs get -1 technique',
    techniquesModifier: -1, // For NPCs, PCs handle differently
  },
  trapped: {
    name: 'Trapped',
    description: '3 items (any combination of fatigue or conditions) to escape',
    techniquesModifier: 0,
  },
  stunned: {
    name: 'Stunned',
    description: 'Lose all techniques',
    techniquesModifier: -99, // Effectively removes all techniques
  },
  empowered: {
    name: 'Empowered',
    description: 'Clear 1 fatigue every exchange',
    techniquesModifier: 0,
  },
  favored: {
    name: 'Favored',
    description: '+1 technique',
    techniquesModifier: 1,
  },
  inspired: {
    name: 'Inspired',
    description: 'Use it to shift balance',
    techniquesModifier: 0,
  },
  prepared: {
    name: 'Prepared',
    description: '+1 on a die roll, or avoid a condition',
    techniquesModifier: 0,
  },
};

// Technique definitions from Avatar Legends
export interface TechniqueDefinition {
  name: string;
  complexity?: 'Basic' | 'Advanced';
  training: TrainingType;
  approaches: Approach[]; // Which approaches this technique can be used with
}

export const TECHNIQUES: TechniqueDefinition[] = [
  // Universal Basic Techniques
  { name: 'Ready', complexity: 'Basic', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Seize a Position', complexity: 'Basic', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Retaliate', complexity: 'Basic', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Strike', complexity: 'Basic', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Pressure', complexity: 'Basic', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Smash', complexity: 'Basic', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Test Balance', complexity: 'Basic', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Bolster or Hinder', complexity: 'Basic', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Commit', complexity: 'Basic', training: 'universal', approaches: ['evade-observe'] },

  // Universal Advanced Techniques
  { name: 'Attack Weakness', complexity: 'Advanced', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Charge', complexity: 'Advanced', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Duck and Twist', complexity: 'Advanced', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Forceful Blow', complexity: 'Advanced', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Furious Assault', complexity: 'Advanced', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Pounce', complexity: 'Advanced', training: 'universal', approaches: ['advance-attack'] },
  { name: 'Protect', complexity: 'Advanced', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Rapid Assessment', complexity: 'Advanced', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Seek Vulnerabilities', complexity: 'Advanced', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Sense Environment', complexity: 'Advanced', training: 'universal', approaches: ['evade-observe'] },
  { name: 'Stand Strong', complexity: 'Advanced', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Suck It Up', complexity: 'Advanced', training: 'universal', approaches: ['defend-maneuver'] },
  { name: 'Take Cover', complexity: 'Advanced', training: 'universal', approaches: ['defend-maneuver'] },

  // Group Advanced Techniques
  { name: 'Attend to Commands', complexity: 'Advanced', training: 'group', approaches: ['evade-observe'] },
  { name: 'Coordination', complexity: 'Advanced', training: 'group', approaches: ['evade-observe'] },
  { name: 'Draw Foe', complexity: 'Advanced', training: 'group', approaches: ['evade-observe'] },
  { name: 'Engulf', complexity: 'Advanced', training: 'group', approaches: ['defend-maneuver'] },
  { name: 'Focused Fire', complexity: 'Advanced', training: 'group', approaches: ['advance-attack'] },
  { name: 'Overwhelm', complexity: 'Advanced', training: 'group', approaches: ['advance-attack'] },
  { name: 'Scatter and Regroup', complexity: 'Advanced', training: 'group', approaches: ['evade-observe'] },
  { name: 'Shield Wall', complexity: 'Advanced', training: 'group', approaches: ['defend-maneuver'] },
  { name: 'Spread Out', complexity: 'Advanced', training: 'group', approaches: ['defend-maneuver'] },
  { name: 'Surround', complexity: 'Advanced', training: 'group', approaches: ['advance-attack'] },
  { name: 'Swarm', complexity: 'Advanced', training: 'group', approaches: ['advance-attack'] },
  { name: 'Test Defenses', complexity: 'Advanced', training: 'group', approaches: ['evade-observe'] },
  { name: 'Protect Objective', complexity: 'Advanced', training: 'group', approaches: ['defend-maneuver'] },

  // Waterbending Advanced Techniques
  { name: 'Blood Twisting', complexity: 'Advanced', training: 'water', approaches: ['advance-attack'] },
  { name: 'Breath of Ice', complexity: 'Advanced', training: 'water', approaches: ['defend-maneuver'] },
  { name: 'Creeping Ice', complexity: 'Advanced', training: 'water', approaches: ['evade-observe'] },
  { name: 'Crushing Grip of Seas', complexity: 'Advanced', training: 'water', approaches: ['advance-attack'] },
  { name: 'Flow as Water', complexity: 'Advanced', training: 'water', approaches: ['defend-maneuver'] },
  { name: 'Freeze Blood', complexity: 'Advanced', training: 'water', approaches: ['advance-attack'] },
  { name: 'Ice Gauntlet', complexity: 'Advanced', training: 'water', approaches: ['defend-maneuver'] },
  { name: 'Ice Prison', complexity: 'Advanced', training: 'water', approaches: ['advance-attack'] },
  { name: 'Refresh', complexity: 'Advanced', training: 'water', approaches: ['evade-observe'] },
  { name: 'Stream the Water', complexity: 'Advanced', training: 'water', approaches: ['advance-attack'] },
  { name: 'Slip Over Ice', complexity: 'Advanced', training: 'water', approaches: ['evade-observe'] },
  { name: 'Water Cloak', complexity: 'Advanced', training: 'water', approaches: ['defend-maneuver'] },
  { name: 'Water Whip', complexity: 'Advanced', training: 'water', approaches: ['defend-maneuver'] },

  // Earthbending Advanced Techniques
  { name: 'Detect the Heavy Step', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Dust Stepping', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Earth Armor', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Earth Gauntlet', complexity: 'Advanced', training: 'earth', approaches: ['advance-attack'] },
  { name: 'Earth Launch', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Earth Sinking', complexity: 'Advanced', training: 'earth', approaches: ['advance-attack'] },
  { name: 'Eat Dirt', complexity: 'Advanced', training: 'earth', approaches: ['evade-observe'] },
  { name: 'Ground Shift', complexity: 'Advanced', training: 'earth', approaches: ['evade-observe'] },
  { name: 'Lava Star', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Metal Bindings', complexity: 'Advanced', training: 'earth', approaches: ['evade-observe'] },
  { name: 'Rock Column', complexity: 'Advanced', training: 'earth', approaches: ['advance-attack'] },
  { name: 'Stone Shield', complexity: 'Advanced', training: 'earth', approaches: ['defend-maneuver'] },
  { name: 'Thick Mud', complexity: 'Advanced', training: 'earth', approaches: ['evade-observe'] },

  // Firebending Advanced Techniques
  { name: 'A Single Spark', complexity: 'Advanced', training: 'fire', approaches: ['evade-observe'] },
  { name: 'Arc Lightning', complexity: 'Advanced', training: 'fire', approaches: ['evade-observe'] },
  { name: 'Breath of Fire', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Explosive Blast', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Fire Blade', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Fire Pinwheel', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Fire Stream', complexity: 'Advanced', training: 'fire', approaches: ['defend-maneuver'] },
  { name: 'Fire Whip', complexity: 'Advanced', training: 'fire', approaches: ['defend-maneuver'] },
  { name: 'Flame Knives', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Jet Stepping', complexity: 'Advanced', training: 'fire', approaches: ['evade-observe'] },
  { name: 'Lightning Blast', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Spiral Flare Kick', complexity: 'Advanced', training: 'fire', approaches: ['advance-attack'] },
  { name: 'Wall of Fiery Breath', complexity: 'Advanced', training: 'fire', approaches: ['defend-maneuver'] },

  // Airbending Advanced Techniques
  { name: 'Air Cushion', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Air Scooter', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Air Swipe', complexity: 'Advanced', training: 'air', approaches: ['defend-maneuver'] },
  { name: 'Breath of Wind', complexity: 'Advanced', training: 'air', approaches: ['advance-attack'] },
  { name: 'Cannonball', complexity: 'Advanced', training: 'air', approaches: ['advance-attack'] },
  { name: 'Cushion the Forceful Fist', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Directed Funnel', complexity: 'Advanced', training: 'air', approaches: ['advance-attack'] },
  { name: 'Reed in the Wind', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Shockwave', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Small Vortex', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Suction', complexity: 'Advanced', training: 'air', approaches: ['evade-observe'] },
  { name: 'Twisting Wind', complexity: 'Advanced', training: 'air', approaches: ['defend-maneuver'] },
  { name: 'Wind Run', complexity: 'Advanced', training: 'air', approaches: ['defend-maneuver'] },

  // Weapons Advanced Techniques
  { name: 'Boom', complexity: 'Advanced', training: 'weapons', approaches: ['advance-attack'] },
  { name: 'Chi Blocking Jabs', complexity: 'Advanced', training: 'weapons', approaches: ['advance-attack'] },
  { name: 'Chart a Course', complexity: 'Advanced', training: 'weapons', approaches: ['evade-observe'] },
  { name: 'Counterstrike', complexity: 'Advanced', training: 'weapons', approaches: ['defend-maneuver'] },
  { name: 'Disarm', complexity: 'Advanced', training: 'weapons', approaches: ['defend-maneuver'] },
  { name: 'Feint', complexity: 'Advanced', training: 'weapons', approaches: ['evade-observe'] },
  { name: 'Parry', complexity: 'Advanced', training: 'weapons', approaches: ['defend-maneuver'] },
  { name: 'Pin a Fly to a Tree', complexity: 'Advanced', training: 'weapons', approaches: ['advance-attack'] },
  { name: 'Pinpoint Thrust', complexity: 'Advanced', training: 'weapons', approaches: ['advance-attack'] },
  { name: 'Switch It Up', complexity: 'Advanced', training: 'weapons', approaches: ['evade-observe'] },
  { name: 'Take the High Ground', complexity: 'Advanced', training: 'weapons', approaches: ['defend-maneuver'] },
  { name: 'Turn the Tables', complexity: 'Advanced', training: 'weapons', approaches: ['advance-attack'] },

  // Technology Advanced Techniques
  { name: 'Better, Faster, Stronger', complexity: 'Advanced', training: 'technology', approaches: ['defend-maneuver'] },
  { name: 'Blinded By Science', complexity: 'Advanced', training: 'technology', approaches: ['advance-attack'] },
  { name: 'Collect Material', complexity: 'Advanced', training: 'technology', approaches: ['evade-observe'] },
  { name: 'Entangler', complexity: 'Advanced', training: 'technology', approaches: ['advance-attack'] },
  { name: 'Full-Power Attack', complexity: 'Advanced', training: 'technology', approaches: ['advance-attack'] },
  { name: 'Jolt', complexity: 'Advanced', training: 'technology', approaches: ['advance-attack'] },
  { name: 'Jury Rig', complexity: 'Advanced', training: 'technology', approaches: ['advance-attack'] },
  { name: 'Pinpoint Flaws', complexity: 'Advanced', training: 'technology', approaches: ['evade-observe'] },
  { name: 'Plant Trap', complexity: 'Advanced', training: 'technology', approaches: ['evade-observe'] },
  { name: 'Rebuild', complexity: 'Advanced', training: 'technology', approaches: ['defend-maneuver'] },
  { name: 'Smoke Bomb', complexity: 'Advanced', training: 'technology', approaches: ['defend-maneuver'] },
  { name: 'Wind Up', complexity: 'Advanced', training: 'technology', approaches: ['defend-maneuver'] },
];

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate action order based on approaches
export const calculateActionOrder = (characters: AnyCharacter[]): ActionOrder[] => {
  const priorityMap: Record<Approach, number> = {
    'defend-maneuver': 1,
    'advance-attack': 2,
    'evade-observe': 3,
    'none': 4,
  };

  return characters
    .filter(char => char.approach !== 'none')
    .map(char => ({
      characterId: char.id,
      character: char,
      approach: char.approach,
      priority: priorityMap[char.approach],
    }))
    .sort((a, b) => a.priority - b.priority);
};

// Roll stance dice (2d6 for Avatar Legends)
export const rollStance = (): Stance => {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const result = die1 + die2;

  return calculateStanceFromRoll(result);
};

// Calculate stance from a roll result (for manual entry)
export const calculateStanceFromRoll = (result: number): Stance => {
  // Avatar Legends rules:
  // 6-: 0 techniques (miss), can shift balance to use 1 technique
  // 7-9: 1 basic or mastered technique
  // 10+: 2 basic or mastered, OR 1 learned (with fatigue), OR 1 practiced

  let techniquesAllowed = 0; // For NPCs
  let canUseBasicMastered = 0;
  let canUseLearnedPracticed = false;
  let requiresBalanceShift = false;

  if (result >= 10) {
    techniquesAllowed = 2; // NPCs get 2
    canUseBasicMastered = 2; // PCs can use 2 basic/mastered
    canUseLearnedPracticed = true; // OR can use learned/practiced instead
  } else if (result >= 7) {
    techniquesAllowed = 1; // NPCs get 1
    canUseBasicMastered = 1; // PCs can use 1 basic/mastered
    canUseLearnedPracticed = false;
  } else {
    techniquesAllowed = 0; // NPCs get 0
    canUseBasicMastered = 0; // PCs get 0
    canUseLearnedPracticed = false;
    requiresBalanceShift = true; // But can shift balance to get 1
  }

  return {
    result,
    techniquesAllowed,
    canUseBasicMastered,
    canUseLearnedPracticed,
    requiresBalanceShift
  };
};

// Calculate total techniques allowed (stance + manual modifier + status modifiers)
export const calculateTechniquesAllowed = (
  stance: Stance | null,
  techniquesModifier: number,
  statuses: Status[]
): number => {
  if (!stance) return 0;

  const statusModifier = statuses.reduce((sum, status) => {
    return sum + (status.techniquesModifier || 0);
  }, 0);

  return Math.max(0, stance.techniquesAllowed + techniquesModifier + statusModifier);
};

// Modify balance value
export const modifyBalance = (
  balance: Balance,
  amount: number
): Balance => {
  const newValue = Math.max(
    balance.min,
    Math.min(balance.max, balance.current + amount)
  );

  return {
    ...balance,
    current: newValue,
  };
};

// Get balance shift direction and value for display
export const getBalanceDisplay = (balance: Balance): string => {
  const absValue = Math.abs(balance.current);
  if (balance.current === 0) {
    return 'Center';
  } else if (balance.current < 0) {
    return `${balance.leftPrinciple} ${absValue}`;
  } else {
    return `${balance.rightPrinciple} ${absValue}`;
  }
};

// Check if character is at center balance
export const isAtCenter = (balance: Balance): boolean => {
  return balance.current === 0;
};

// Format approach name for display
export const formatApproach = (approach: Approach): string => {
  const labels: Record<Approach, string> = {
    'defend-maneuver': 'Defend & Maneuver',
    'advance-attack': 'Advance & Attack',
    'evade-observe': 'Evade & Observe',
    'none': 'Not Acting',
  };
  return labels[approach];
};

// Playbook balance principles from Avatar Legends
export interface PlaybookBalancePrinciples {
  left: string;
  right: string;
}

export const PLAYBOOK_BALANCE: Record<string, PlaybookBalancePrinciples> = {
  'The Adamant': { left: 'Restraint', right: 'Results' },
  'The Adrift': { left: 'Risk', right: 'Stability' },
  'The Architect': { left: 'Planning', right: 'Discovery' },
  'The Aspirant': { left: 'Legacy', right: 'Adoration' },
  'The Authority': { left: 'Service', right: 'Self' },
  'The Bold': { left: 'Loyalty', right: 'Confidence' },
  'The Bound': { left: 'Duty', right: 'Justice' },
  'The Broken': { left: 'Restoration', right: 'Reinvention' },
  'The Destined': { left: 'Patience', right: 'Determination' },
  'The Elder': { left: 'Experience', right: 'Humility' },
  'The Foundling': { left: 'Unity', right: 'Heritage' },
  'The Guardian': { left: 'Self-Reliance', right: 'Trust' },
  'The Hammer': { left: 'Force', right: 'Care' },
  'The Icon': { left: 'Role', right: 'Freedom' },
  'The Idealist': { left: 'Forgiveness', right: 'Action' },
  'The Outcast': { left: 'Society', right: 'Integrity' },
  'The Pillar': { left: 'Support', right: 'Leadership' },
  'The Prodigy': { left: 'Excellence', right: 'Community' },
  'The Razor': { left: 'Control', right: 'Connection' },
  'The Rogue': { left: 'Friendship', right: 'Survival' },
  'The Successor': { left: 'Tradition', right: 'Progress' },
};

// Default balance configuration
export const createDefaultBalance = (
  left: string = 'Control',
  right: string = 'Freedom'
): Balance => ({
  leftPrinciple: left,
  rightPrinciple: right,
  current: 0,
  min: -3,
  max: 3,
});

// Calculate technique availability for PCs in combat
export interface TechniqueAvailability {
  basicMasteredCount: number; // How many basic or mastered can be used
  canUseLearnedOrPracticed: boolean; // Can use learned (costs fatigue) or practiced on 10+
  requiresBalanceShift: boolean; // 6- requires balance shift
  message: string; // Description for UI
}

export const calculateTechniqueAvailability = (
  stance: Stance | null,
  statuses: Status[],
  techniquesModifier: number
): TechniqueAvailability => {
  if (!stance) {
    return {
      basicMasteredCount: 0,
      canUseLearnedOrPracticed: false,
      requiresBalanceShift: false,
      message: 'Roll stance first',
    };
  }

  // Check for Favored status (+1 to basic/mastered count)
  const hasFavored = statuses.some(s => s.name === 'Favored');
  const favoredBonus = hasFavored ? 1 : 0;

  let basicMasteredCount = stance.canUseBasicMastered + techniquesModifier + favoredBonus;
  const canUseLearnedOrPracticed = stance.canUseLearnedPracticed;
  const requiresBalanceShift = stance.requiresBalanceShift;

  // Ensure at least 0
  basicMasteredCount = Math.max(0, basicMasteredCount);

  let message = '';
  if (requiresBalanceShift) {
    message = 'Miss - Shift balance for 1 basic/mastered';
  } else if (canUseLearnedOrPracticed) {
    message = `${basicMasteredCount} basic/mastered OR 1 learned (costs fatigue) OR 1 practiced`;
  } else if (basicMasteredCount > 0) {
    message = `${basicMasteredCount} basic/mastered`;
  } else {
    message = 'No techniques available';
  }

  return {
    basicMasteredCount,
    canUseLearnedOrPracticed,
    requiresBalanceShift,
    message,
  };
};
