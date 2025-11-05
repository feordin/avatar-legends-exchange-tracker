/**
 * Pre-loaded NPC templates from Avatar Legends Core Book pages 290-291
 * These NPCs can be quickly loaded into combat encounters
 */

import type { NPC, SavedTemplate } from '../types';
import { generateId, createNPCBalance } from '../utils/helpers';

// Helper function to create NPC template
export function createNPCTemplate(
  name: string,
  role: string,
  difficulty: 'minor' | 'moderate' | 'major',
  maxFatigue: number,
  markedConditions: string[],
  techniques: string[], // Techniques the NPC can use
  principle: string, // Single principle for NPC balance
  maxBalance: number = 3 // Maximum balance value (typically 1 for minor, 2 for major, 3 for master)
): SavedTemplate {
  // All possible conditions
  const allConditionTypes: Array<{ type: any; marked: boolean }> = [
    { type: 'afraid' as const, marked: markedConditions.includes('afraid') },
    { type: 'angry' as const, marked: markedConditions.includes('angry') },
    { type: 'guilty' as const, marked: markedConditions.includes('guilty') },
    { type: 'insecure' as const, marked: markedConditions.includes('insecure') },
    { type: 'troubled' as const, marked: markedConditions.includes('troubled') },
    { type: 'foolish' as const, marked: markedConditions.includes('foolish') },
    { type: 'desperate' as const, marked: markedConditions.includes('desperate') },
    { type: 'jaded' as const, marked: markedConditions.includes('jaded') },
    { type: 'despondent' as const, marked: markedConditions.includes('despondent') },
    { type: 'hopeless' as const, marked: markedConditions.includes('hopeless') },
    { type: 'frantic' as const, marked: markedConditions.includes('frantic') },
    { type: 'disgusted' as const, marked: markedConditions.includes('disgusted') },
    { type: 'morose' as const, marked: markedConditions.includes('morose') },
    { type: 'manic' as const, marked: markedConditions.includes('manic') },
    { type: 'offended' as const, marked: markedConditions.includes('offended') },
    { type: 'humiliated' as const, marked: markedConditions.includes('humiliated') },
    { type: 'fixated' as const, marked: markedConditions.includes('fixated') },
    { type: 'frustrated' as const, marked: markedConditions.includes('frustrated') },
    { type: 'vengeful' as const, marked: markedConditions.includes('vengeful') },
    { type: 'stubborn' as const, marked: markedConditions.includes('stubborn') },
    { type: 'distracted' as const, marked: markedConditions.includes('distracted') },
    { type: 'overbearing' as const, marked: markedConditions.includes('overbearing') },
    { type: 'zealous' as const, marked: markedConditions.includes('zealous') },
    { type: 'overconfident' as const, marked: markedConditions.includes('overconfident') },
  ];

  // Filter to only include marked conditions for this NPC
  const conditions = allConditionTypes.filter(c => c.marked);

  const npc: Omit<NPC, 'id'> = {
    type: 'npc',
    name,
    role,
    difficulty,
    approach: 'none',
    stance: null,
    techniquesModifier: 0,
    selectedTechniques: [],
    fatigue: 0,
    maxFatigue,
    balance: createNPCBalance(principle, maxBalance),
    conditions,
    statuses: [],
    modifiers: [],
    availableTechniques: techniques.length > 0 ? techniques : undefined,
    principle, // Store the principle on the NPC
    baseState: {
      fatigue: 0,
      balance: createNPCBalance(principle, maxBalance),
      conditions: conditions.map(c => ({ ...c })),
      statuses: [],
    },
  };

  return {
    id: generateId(),
    name: `NPC: ${name}`,
    data: npc,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// All basic techniques (for Major and Master NPCs)
const ALL_BASIC_TECHNIQUES = [
  'Ready', 'Seize a Position', 'Retaliate',
  'Strike', 'Pressure', 'Smash',
  'Test Balance', 'Bolster or Hinder', 'Commit'
];

/**
 * Pre-loaded NPC templates from Avatar Legends Core Book pages 290-291
 */
export const PRELOADED_NPC_TEMPLATES: SavedTemplate[] = [
  // Minor NPCs (3 fatigue, balance max 1) - Limited technique sets
  createNPCTemplate('Town Guard', 'A local guard', 'minor', 3, ['troubled'],
    ['Strike', 'Pressure', 'Ready', 'Retaliate'], 'Order', 1),
  createNPCTemplate('Village Hunter', 'A skilled trapper and hunter', 'minor', 3, ['angry'],
    ['Strike', 'Seize a Position', 'Ready', 'Retaliate'], 'Survival', 1),
  createNPCTemplate('Trader', 'A traveling merchant', 'minor', 3, ['afraid'],
    ['Pressure', 'Ready', 'Test Balance', 'Bolster or Hinder'], 'Prosperity', 1),
  createNPCTemplate('Shopkeeper', 'An owner of a successful city shop', 'minor', 3, ['insecure'],
    ['Pressure', 'Ready', 'Test Balance', 'Bolster or Hinder'], 'Status', 1),
  createNPCTemplate('Tough Bruiser', 'Local muscle', 'minor', 3, ['afraid'],
    ['Strike', 'Smash', 'Ready', 'Retaliate'], 'Obedience', 1),
  createNPCTemplate('Soldier', 'A trained grunt of a larger unit', 'minor', 3, ['guilty'],
    ['Strike', 'Retaliate', 'Ready', 'Bolster or Hinder'], 'Duty', 1),

  // Major NPCs (5 fatigue, balance max 2) - All basic techniques + advanced techniques
  createNPCTemplate('Outlaw Captain', 'A leader of pirates, bandits, or criminals', 'major', 5, ['angry', 'afraid', 'foolish'],
    [...ALL_BASIC_TECHNIQUES, 'Sense Environment', 'Duck and Twist'], 'Survival', 2),
  createNPCTemplate('Champion Pit-Fighter', 'A champion pit-fighter', 'major', 5, ['angry', 'desperate', 'guilty'],
    [...ALL_BASIC_TECHNIQUES, 'Charge', 'Forceful Blow'], 'Discipline', 2),
  createNPCTemplate('Military Commander', 'A trained and capable military commander', 'major', 5, ['angry', 'jaded', 'troubled'],
    [...ALL_BASIC_TECHNIQUES, 'Rapid Assessment'], 'Duty', 2),
  createNPCTemplate('Noble', 'A member of the ruling class', 'major', 5, ['despondent', 'hopeless', 'insecure'],
    ALL_BASIC_TECHNIQUES, 'Freedom', 2),
  createNPCTemplate('Political Leader', 'A local mayor, magistrate, or governor', 'major', 5, ['afraid', 'frantic', 'insecure'],
    ALL_BASIC_TECHNIQUES, 'Community', 2),

  // Master NPCs (10 fatigue, balance max 3) - All basic techniques + advanced techniques
  createNPCTemplate('Accomplished General', 'A weaponmaster in command of extensive forces', 'major', 10, ['afraid', 'angry', 'disgusted', 'guilty', 'morose'],
    [...ALL_BASIC_TECHNIQUES, 'Feint', 'Turn the Tables', 'Pinpoint Thrust'], 'Ambition', 3),
  createNPCTemplate('Obsessive Inventor', 'A creator of dangerous and innovative devices', 'major', 10, ['afraid', 'angry', 'insecure', 'manic', 'offended'],
    [...ALL_BASIC_TECHNIQUES, 'Jolt', 'Collect Materials', 'Wind Up'], 'Progress', 3),
  createNPCTemplate('Rebel Leader', 'A rebel war leader in the Earth Kingdom', 'major', 10, ['afraid', 'angry', 'guilty', 'hopeless', 'humiliated'],
    [...ALL_BASIC_TECHNIQUES, 'Earth Armor', 'Stone Shield'], 'Justice', 3),
  createNPCTemplate('Triad Leader', 'An infamous firebending Republic City criminal', 'major', 10, ['afraid', 'fixated', 'frustrated', 'insecure', 'vengeful'],
    [...ALL_BASIC_TECHNIQUES, 'Lightning Blast', 'Flame Knives'], 'Role', 3),
  createNPCTemplate('Water Tribe Chief', 'An experienced and trusted Water Tribe leader', 'major', 10, ['angry', 'guilty', 'insecure', 'stubborn', 'troubled'],
    [...ALL_BASIC_TECHNIQUES, 'Crushing Grip of Seas', 'Stream the Water'], 'Tradition', 3),

  // NPC Groups - All basic techniques + group techniques
  // Small groups (5 fatigue, balance max 2)
  createNPCTemplate('Small Mob', 'A small mob of minor thugs', 'major', 5, ['angry', 'insecure', 'troubled'],
    [...ALL_BASIC_TECHNIQUES, 'Overwhelm'], 'Retribution', 2),
  createNPCTemplate('Military Squad', 'A small squad of trained soldiers', 'major', 5, ['afraid', 'guilty', 'insecure'],
    [...ALL_BASIC_TECHNIQUES, 'Focused Fire', 'Protect Objective'], 'Duty', 2),
  // Medium groups (10 fatigue, balance max 3)
  createNPCTemplate('Palace Guards', 'A medium group of trained guards, eager to serve', 'major', 10, ['afraid', 'angry', 'desperate', 'guilty', 'humiliated'],
    [...ALL_BASIC_TECHNIQUES, 'Coordination', 'Shield Wall', 'Swarm'], 'Loyalty', 3),
  createNPCTemplate('Republic City Police Squad', 'A medium group of Metalbenders', 'major', 10, ['distracted', 'overbearing', 'guilty', 'troubled', 'zealous'],
    [...ALL_BASIC_TECHNIQUES, 'Metal Bindings', 'Spread Out', 'Test Defenses'], 'Results', 3),
  createNPCTemplate('Elite Rebels', 'A medium group of elite revolutionaries', 'major', 10, ['afraid', 'guilty', 'hopeless', 'insecure', 'overconfident'],
    [...ALL_BASIC_TECHNIQUES, 'Scatter and Regroup', 'Swarm', 'Surround'], 'Freedom', 3),
];

/**
 * Initialize pre-loaded NPCs in storage
 * Call this when the app first loads to ensure NPCs are available
 */
export async function initializePreloadedNPCs(
  existingTemplates: SavedTemplate[]
): Promise<SavedTemplate[]> {
  // Check which pre-loaded NPCs are not already in storage
  const existingNames = new Set(existingTemplates.map(t => t.name));
  const newNPCs = PRELOADED_NPC_TEMPLATES.filter(npc => !existingNames.has(npc.name));

  if (newNPCs.length > 0) {
    console.log(`Adding ${newNPCs.length} pre-loaded NPC templates`);
    return [...existingTemplates, ...newNPCs];
  }

  return existingTemplates;
}
