import React, { useState } from 'react';
import { useTemplates } from '../hooks/useTemplates';
import { useExchange } from '../context/ExchangeContext';
import type { PC, NPC } from '../types';
import './TemplateManager.css';

interface TemplateManagerProps {
  type: 'pc' | 'npc';
  onClose: () => void;
  onLoadTemplate?: (data: Omit<PC, 'id'> | Omit<NPC, 'id'>) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  type,
  onClose,
  onLoadTemplate,
}) => {
  const { getPCTemplates, getNPCTemplates, deleteTemplate } = useTemplates();
  const { addPC, addNPC } = useExchange();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = type === 'pc' ? getPCTemplates() : getNPCTemplates();

  const handleLoad = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    if (onLoadTemplate) {
      onLoadTemplate(template.data);
    } else {
      // Add directly to exchange
      if (type === 'pc') {
        addPC(template.data as Omit<PC, 'id'>);
      } else {
        addNPC(template.data as Omit<NPC, 'id'>);
      }
    }

    onClose();
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
      if (selectedTemplate === templateId) {
        setSelectedTemplate(null);
      }
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="template-manager">
      <h3>Load {type === 'pc' ? 'PC' : 'NPC'} Template</h3>

      {templates.length === 0 ? (
        <div className="no-templates">
          <p>No saved templates yet</p>
          <p className="hint">
            Create characters and save them as templates for quick access!
          </p>
        </div>
      ) : (
        <div className="templates-list">
          {templates.map((template) => {
            const data = template.data;
            const isPC = data.type === 'pc';

            return (
              <div
                key={template.id}
                className={`template-item ${
                  selectedTemplate === template.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="template-header">
                  <h4>{template.name}</h4>
                  <span className="template-date">
                    {formatDate(template.createdAt)}
                  </span>
                </div>

                <div className="template-details">
                  <p>
                    <strong>Name:</strong> {data.name}
                  </p>
                  {isPC && (
                    <p>
                      <strong>Playbook:</strong>{' '}
                      {(data as Omit<PC, 'id'>).playbook}
                    </p>
                  )}
                  {!isPC && (data as Omit<NPC, 'id'>).role && (
                    <p>
                      <strong>Role:</strong> {(data as Omit<NPC, 'id'>).role}
                    </p>
                  )}
                  <p>
                    <strong>Balance:</strong> {data.balance.leftPrinciple} ↔{' '}
                    {data.balance.rightPrinciple}
                  </p>
                </div>

                <div className="template-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoad(template.id);
                    }}
                  >
                    Load
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(template.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="manager-actions">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TemplateManager;
