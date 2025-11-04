import { useState, useEffect } from 'react';
import type { SavedTemplate, PC, NPC } from '../types';
import { generateId } from '../utils/helpers';
import { templateStorage } from '../utils/dbConnection';
import { initializePreloadedNPCs } from '../data/preloadedNPCs';

export function useTemplates() {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudAvailable, setCloudAvailable] = useState(false);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      let loadedTemplates = await templateStorage.getTemplates();

      // Initialize pre-loaded NPCs if they don't exist
      loadedTemplates = await initializePreloadedNPCs(loadedTemplates);

      setTemplates(loadedTemplates);
      setCloudAvailable(templateStorage.isCloudAvailable());
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (
    name: string,
    data: Omit<PC, 'id'> | Omit<NPC, 'id'>
  ): Promise<void> => {
    const template: SavedTemplate = {
      id: generateId(),
      name,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic update
    setTemplates(prev => [...prev, template]);

    // Save to storage (cloud + localStorage)
    try {
      await templateStorage.saveTemplate(template);
    } catch (error) {
      console.error('Error saving template:', error);
      // Revert optimistic update on error
      setTemplates(prev => prev.filter(t => t.id !== template.id));
    }
  };

  const updateTemplate = async (
    id: string,
    updates: Partial<Omit<SavedTemplate, 'id' | 'createdAt'>>
  ): Promise<void> => {
    const updatedTemplates = templates.map((template) =>
      template.id === id
        ? { ...template, ...updates, updatedAt: Date.now() }
        : template
    );

    // Optimistic update
    setTemplates(updatedTemplates);

    // Save to storage (cloud + localStorage)
    try {
      await templateStorage.updateTemplate(id, updates);
    } catch (error) {
      console.error('Error updating template:', error);
      // Revert optimistic update on error
      setTemplates(templates);
    }
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    // Optimistic update
    const previousTemplates = templates;
    setTemplates(prev => prev.filter((template) => template.id !== id));

    // Delete from storage (cloud + localStorage)
    try {
      await templateStorage.deleteTemplate(id);
    } catch (error) {
      console.error('Error deleting template:', error);
      // Revert optimistic update on error
      setTemplates(previousTemplates);
    }
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

  const syncToCloud = async (): Promise<void> => {
    try {
      await templateStorage.syncToCloud();
      await loadTemplates(); // Reload after sync
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
  };

  const refreshCloudStatus = async (): Promise<void> => {
    const available = await templateStorage.refreshCloudAvailability();
    setCloudAvailable(available);
  };

  return {
    templates,
    loading,
    cloudAvailable,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getPCTemplates,
    getNPCTemplates,
    syncToCloud,
    refreshCloudStatus,
    reload: loadTemplates,
  };
}
