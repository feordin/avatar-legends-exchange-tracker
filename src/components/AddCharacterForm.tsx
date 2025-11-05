import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { useTemplates } from '../hooks/useTemplates';
import type { PC, NPC, Condition } from '../types';
import { createDefaultBalance, createNPCBalance, PLAYBOOK_BALANCE } from '../utils/helpers';
import './AddCharacterForm.css';

interface AddCharacterFormProps {
  type: 'pc' | 'npc';
  onClose: () => void;
}

const defaultConditions: Condition[] = [
  { type: 'afraid', marked: false },
  { type: 'angry', marked: false },
  { type: 'guilty', marked: false },
  { type: 'insecure', marked: false },
  { type: 'troubled', marked: false },
];

const AddCharacterForm: React.FC<AddCharacterFormProps> = ({ type, onClose }) => {
  const { addPC, addNPC } = useExchange();
  const { saveTemplate } = useTemplates();
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const imageUrl = formData.get('imageUrl') as string;

    // Get balance from playbook for PCs, or from form for NPCs
    let balance;
    if (type === 'pc' && selectedPlaybook && PLAYBOOK_BALANCE[selectedPlaybook]) {
      const principles = PLAYBOOK_BALANCE[selectedPlaybook];
      balance = createDefaultBalance(principles.left, principles.right);
    } else {
      // For NPCs, use single principle (unidirectional balance)
      const principle = formData.get('principle') as string;
      const maxBalance = parseInt(formData.get('maxBalance') as string) || 3;
      balance = createNPCBalance(principle || 'Control', maxBalance);
    }

    // Determine maxFatigue based on character type
    let maxFatigue = 5; // Default for PCs
    if (type === 'npc') {
      const difficulty = formData.get('difficulty') as 'minor' | 'moderate' | 'major';
      maxFatigue = difficulty === 'minor' ? 3 : 5; // minor=3, moderate/major=5
    }

    const baseCharacter = {
      name,
      imageUrl: imageUrl || undefined,
      approach: 'none' as const,
      stance: null,
      techniquesModifier: 0,
      selectedTechniques: [],
      fatigue: 0,
      maxFatigue,
      balance,
      conditions: [...defaultConditions],
      statuses: [],
      modifiers: [],
      baseState: {
        fatigue: 0,
        balance: { ...balance },
        conditions: [...defaultConditions],
        statuses: [],
      },
    };

    if (type === 'pc') {
      const playbook = selectedPlaybook;
      const training: string[] = [];

      // Collect checked training types
      if (formData.get('training-air')) training.push('Air');
      if (formData.get('training-water')) training.push('Water');
      if (formData.get('training-earth')) training.push('Earth');
      if (formData.get('training-fire')) training.push('Fire');
      if (formData.get('training-weapons')) training.push('Weapons');
      if (formData.get('training-technology')) training.push('Technology');
      if (formData.get('training-group')) training.push('Group');

      const pc: Omit<PC, 'id'> = {
        ...baseCharacter,
        type: 'pc',
        playbook,
        training: training.length > 0 ? training : undefined,
        techniques: [], // Start with no techniques, add them later
      };

      if (saveAsTemplate) {
        const templateName = formData.get('templateName') as string;
        saveTemplate(templateName || name, pc);
      }

      addPC(pc);
    } else {
      const role = formData.get('role') as string;
      const difficulty = formData.get('difficulty') as 'minor' | 'moderate' | 'major';
      const principle = formData.get('principle') as string;

      const npc: Omit<NPC, 'id'> = {
        ...baseCharacter,
        type: 'npc',
        role: role || undefined,
        difficulty: difficulty || undefined,
        principle: principle || 'Control',
      };

      if (saveAsTemplate) {
        const templateName = formData.get('templateName') as string;
        saveTemplate(templateName || name, npc);
      }

      addNPC(npc);
    }

    onClose();
  };

  return (
    <form className="add-character-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Character name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          placeholder="https://example.com/image.jpg (optional)"
        />
      </div>

      {type === 'pc' ? (
        <>
          <div className="form-group">
            <label htmlFor="playbook">Playbook *</label>
            <select
              id="playbook"
              name="playbook"
              value={selectedPlaybook}
              onChange={(e) => setSelectedPlaybook(e.target.value)}
              required
            >
              <option value="">Select playbook...</option>
              <option value="The Adamant">The Adamant</option>
              <option value="The Adrift">The Adrift</option>
              <option value="The Architect">The Architect</option>
              <option value="The Aspirant">The Aspirant</option>
              <option value="The Authority">The Authority</option>
              <option value="The Bold">The Bold</option>
              <option value="The Bound">The Bound</option>
              <option value="The Broken">The Broken</option>
              <option value="The Destined">The Destined</option>
              <option value="The Elder">The Elder</option>
              <option value="The Foundling">The Foundling</option>
              <option value="The Guardian">The Guardian</option>
              <option value="The Hammer">The Hammer</option>
              <option value="The Icon">The Icon</option>
              <option value="The Idealist">The Idealist</option>
              <option value="The Outcast">The Outcast</option>
              <option value="The Pillar">The Pillar</option>
              <option value="The Prodigy">The Prodigy</option>
              <option value="The Razor">The Razor</option>
              <option value="The Rogue">The Rogue</option>
              <option value="The Successor">The Successor</option>
            </select>
          </div>

          {/* Show balance principles for selected playbook */}
          {selectedPlaybook && PLAYBOOK_BALANCE[selectedPlaybook] && (
            <div className="form-group">
              <label>Balance Principles (from playbook):</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#1a1a1a', borderRadius: '4px', color: '#ccc' }}>
                {PLAYBOOK_BALANCE[selectedPlaybook].left} ↔ {PLAYBOOK_BALANCE[selectedPlaybook].right}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Training Types</label>
            <div className="training-checkboxes">
              <label className="checkbox-label">
                <input type="checkbox" name="training-air" />
                <span>Air</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-water" />
                <span>Water</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-earth" />
                <span>Earth</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-fire" />
                <span>Fire</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-weapons" />
                <span>Weapons</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-technology" />
                <span>Technology</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="training-group" />
                <span>Group</span>
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Enemy soldier, Ally, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty">
              <option value="">Select difficulty...</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="major">Major</option>
            </select>
          </div>
        </>
      )}

      {/* Balance principle for NPCs (single principle, unidirectional) */}
      {type === 'npc' && (
        <>
          <div className="form-group">
            <label htmlFor="principle">Principle</label>
            <input
              type="text"
              id="principle"
              name="principle"
              placeholder="e.g., Control, Duty, Freedom"
              defaultValue="Control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxBalance">Max Balance</label>
            <select
              id="maxBalance"
              name="maxBalance"
              defaultValue="3"
            >
              <option value="1">1 (Minor NPCs)</option>
              <option value="2">2 (Major NPCs)</option>
              <option value="3">3 (Master NPCs)</option>
            </select>
            <small style={{ color: '#999', marginTop: '0.25rem', display: 'block' }}>
              NPCs have a single principle and their balance moves from 0 to max in one direction only.
            </small>
          </div>
        </>
      )}

      <div className="form-group save-template-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={saveAsTemplate}
            onChange={(e) => setSaveAsTemplate(e.target.checked)}
          />
          <span>Save as template for future use</span>
        </label>
        {saveAsTemplate && (
          <input
            type="text"
            name="templateName"
            placeholder="Template name (optional, defaults to character name)"
          />
        )}
      </div>

      <div className="form-actions">
        <button type="submit">Add Character</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddCharacterForm;
