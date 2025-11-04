/**
 * Pre-loaded NPC templates from Avatar Legends Core Book pages 290-291
 * These NPCs can be quickly loaded into combat encounters
 */

import type { NPC, SavedTemplate } from '../types';
import { generateId, createDefaultBalance } from '../utils/helpers';

// Helper function to create NPC template
export function createNPCTemplate(
  name: string,
  role: string,
  difficulty: 'minor' | 'moderate' | 'major',
  maxFatigue: number,
  markedConditions: string[],
  _techniques: string[], // For documentation - techniques the NPC typically uses
  leftPrinciple?: string,
  rightPrinciple?: string
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
    balance: createDefaultBalance(leftPrinciple || 'Control', rightPrinciple || 'Freedom'),
    conditions,
    statuses: [],
    modifiers: [],
    baseState: {
      fatigue: 0,
      balance: createDefaultBalance(leftPrinciple || 'Control', rightPrinciple || 'Freedom'),
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

/**
 * Pre-loaded NPC templates from Avatar Legends Core Book pages 290-291
 */
export const PRELOADED_NPC_TEMPLATES: SavedTemplate[] = [
  // Minor NPCs (3 fatigue)
  createNPCTemplate('Town Guard', 'A local guard', 'minor', 3, ['troubled'], [], 'Control', 'Freedom'),
  createNPCTemplate('Village Hunter', 'A skilled trapper and hunter', 'minor', 3, ['angry'], [], 'Control', 'Freedom'),
  createNPCTemplate('Trader', 'A traveling merchant', 'minor', 3, ['afraid'], [], 'Control', 'Freedom'),
  createNPCTemplate('Shopkeeper', 'An owner of a successful city shop', 'minor', 3, ['insecure'], [], 'Control', 'Freedom'),
  createNPCTemplate('Tough Bruiser', 'Local muscle', 'minor', 3, ['afraid'], [], 'Control', 'Freedom'),
  createNPCTemplate('Soldier', 'A trained grunt of a larger unit', 'minor', 3, ['guilty'], [], 'Control', 'Freedom'),

  // Major NPCs (5 fatigue)
  createNPCTemplate('Outlaw Captain', 'A leader of pirates, bandits, or criminals', 'major', 5, ['angry', 'afraid', 'foolish'], ['Sense Environment', 'Duck and Twist'], 'Survival', 'Honor'),
  createNPCTemplate('Champion Pit-Fighter', 'A champion pit-fighter', 'major', 5, ['angry', 'desperate', 'guilty'], ['Charge', 'Forceful Blow'], 'Discipline', 'Freedom'),
  createNPCTemplate('Military Commander', 'A trained and capable military commander', 'major', 5, ['angry', 'jaded', 'troubled'], ['Rapid Assessment'], 'Duty', 'Freedom'),
  createNPCTemplate('Noble', 'A member of the ruling class', 'major', 5, ['despondent', 'hopeless', 'insecure'], [], 'Freedom', 'Control'),
  createNPCTemplate('Political Leader', 'A local mayor, magistrate, or governor', 'major', 5, ['afraid', 'frantic', 'insecure'], [], 'Community', 'Independence'),

  // Master NPCs (10 fatigue)
  createNPCTemplate('Accomplished General', 'A weaponmaster in command of extensive forces', 'major', 10, ['afraid', 'angry', 'disgusted', 'guilty', 'morose'], ['Feint', 'Turn the Tables', 'Pinpoint Thrust'], 'Ambition', 'Humility'),
  createNPCTemplate('Obsessive Inventor', 'A creator of dangerous and innovative devices', 'major', 10, ['afraid', 'angry', 'insecure', 'manic', 'offended'], ['Jolt', 'Collect Materials', 'Wind Up'], 'Progress', 'Tradition'),
  createNPCTemplate('Rebel Leader', 'A rebel war leader in the Earth Kingdom', 'major', 10, ['afraid', 'angry', 'guilty', 'hopeless', 'humiliated'], ['Earth Armor', 'Stone Shield'], 'Justice', 'Stability'),
  createNPCTemplate('Triad Leader', 'An infamous firebending Republic City criminal', 'major', 10, ['afraid', 'fixated', 'frustrated', 'insecure', 'vengeful'], ['Lightning Blast', 'Flame Knives'], 'Role', 'Freedom'),
  createNPCTemplate('Water Tribe Chief', 'An experienced and trusted Water Tribe leader', 'major', 10, ['angry', 'guilty', 'insecure', 'stubborn', 'troubled'], ['Crushing Grip of Seas', 'Stream the Water'], 'Tradition', 'Progress'),

  // NPC Groups
  createNPCTemplate('Small Mob', 'A small mob of minor thugs', 'major', 5, ['angry', 'insecure', 'troubled'], ['Overwhelm'], 'Retribution', 'Mercy'),
  createNPCTemplate('Military Squad', 'A small squad of trained soldiers', 'major', 5, ['afraid', 'guilty', 'insecure'], ['Focused Fire', 'Protect Objective'], 'Duty', 'Freedom'),
  createNPCTemplate('Palace Guards', 'A medium group of trained guards, eager to serve', 'major', 10, ['afraid', 'angry', 'desperate', 'guilty', 'humiliated'], ['Coordination', 'Shield Wall', 'Swarm'], 'Loyalty', 'Independence'),
  createNPCTemplate('Republic City Police Squad', 'A medium group of Metalbenders', 'major', 10, ['distracted', 'overbearing', 'guilty', 'troubled', 'zealous'], ['Metal Bindings', 'Spread Out', 'Test Defenses'], 'Results', 'Compassion'),
  createNPCTemplate('Elite Rebels', 'A medium group of elite revolutionaries', 'major', 10, ['afraid', 'guilty', 'hopeless', 'insecure', 'overconfident'], ['Scatter and Regroup', 'Swarm', 'Surround'], 'Freedom', 'Control'),
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
