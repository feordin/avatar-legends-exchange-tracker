import type { Approach, AnyCharacter, ActionOrder, Balance, Stance, Status } from '../types';

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

  // Calculate techniques allowed based on roll result
  let techniquesAllowed = 0;
  if (result >= 10) {
    techniquesAllowed = 3;
  } else if (result >= 7) {
    techniquesAllowed = 2;
  } else {
    techniquesAllowed = 1;
  }

  return { result, techniquesAllowed };
};

// Calculate total techniques allowed (stance + status modifiers)
export const calculateTechniquesAllowed = (
  stance: Stance | null,
  statuses: Status[]
): number => {
  if (!stance) return 0;

  const statusModifier = statuses.reduce((sum, status) => {
    return sum + (status.techniquesModifier || 0);
  }, 0);

  return Math.max(0, stance.techniquesAllowed + statusModifier);
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
