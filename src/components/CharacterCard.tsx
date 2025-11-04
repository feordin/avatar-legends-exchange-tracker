import React, { useState } from 'react';
import type { AnyCharacter, Approach, Status, Modifier } from '../types';
import { useExchange } from '../context/ExchangeContext';
import {
  getBalanceDisplay,
  calculateTechniquesAllowed,
  generateId,
} from '../utils/helpers';
import './CharacterCard.css';

interface CharacterCardProps {
  character: AnyCharacter;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const {
    setApproach,
    rollStanceForCharacter,
    modifyFatigue,
    modifyBalance,
    toggleCondition,
    addStatus,
    removeStatus,
    addModifier,
    removeModifier,
    resetCharacterToBase,
    removeCharacter,
  } = useExchange();

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showModifierForm, setShowModifierForm] = useState(false);

  const isPc = character.type === 'pc';
  const techniquesAllowed = calculateTechniquesAllowed(character.stance, character.statuses);

  const handleApproachChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApproach(character.id, e.target.value as Approach);
  };

  const handleAddStatus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const status: Status = {
      id: generateId(),
      name: formData.get('statusName') as string,
      description: formData.get('statusDesc') as string,
      techniquesModifier: parseInt(formData.get('techMod') as string) || 0,
    };
    addStatus(character.id, status);
    setShowStatusForm(false);
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
          {character.stance ? (
            <span className="stance-result">
              Roll: {character.stance.result} | Techniques: {techniquesAllowed}
            </span>
          ) : (
            <span className="no-stance">Not rolled</span>
          )}
          <button
            className="small-btn"
            onClick={() => rollStanceForCharacter(character.id)}
          >
            Roll
          </button>
        </div>
      </div>

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
            <input name="statusName" placeholder="Status name" required />
            <input name="statusDesc" placeholder="Description" />
            <input
              name="techMod"
              type="number"
              placeholder="Tech modifier"
              defaultValue="0"
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setShowStatusForm(false)}>
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
