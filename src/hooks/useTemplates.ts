import { useLocalStorage } from './useLocalStorage';
import type { SavedTemplate, PC, NPC } from '../types';
import { generateId } from '../utils/helpers';

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<SavedTemplate[]>(
    'avatar-legends-templates',
    []
  );

  const saveTemplate = (
    name: string,
    data: Omit<PC, 'id'> | Omit<NPC, 'id'>
  ): void => {
    const template: SavedTemplate = {
      id: generateId(),
      name,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setTemplates((prev) => [...prev, template]);
  };

  const updateTemplate = (
    id: string,
    updates: Partial<Omit<SavedTemplate, 'id' | 'createdAt'>>
  ): void => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: Date.now() }
          : template
      )
    );
  };

  const deleteTemplate = (id: string): void => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  };

  const getTemplate = (id: string): SavedTemplate | undefined => {
    return templates.find((template) => template.id === id);
  };

  const getPCTemplates = (): SavedTemplate[] => {
    return templates.filter((template) => template.data.type === 'pc');
  };

  const getNPCTemplates = (): SavedTemplate[] => {
    return templates.filter((template) => template.data.type === 'npc');
  };

  return {
    templates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getPCTemplates,
    getNPCTemplates,
  };
}
