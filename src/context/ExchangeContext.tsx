import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ExchangeState, PC, NPC, AnyCharacter, Approach, Condition, Status, Modifier, CharacterTechnique, TechniqueLevel, SelectedTechnique } from '../types';
import { generateId, rollStance, calculateStanceFromRoll } from '../utils/helpers';

interface ExchangeContextType {
  state: ExchangeState;
  addPC: (pc: Omit<PC, 'id'>) => void;
  addNPC: (npc: Omit<NPC, 'id'>) => void;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<AnyCharacter>) => void;
  setApproach: (id: string, approach: Approach) => void;
  rollStanceForCharacter: (id: string) => void;
  setStanceManually: (id: string, rollResult: number) => void;
  modifyTechniques: (id: string, amount: number) => void;
  modifyFatigue: (id: string, amount: number) => void;
  modifyBalance: (id: string, amount: number) => void;
  toggleCondition: (id: string, conditionType: Condition['type']) => void;
  addStatus: (id: string, status: Status) => void;
  removeStatus: (id: string, statusId: string) => void;
  addModifier: (id: string, modifier: Modifier) => void;
  removeModifier: (id: string, modifierId: string) => void;
  addTechnique: (id: string, technique: CharacterTechnique) => void;
  removeTechnique: (id: string, techniqueId: string) => void;
  updateTechniqueLevel: (id: string, techniqueId: string, level: TechniqueLevel) => void;
  selectTechnique: (id: string, technique: SelectedTechnique) => void;
  unselectTechnique: (id: string, techniqueId: string) => void;
  clearSelectedTechniques: (id: string) => void;
  resetCharacterToBase: (id: string) => void;
  clearExchange: () => void;
  nextPhase: () => void;
  resetPhase: () => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

const initialState: ExchangeState = {
  pcs: [],
  npcs: [],
  round: 1,
  phase: 'setup',
};

