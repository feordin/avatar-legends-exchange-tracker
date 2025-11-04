import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import CharacterCard from './CharacterCard';
import AddCharacterForm from './AddCharacterForm';
import ActionOrderPanel from './ActionOrderPanel';
import TemplateManager from './TemplateManager';
import { calculateActionOrder } from '../utils/helpers';
import './ExchangeTracker.css';

const ExchangeTracker: React.FC = () => {
  const { state, nextPhase, resetPhase, clearExchange } = useExchange();
  const [showAddPC, setShowAddPC] = useState(false);
  const [showAddNPC, setShowAddNPC] = useState(false);
  const [showLoadPC, setShowLoadPC] = useState(false);
  const [showLoadNPC, setShowLoadNPC] = useState(false);

  const allCharacters = [...state.pcs, ...state.npcs];
  const actionOrder = calculateActionOrder(allCharacters);

  const handleClearExchange = () => {
    if (confirm('Are you sure you want to clear the entire exchange?')) {
      clearExchange();
    }
  };

  return (
    <div className="exchange-tracker">
      {/* Control Panel */}
      <div className="control-panel">
        <div className="phase-info">
          <span className="round-badge">Round {state.round}</span>
          <span className="phase-badge">{state.phase.toUpperCase()}</span>
        </div>
        <div className="control-buttons">
          <button onClick={() => setShowAddPC(!showAddPC)}>
            Add PC ({state.pcs.length}/6)
          </button>
          <button onClick={() => setShowLoadPC(!showLoadPC)}>
            Load PC Template
          </button>
          <button onClick={() => setShowAddNPC(!showAddNPC)}>
            Add NPC ({state.npcs.length}/6)
          </button>
          <button onClick={() => setShowLoadNPC(!showLoadNPC)}>
            Load NPC Template
          </button>
          <button onClick={nextPhase}>Next Phase</button>
          <button onClick={resetPhase}>Reset Phase</button>
          <button onClick={handleClearExchange} className="danger-btn">
            Clear Exchange
          </button>
        </div>
      </div>

      {/* Add Character Forms */}
      {showAddPC && (
        <div className="add-character-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowAddPC(false)}
            >
              ×
            </button>
            <h2>Add Player Character</h2>
            <AddCharacterForm
              type="pc"
              onClose={() => setShowAddPC(false)}
            />
          </div>
        </div>
      )}

      {showAddNPC && (
        <div className="add-character-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowAddNPC(false)}
            >
              ×
            </button>
            <h2>Add Non-Player Character</h2>
            <AddCharacterForm
              type="npc"
              onClose={() => setShowAddNPC(false)}
            />
          </div>
        </div>
      )}

      {/* Load Template Modals */}
      {showLoadPC && (
        <div className="add-character-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowLoadPC(false)}
            >
              ×
            </button>
            <TemplateManager
              type="pc"
              onClose={() => setShowLoadPC(false)}
            />
          </div>
        </div>
      )}

      {showLoadNPC && (
        <div className="add-character-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowLoadNPC(false)}
            >
              ×
            </button>
            <TemplateManager
              type="npc"
              onClose={() => setShowLoadNPC(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="exchange-content">
        {/* Action Order Panel */}
        <div className="side-panel">
          <ActionOrderPanel actionOrder={actionOrder} />
        </div>

        {/* Characters Grid */}
        <div className="characters-container">
          {/* PCs Section */}
          <div className="characters-section">
            <h2 className="section-title pc-title">
              Player Characters ({state.pcs.length}/6)
            </h2>
            <div className="characters-grid">
              {state.pcs.map((pc) => (
                <CharacterCard key={pc.id} character={pc} />
              ))}
              {state.pcs.length === 0 && (
                <div className="empty-state">
                  <p>No PCs added yet</p>
                  <button onClick={() => setShowAddPC(true)}>Add PC</button>
                </div>
              )}
            </div>
          </div>

          {/* NPCs Section */}
          <div className="characters-section">
            <h2 className="section-title npc-title">
              Non-Player Characters ({state.npcs.length}/6)
            </h2>
            <div className="characters-grid">
              {state.npcs.map((npc) => (
                <CharacterCard key={npc.id} character={npc} />
              ))}
              {state.npcs.length === 0 && (
                <div className="empty-state">
                  <p>No NPCs added yet</p>
                  <button onClick={() => setShowAddNPC(true)}>Add NPC</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeTracker;
