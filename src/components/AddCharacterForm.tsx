import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { useTemplates } from '../hooks/useTemplates';
import type { PC, NPC, Condition } from '../types';
import { createDefaultBalance } from '../utils/helpers';
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const leftPrinciple = formData.get('leftPrinciple') as string;
    const rightPrinciple = formData.get('rightPrinciple') as string;

    const balance = createDefaultBalance(
      leftPrinciple || 'Control',
      rightPrinciple || 'Freedom'
    );

    const baseCharacter = {
      name,
      imageUrl: imageUrl || undefined,
      approach: 'none' as const,
      stance: null,
      fatigue: 0,
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
      const playbook = formData.get('playbook') as string;
      const training = (formData.get('training') as string)
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const pc: Omit<PC, 'id'> = {
        ...baseCharacter,
        type: 'pc',
        playbook,
        training: training.length > 0 ? training : undefined,
      };

      if (saveAsTemplate) {
        const templateName = formData.get('templateName') as string;
        saveTemplate(templateName || name, pc);
      }

      addPC(pc);
    } else {
      const role = formData.get('role') as string;
      const difficulty = formData.get('difficulty') as 'minor' | 'moderate' | 'major';

      const npc: Omit<NPC, 'id'> = {
        ...baseCharacter,
        type: 'npc',
        role: role || undefined,
        difficulty: difficulty || undefined,
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
            <select id="playbook" name="playbook" required>
              <option value="">Select playbook...</option>
              <option value="The Bold">The Bold</option>
              <option value="The Guardian">The Guardian</option>
              <option value="The Hammer">The Hammer</option>
              <option value="The Icon">The Icon</option>
              <option value="The Idealist">The Idealist</option>
              <option value="The Pillar">The Pillar</option>
              <option value="The Prodigy">The Prodigy</option>
              <option value="The Successor">The Successor</option>
              <option value="The Adamant">The Adamant</option>
              <option value="The Rogue">The Rogue</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="training">Training</label>
            <input
              type="text"
              id="training"
              name="training"
              placeholder="Air, Water, Fire, etc. (comma-separated)"
            />
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="leftPrinciple">Left Principle</label>
          <input
            type="text"
            id="leftPrinciple"
            name="leftPrinciple"
            placeholder="e.g., Control"
            defaultValue="Control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rightPrinciple">Right Principle</label>
          <input
            type="text"
            id="rightPrinciple"
            name="rightPrinciple"
            placeholder="e.g., Freedom"
            defaultValue="Freedom"
          />
        </div>
      </div>

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
