import React, { useState } from 'react';
import type { AnyCharacter, PC, Approach, Status, Modifier, CharacterTechnique, TechniqueLevel, SelectedTechnique } from '../types';
import { useExchange } from '../context/ExchangeContext';
import { useTemplates } from '../hooks/useTemplates';
import {
  getBalanceDisplay,
  calculateTechniquesAllowed,
  generateId,
  STATUS_PRESETS,
  TECHNIQUES,
  calculateTechniqueAvailability,
  PLAYBOOK_BALANCE,
  createDefaultBalance,
} from '../utils/helpers';
import './CharacterCard.css';

interface CharacterCardProps {
  character: AnyCharacter;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const {
    setApproach,
    rollStanceForCharacter,
    setStanceManually,
    modifyTechniques,
    modifyFatigue,
    modifyBalance,
    toggleCondition,
    addStatus,
    removeStatus,
    addModifier,
    removeModifier,
    addTechnique,
    removeTechnique,
    updateTechniqueLevel,
    selectTechnique,
    unselectTechnique,
    clearSelectedTechniques,
    resetCharacterToBase,
    removeCharacter,
    updateCharacter,
  } = useExchange();

  const { templates, updateTemplate } = useTemplates();

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [showTechniqueForm, setShowTechniqueForm] = useState(false);
  const [selectedStatusPreset, setSelectedStatusPreset] = useState<string>('');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');
  const [selectedBasicTechnique, setSelectedBasicTechnique] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editPlaybook, setEditPlaybook] = useState('');
  const [editTraining, setEditTraining] = useState<string[]>([]);

  const isPc = character.type === 'pc';
  const techniquesAllowed = calculateTechniquesAllowed(
    character.stance,
    character.techniquesModifier,
    character.statuses
  );

  const handleApproachChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApproach(character.id, e.target.value as Approach);
  };

  const handleStanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2 && value <= 12) {
      setStanceManually(character.id, value);
    }
  };

  const handleStatusPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatusPreset(e.target.value);
  };

  const handleAddStatus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let status: Status;
    if (selectedStatusPreset && selectedStatusPreset !== 'custom') {
      // Use preset values
      const preset = STATUS_PRESETS[selectedStatusPreset];
      status = {
        id: generateId(),
        name: preset.name,
        description: preset.description,
        techniquesModifier: preset.techniquesModifier || 0,
      };
    } else {
      // Use custom values
      status = {
        id: generateId(),
        name: formData.get('statusName') as string,
        description: formData.get('statusDesc') as string,
        techniquesModifier: parseInt(formData.get('techMod') as string) || 0,
      };
    }

    addStatus(character.id, status);
    setShowStatusForm(false);
    setSelectedStatusPreset('');
    e.currentTarget.reset();
  };

  const handleAddModifier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const modifier: Modifier = {
      id: generateId(),
      type: formData.get('modType') as 'forward' | 'ongoing',
      value: parseInt(formData.get('modValue') as string) || 0,
      appliesTo: formData.get('appliesTo') as string || undefined,
      description: formData.get('modDesc') as string,
    };
    addModifier(character.id, modifier);
    setShowModifierForm(false);
    e.currentTarget.reset();
  };

  const handleAddTechnique = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedTechDef = TECHNIQUES.find(t => t.name === selectedTechnique);

    if (!selectedTechDef) return;

    const technique: CharacterTechnique = {
      id: generateId(),
      name: selectedTechDef.name,
      level: formData.get('techLevel') as TechniqueLevel,
      training: selectedTechDef.training,
    };

    addTechnique(character.id, technique);

    // Also update the template if one exists
    if (isPc) {
      const matchingTemplate = templates.find(
        t => t.data.type === 'pc' && t.data.name === character.name
      );

      if (matchingTemplate && matchingTemplate.data.type === 'pc') {
        updateTemplate(matchingTemplate.id, {
          data: {
            ...matchingTemplate.data,
            techniques: [...(matchingTemplate.data.techniques || []), technique],
          },
        });
      }
    }

    setShowTechniqueForm(false);
    setSelectedTechnique('');
    e.currentTarget.reset();
  };

  const handleRemoveTechnique = (techniqueId: string) => {
    removeTechnique(character.id, techniqueId);

    // Also update the template if one exists
    if (isPc) {
      const matchingTemplate = templates.find(
        t => t.data.type === 'pc' && t.data.name === character.name
      );

      if (matchingTemplate && matchingTemplate.data.type === 'pc') {
        updateTemplate(matchingTemplate.id, {
          data: {
            ...matchingTemplate.data,
            techniques: matchingTemplate.data.techniques.filter(t => t.id !== techniqueId),
          },
        });
      }
    }
  };

  const handleUpdateTechniqueLevel = (techniqueId: string, level: TechniqueLevel) => {
    updateTechniqueLevel(character.id, techniqueId, level);

    // Also update the template if one exists
    if (isPc) {
      const matchingTemplate = templates.find(
        t => t.data.type === 'pc' && t.data.name === character.name
      );

      if (matchingTemplate && matchingTemplate.data.type === 'pc') {
        updateTemplate(matchingTemplate.id, {
          data: {
            ...matchingTemplate.data,
            techniques: matchingTemplate.data.techniques.map(t =>
              t.id === techniqueId ? { ...t, level } : t
            ),
          },
        });
      }
    }
  };

  const handleEditClick = () => {
    if (isPc) {
      setEditPlaybook(character.playbook);
      setEditTraining(character.training || []);
    }
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (isPc) {
      // Update balance if playbook changed
      let newBalance = character.balance;
      if (editPlaybook && PLAYBOOK_BALANCE[editPlaybook]) {
        const principles = PLAYBOOK_BALANCE[editPlaybook];
        newBalance = createDefaultBalance(principles.left, principles.right);
        // Preserve the current balance value
        newBalance.current = character.balance.current;
      }

      const updates: Partial<PC> = {
        playbook: editPlaybook,
        training: editTraining.length > 0 ? editTraining : undefined,
        balance: newBalance,
      };
      updateCharacter(character.id, updates);

      // Also update the template if one exists with this character's name
      const matchingTemplate = templates.find(
        t => t.data.type === 'pc' && t.data.name === character.name
      );

      if (matchingTemplate) {
        updateTemplate(matchingTemplate.id, {
          data: {
            ...matchingTemplate.data,
            ...updates,
          } as Omit<PC, 'id'>,
        });
      }
    } else {
      // For NPCs, also check for and update matching template
      const matchingTemplate = templates.find(
        t => t.data.type === 'npc' && t.data.name === character.name
      );

      if (matchingTemplate) {
        // NPCs don't have playbook/training edits in current implementation
        // but keep this here for future NPC edit features
      }
    }
    setEditMode(false);
  };

  const toggleTraining = (training: string) => {
    setEditTraining(prev =>
      prev.includes(training)
        ? prev.filter(t => t !== training)
        : [...prev, training]
    );
  };

  return (
    <div className={`character-card ${isPc ? 'pc' : 'npc'}`}>
      {/* Header with image and name */}
      <div className="character-header">
        <div className="character-image">
          {character.imageUrl ? (
            <img src={character.imageUrl} alt={character.name} />
          ) : (
            <div className="placeholder-image">{character.name.charAt(0)}</div>
          )}
        </div>
        <div className="character-name-section">
          <h3>{character.name}</h3>
          {isPc && <p className="playbook">{character.playbook}</p>}
          {!isPc && character.role && <p className="role">{character.role}</p>}
        </div>
        <button
          className="remove-btn"
          onClick={() => removeCharacter(character.id)}
          title="Remove character"
        >
          ×
        </button>
      </div>

      {/* Edit Mode */}
      {editMode && (
        <div className="edit-section">
          {isPc && (
            <>
              <div className="form-group">
                <label>Playbook:</label>
                <select value={editPlaybook} onChange={(e) => setEditPlaybook(e.target.value)}>
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
              <div className="form-group">
                <label>Training:</label>
                <div className="training-checkboxes-edit">
                  {['Air', 'Water', 'Earth', 'Fire', 'Weapons', 'Technology', 'Group'].map((train) => (
                    <label key={train} className="checkbox-label-small">
                      <input
                        type="checkbox"
                        checked={editTraining.includes(train)}
                        onChange={() => toggleTraining(train)}
                      />
                      <span>{train}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Show current balance principles (read-only) */}
              {editPlaybook && PLAYBOOK_BALANCE[editPlaybook] && (
                <div className="form-group">
                  <label>Balance Principles (from playbook):</label>
                  <div style={{ padding: '0.5rem', backgroundColor: '#1a1a1a', borderRadius: '4px', color: '#9b59b6', fontWeight: 'bold' }}>
                    {PLAYBOOK_BALANCE[editPlaybook].left} ↔ {PLAYBOOK_BALANCE[editPlaybook].right}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="edit-actions">
            <button className="small-btn" onClick={handleSaveEdit}>Save</button>
            <button className="small-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Button */}
      {!editMode && (
        <div className="character-edit-btn-container">
          <button className="small-btn edit-character-btn" onClick={handleEditClick}>
            Edit Character
          </button>
        </div>
      )}

      {/* Approach Selection */}
      <div className="stat-row">
        <label>Approach:</label>
        <select value={character.approach} onChange={handleApproachChange}>
          <option value="none">Not Acting</option>
          <option value="defend-maneuver">Defend & Maneuver</option>
          <option value="advance-attack">Advance & Attack</option>
          <option value="evade-observe">Evade & Observe</option>
        </select>
      </div>

      {/* Stance and Techniques */}
      <div className="stat-row">
        <label>Stance:</label>
        <div className="stance-section">
          <input
            type="number"
            min="2"
            max="12"
            className="stance-input"
            value={character.stance?.result || ''}
            onChange={handleStanceInputChange}
            placeholder="2-12"
          />
          <span className="stance-result">
            {character.stance ? (
              isPc ? (
                <>
                  {character.stance.requiresBalanceShift ? (
                    'Miss - Shift balance for 1 tech'
                  ) : character.stance.canUseLearnedPracticed ? (
                    `2 basic/mastered OR 1 learned/practiced`
                  ) : character.stance.canUseBasicMastered > 0 ? (
                    `${character.stance.canUseBasicMastered} basic/mastered`
                  ) : (
                    'No techniques'
                  )}
                </>
              ) : (
                `Techniques: ${techniquesAllowed}`
              )
            ) : 'Not rolled'}
          </span>
          <button
            className="small-btn"
            onClick={() => rollStanceForCharacter(character.id)}
          >
            Roll
          </button>
        </div>
      </div>

      {/* Manual Techniques Modifier */}
      {character.stance && (
        <div className="stat-row">
          <label>Tech Adjust:</label>
          <div className="techniques-section">
            <button
              className="small-btn"
              onClick={() => modifyTechniques(character.id, -1)}
            >
              -
            </button>
            <span className="techniques-modifier">
              {character.techniquesModifier >= 0 ? '+' : ''}
              {character.techniquesModifier}
            </span>
            <button
              className="small-btn"
              onClick={() => modifyTechniques(character.id, 1)}
            >
              +
            </button>
            <span className="techniques-note">
              (Balance shift, etc.)
            </span>
          </div>
        </div>
      )}

      {/* Selected Techniques for Combat (PC only) */}
      {isPc && character.stance && (
        <div className="combat-techniques-section">
          <div className="section-header">
            <label>Combat Techniques:</label>
            <button
              className="small-btn clear-btn"
              onClick={() => clearSelectedTechniques(character.id)}
              title="Clear all selected techniques"
            >
              Clear
            </button>
          </div>
          <div className="selected-techniques">
            {character.selectedTechniques.length === 0 ? (
              <p className="no-techniques">No techniques selected for this exchange</p>
            ) : (
              character.selectedTechniques.map((tech) => (
                <div key={tech.techniqueId} className="selected-tech-item">
                  <span>{tech.name}</span>
                  <span className={`tech-level-badge ${tech.level}`}>{tech.level}</span>
                  {tech.costsFatigue && <span className="fatigue-cost">-1 fatigue</span>}
                  <button
                    className="remove-item-btn"
                    onClick={() => unselectTechnique(character.id, tech.techniqueId)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="technique-availability">
            {calculateTechniqueAvailability(character.stance, character.statuses, character.techniquesModifier).message}
          </div>
          <div className="technique-selector">
            <div className="basic-technique-selector">
              <select
                value={selectedBasicTechnique}
                onChange={(e) => setSelectedBasicTechnique(e.target.value)}
                className="basic-tech-select"
              >
                <option value="">Select basic technique...</option>
                {TECHNIQUES
                  .filter(tech => {
                    // Only show Basic complexity techniques here
                    if (tech.complexity !== 'Basic') return false;
                    // Must match approach
                    if (!tech.approaches.includes(character.approach)) return false;
                    // Universal techniques are always available
                    if (tech.training === 'universal') return true;
                    // Check if character has training for this technique
                    if (character.type === 'pc' && character.training) {
                      return character.training.some(t => t.toLowerCase() === tech.training.toLowerCase());
                    }
                    return false;
                  })
                  .map((tech) => (
                    <option key={tech.name} value={tech.name}>
                      {tech.name}
                    </option>
                  ))}
              </select>
              <button
                className="small-btn"
                onClick={() => {
                  if (!selectedBasicTechnique) return;
                  const availability = calculateTechniqueAvailability(character.stance, character.statuses, character.techniquesModifier);
                  if (character.selectedTechniques.length < availability.basicMasteredCount || availability.requiresBalanceShift) {
                    const basicTech: SelectedTechnique = {
                      techniqueId: `basic-${generateId()}`,
                      name: selectedBasicTechnique,
                      level: 'basic',
                      costsFatigue: false,
                    };
                    selectTechnique(character.id, basicTech);
                    setSelectedBasicTechnique('');
                  }
                }}
                disabled={!selectedBasicTechnique}
                title="Add selected basic technique"
              >
                Add
              </button>
            </div>
            {character.type === 'pc' && character.techniques
              .filter(t => t.level === 'mastered')
              .filter(t => {
                const techDef = TECHNIQUES.find(td => td.name === t.name);
                return techDef && techDef.approaches.includes(character.approach);
              })
              .map((tech) => (
              <button
                key={tech.id}
                className="small-btn"
                onClick={() => {
                  const availability = calculateTechniqueAvailability(character.stance, character.statuses, character.techniquesModifier);
                  if (character.selectedTechniques.length < availability.basicMasteredCount) {
                    const masteredTech: SelectedTechnique = {
                      techniqueId: tech.id,
                      name: tech.name,
                      level: 'mastered',
                      costsFatigue: false,
                    };
                    selectTechnique(character.id, masteredTech);
                  }
                }}
                title={`Select ${tech.name} (mastered)`}
              >
                + {tech.name}
              </button>
            ))}
            {character.type === 'pc' && character.techniques
              .filter(t => t.level === 'practiced')
              .filter(t => {
                const techDef = TECHNIQUES.find(td => td.name === t.name);
                return techDef && techDef.approaches.includes(character.approach);
              })
              .map((tech) => {
              const availability = calculateTechniqueAvailability(character.stance, character.statuses, character.techniquesModifier);
              return availability.canUseLearnedOrPracticed ? (
                <button
                  key={tech.id}
                  className="small-btn practiced-btn"
                  onClick={() => {
                    const practicedTech: SelectedTechnique = {
                      techniqueId: tech.id,
                      name: tech.name,
                      level: 'practiced',
                      costsFatigue: false,
                    };
                    selectTechnique(character.id, practicedTech);
                  }}
                  title={`Select ${tech.name} (practiced) - uses 2 basic slots`}
                >
                  + {tech.name} (P)
                </button>
              ) : null;
            })}
            {character.type === 'pc' && character.techniques
              .filter(t => t.level === 'learned')
              .filter(t => {
                const techDef = TECHNIQUES.find(td => td.name === t.name);
                return techDef && techDef.approaches.includes(character.approach);
              })
              .map((tech) => {
              const availability = calculateTechniqueAvailability(character.stance, character.statuses, character.techniquesModifier);
              return availability.canUseLearnedOrPracticed ? (
                <button
                  key={tech.id}
                  className="small-btn learned-btn"
                  onClick={() => {
                    const learnedTech: SelectedTechnique = {
                      techniqueId: tech.id,
                      name: tech.name,
                      level: 'learned',
                      costsFatigue: true,
                    };
                    selectTechnique(character.id, learnedTech);
                  }}
                  title={`Select ${tech.name} (learned) - costs 1 fatigue, uses 2 basic slots`}
                >
                  + {tech.name} (L)
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Fatigue */}
      <div className="stat-row">
        <label>Fatigue:</label>
        <div className="fatigue-section">
          <button
            className="small-btn"
            onClick={() => modifyFatigue(character.id, -1)}
            disabled={character.fatigue === 0}
          >
            -
          </button>
          <span className="fatigue-value">{character.fatigue}</span>
          <button
            className="small-btn"
            onClick={() => modifyFatigue(character.id, 1)}
            disabled={character.fatigue === 5}
          >
            +
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="stat-row">
        <label>Balance:</label>
        <div className="balance-section">
          <button
            className="small-btn"
            onClick={() => modifyBalance(character.id, -1)}
            disabled={character.balance.current === character.balance.min}
          >
            ←
          </button>
          <span className="balance-value">{getBalanceDisplay(character.balance)}</span>
          <button
            className="small-btn"
            onClick={() => modifyBalance(character.id, 1)}
            disabled={character.balance.current === character.balance.max}
          >
            →
          </button>
        </div>
      </div>

      {/* Conditions */}
      <div className="conditions-section">
        <label>Conditions:</label>
        <div className="conditions-grid">
          {character.conditions.map((condition) => (
            <button
              key={condition.type}
              className={`condition-btn ${condition.marked ? 'marked' : ''}`}
              onClick={() => toggleCondition(character.id, condition.type)}
            >
              {condition.type}
            </button>
          ))}
        </div>
      </div>

      {/* Statuses */}
      <div className="list-section">
        <div className="list-header">
          <label>Statuses:</label>
          <button
            className="small-btn"
            onClick={() => setShowStatusForm(!showStatusForm)}
          >
            +
          </button>
        </div>
        {showStatusForm && (
          <form onSubmit={handleAddStatus} className="add-form">
            <select
              value={selectedStatusPreset}
              onChange={handleStatusPresetChange}
              required
            >
              <option value="">Select status...</option>
              <option value="doomed">Doomed</option>
              <option value="impaired">Impaired</option>
              <option value="trapped">Trapped</option>
              <option value="stunned">Stunned</option>
              <option value="empowered">Empowered</option>
              <option value="favored">Favored</option>
              <option value="inspired">Inspired</option>
              <option value="prepared">Prepared</option>
              <option value="custom">Custom...</option>
            </select>
            {selectedStatusPreset === 'custom' && (
              <>
                <input name="statusName" placeholder="Status name" required />
                <input name="statusDesc" placeholder="Description" />
                <input
                  name="techMod"
                  type="number"
                  placeholder="Tech modifier"
                  defaultValue="0"
                />
              </>
            )}
            <button type="submit">Add</button>
            <button type="button" onClick={() => {
              setShowStatusForm(false);
              setSelectedStatusPreset('');
            }}>
              Cancel
            </button>
          </form>
        )}
        <div className="list-items">
          {character.statuses.map((status) => (
            <div key={status.id} className="list-item">
              <div>
                <strong>{status.name}</strong>
                {status.techniquesModifier !== undefined && status.techniquesModifier !== 0 && (
                  <span className="modifier-badge">
                    {status.techniquesModifier > 0 ? '+' : ''}
                    {status.techniquesModifier} tech
                  </span>
                )}
                {status.description && <p>{status.description}</p>}
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeStatus(character.id, status.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modifiers */}
      <div className="list-section">
        <div className="list-header">
          <label>Modifiers:</label>
          <button
            className="small-btn"
            onClick={() => setShowModifierForm(!showModifierForm)}
          >
            +
          </button>
        </div>
        {showModifierForm && (
          <form onSubmit={handleAddModifier} className="add-form">
            <select name="modType" required>
              <option value="forward">Forward</option>
              <option value="ongoing">Ongoing</option>
            </select>
            <input
              name="modValue"
              type="number"
              placeholder="Value (+/-)"
              required
            />
            <input name="appliesTo" placeholder="Applies to (optional)" />
            <input name="modDesc" placeholder="Description" required />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setShowModifierForm(false)}>
              Cancel
            </button>
          </form>
        )}
        <div className="list-items">
          {character.modifiers.map((modifier) => (
            <div key={modifier.id} className="list-item">
              <div>
                <strong>
                  {modifier.type === 'forward' ? 'Forward' : 'Ongoing'}{' '}
                  {modifier.value > 0 ? '+' : ''}
                  {modifier.value}
                </strong>
                {modifier.appliesTo && <span> to {modifier.appliesTo}</span>}
                <p>{modifier.description}</p>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeModifier(character.id, modifier.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Techniques (PC only) */}
      {isPc && (
        <div className="list-section">
          <div className="list-header">
            <label>Techniques:</label>
            <button
              className="small-btn"
              onClick={() => setShowTechniqueForm(!showTechniqueForm)}
            >
              +
            </button>
          </div>
          {showTechniqueForm && (
            <form onSubmit={handleAddTechnique} className="add-form">
              <select
                value={selectedTechnique}
                onChange={(e) => setSelectedTechnique(e.target.value)}
                required
              >
                <option value="">Select advanced technique...</option>
                {TECHNIQUES
                  .filter(tech => {
                    // Only show Advanced complexity techniques (Basic are always available in combat)
                    if (tech.complexity !== 'Advanced') return false;
                    // Universal techniques are always available
                    if (tech.training === 'universal') return true;
                    // Check if character has training for this technique
                    if (character.type === 'pc' && character.training) {
                      return character.training.some(t => t.toLowerCase() === tech.training.toLowerCase());
                    }
                    return false;
                  })
                  .map((tech) => (
                    <option key={tech.name} value={tech.name}>
                      {tech.name} ({tech.training})
                    </option>
                  ))}
              </select>
              <select name="techLevel" required>
                <option value="learned">Learned</option>
                <option value="practiced">Practiced</option>
                <option value="mastered">Mastered</option>
              </select>
              <button type="submit">Add</button>
              <button type="button" onClick={() => {
                setShowTechniqueForm(false);
                setSelectedTechnique('');
              }}>
                Cancel
              </button>
            </form>
          )}
          <div className="list-items">
            {character.type === 'pc' && character.techniques.map((technique) => (
              <div key={technique.id} className="list-item technique-item">
                <div>
                  <strong>{technique.name}</strong>
                  <span className={`tech-level-badge ${technique.level}`}>
                    {technique.level}
                  </span>
                  <p className="technique-training">{technique.training}</p>
                </div>
                <div className="technique-controls">
                  <select
                    value={technique.level}
                    onChange={(e) => handleUpdateTechniqueLevel(technique.id, e.target.value as TechniqueLevel)}
                    className="tech-level-select"
                  >
                    <option value="learned">Learned</option>
                    <option value="practiced">Practiced</option>
                    <option value="mastered">Mastered</option>
                  </select>
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveTechnique(technique.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card-actions">
        <button
          className="action-btn"
          onClick={() => resetCharacterToBase(character.id)}
        >
          Reset to Base
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;