export const ExchangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExchangeState>(initialState);

  const addPC = (pc: Omit<PC, 'id'>) => {
    if (state.pcs.length >= 6) {
      alert('Maximum 6 PCs allowed');
      return;
    }
    const newPC: PC = { ...pc, id: generateId() };
    setState(prev => ({ ...prev, pcs: [...prev.pcs, newPC] }));
  };

  const addNPC = (npc: Omit<NPC, 'id'>) => {
    if (state.npcs.length >= 6) {
      alert('Maximum 6 NPCs allowed');
      return;
    }
    const newNPC: NPC = { ...npc, id: generateId() };
    setState(prev => ({ ...prev, npcs: [...prev.npcs, newNPC] }));
  };

  const removeCharacter = (id: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.filter(pc => pc.id !== id),
      npcs: prev.npcs.filter(npc => npc.id !== id),
    }));
  };

  const updateCharacter = (id: string, updates: Partial<AnyCharacter>) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc => pc.id === id ? { ...pc, ...updates } as PC : pc),
      npcs: prev.npcs.map(npc => npc.id === id ? { ...npc, ...updates } as NPC : npc),
    }));
  };

  const setApproach = (id: string, approach: Approach) => {
    updateCharacter(id, { approach });
  };

  const rollStanceForCharacter = (id: string) => {
    const stance = rollStance();
    updateCharacter(id, { stance });
  };

  const setStanceManually = (id: string, rollResult: number) => {
    const stance = calculateStanceFromRoll(rollResult);
    updateCharacter(id, { stance });
  };

  const modifyTechniques = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, techniquesModifier: pc.techniquesModifier + amount } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, techniquesModifier: npc.techniquesModifier + amount } : npc
      ),
    }));
  };

  const modifyFatigue = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc => {
        if (pc.id === id) {
          return { ...pc, fatigue: Math.max(0, Math.min(5, pc.fatigue + amount)) };
        }
        return pc;
      }),
      npcs: prev.npcs.map(npc => {
        if (npc.id === id) {
          return { ...npc, fatigue: Math.max(0, Math.min(5, npc.fatigue + amount)) };
        }
        return npc;
      }),
    }));
  };

  const modifyBalance = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc => {
        if (pc.id === id) {
          const newValue = Math.max(
            pc.balance.min,
            Math.min(pc.balance.max, pc.balance.current + amount)
          );
          return {
            ...pc,
            balance: { ...pc.balance, current: newValue },
          };
        }
        return pc;
      }),
      npcs: prev.npcs.map(npc => {
        if (npc.id === id) {
          const newValue = Math.max(
            npc.balance.min,
            Math.min(npc.balance.max, npc.balance.current + amount)
          );
          return {
            ...npc,
            balance: { ...npc.balance, current: newValue },
          };
        }
        return npc;
      }),
    }));
  };

  const toggleCondition = (id: string, conditionType: Condition['type']) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc => {
        if (pc.id === id) {
          return {
            ...pc,
            conditions: pc.conditions.map(c =>
              c.type === conditionType ? { ...c, marked: !c.marked } : c
            ),
          };
        }
        return pc;
      }),
      npcs: prev.npcs.map(npc => {
        if (npc.id === id) {
          return {
            ...npc,
            conditions: npc.conditions.map(c =>
              c.type === conditionType ? { ...c, marked: !c.marked } : c
            ),
          };
        }
        return npc;
      }),
    }));
  };

  const addStatus = (id: string, status: Status) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, statuses: [...pc.statuses, status] } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, statuses: [...npc.statuses, status] } : npc
      ),
    }));
  };

  const removeStatus = (id: string, statusId: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, statuses: pc.statuses.filter(s => s.id !== statusId) } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, statuses: npc.statuses.filter(s => s.id !== statusId) } : npc
      ),
    }));
  };

  const addModifier = (id: string, modifier: Modifier) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, modifiers: [...pc.modifiers, modifier] } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, modifiers: [...npc.modifiers, modifier] } : npc
      ),
    }));
  };

  const removeModifier = (id: string, modifierId: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, modifiers: pc.modifiers.filter(m => m.id !== modifierId) } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, modifiers: npc.modifiers.filter(m => m.id !== modifierId) } : npc
      ),
    }));
  };

  const addTechnique = (id: string, technique: CharacterTechnique) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, techniques: [...pc.techniques, technique] } : pc
      ),
    }));
  };

  const removeTechnique = (id: string, techniqueId: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, techniques: pc.techniques.filter(t => t.id !== techniqueId) } : pc
      ),
    }));
  };

  const updateTechniqueLevel = (id: string, techniqueId: string, level: TechniqueLevel) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? {
          ...pc,
          techniques: pc.techniques.map(t =>
            t.id === techniqueId ? { ...t, level } : t
          )
        } : pc
      ),
    }));
  };

  const selectTechnique = (id: string, technique: SelectedTechnique) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, selectedTechniques: [...pc.selectedTechniques, technique] } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, selectedTechniques: [...npc.selectedTechniques, technique] } : npc
      ),
    }));
  };

  const unselectTechnique = (id: string, techniqueId: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, selectedTechniques: pc.selectedTechniques.filter(t => t.techniqueId !== techniqueId) } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, selectedTechniques: npc.selectedTechniques.filter(t => t.techniqueId !== techniqueId) } : npc
      ),
    }));
  };

  const clearSelectedTechniques = (id: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc =>
        pc.id === id ? { ...pc, selectedTechniques: [] } : pc
      ),
      npcs: prev.npcs.map(npc =>
        npc.id === id ? { ...npc, selectedTechniques: [] } : npc
      ),
    }));
  };

  const resetCharacterToBase = (id: string) => {
    setState(prev => ({
      ...prev,
      pcs: prev.pcs.map(pc => {
        if (pc.id === id) {
          return {
            ...pc,
            fatigue: pc.baseState.fatigue,
            balance: { ...pc.baseState.balance },
            conditions: pc.baseState.conditions.map(c => ({ ...c })),
            statuses: pc.baseState.statuses.map(s => ({ ...s })),
            approach: 'none',
            stance: null,
            techniquesModifier: 0,
            selectedTechniques: [],
            modifiers: [],
          };
        }
        return pc;
      }),
      npcs: prev.npcs.map(npc => {
        if (npc.id === id) {
          return {
            ...npc,
            fatigue: npc.baseState.fatigue,
            balance: { ...npc.baseState.balance },
            conditions: npc.baseState.conditions.map(c => ({ ...c })),
            statuses: npc.baseState.statuses.map(s => ({ ...s })),
            approach: 'none',
            stance: null,
            techniquesModifier: 0,
            selectedTechniques: [],
            modifiers: [],
          };
        }
        return npc;
      }),
    }));
  };

  const clearExchange = () => {
    setState(initialState);
  };

  const nextPhase = () => {
    const phaseOrder: ExchangeState['phase'][] = ['setup', 'approach', 'stance', 'action', 'resolution'];
    const currentIndex = phaseOrder.indexOf(state.phase);
    const nextIndex = (currentIndex + 1) % phaseOrder.length;

    setState(prev => ({
      ...prev,
      phase: phaseOrder[nextIndex],
      round: nextIndex === 0 ? prev.round + 1 : prev.round,
    }));
  };

  const resetPhase = () => {
    setState(prev => ({ ...prev, phase: 'setup', round: 1 }));
  };

  return (
    <ExchangeContext.Provider
      value={{
        state,
        addPC,
        addNPC,
        removeCharacter,
        updateCharacter,
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
        clearExchange,
        nextPhase,
        resetPhase,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = (): ExchangeContextType => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within ExchangeProvider');
  }
  return context;
};
