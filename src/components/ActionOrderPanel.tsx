import React from 'react';
import type { ActionOrder } from '../types';
import { formatApproach } from '../utils/helpers';
import './ActionOrderPanel.css';

interface ActionOrderPanelProps {
  actionOrder: ActionOrder[];
}

const ActionOrderPanel: React.FC<ActionOrderPanelProps> = ({ actionOrder }) => {
  return (
    <div className="action-order-panel">
      <h3>Action Order</h3>
      {actionOrder.length === 0 ? (
        <div className="no-actions">
          <p>No characters have selected an approach yet</p>
        </div>
      ) : (
        <ol className="action-order-list">
          {actionOrder.map((entry) => (
            <li key={entry.characterId} className="action-order-item">
              <div className="character-info">
                <span className="character-name">{entry.character.name}</span>
                <span className="character-type">
                  {entry.character.type === 'pc' ? 'PC' : 'NPC'}
                </span>
              </div>
              <div className="approach-info">
                {formatApproach(entry.approach)}
              </div>
              {entry.character.stance && (
                <div className="stance-info">
                  Stance: {entry.character.stance.result}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ActionOrderPanel;
