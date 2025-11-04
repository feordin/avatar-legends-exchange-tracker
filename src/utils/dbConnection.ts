/**
 * Azure Data API Builder connection utility
 * Provides cloud storage with localStorage fallback
 */

import type { SavedTemplate } from '../types';

interface AzureDataAPIConfig {
  endpoint: string;
  apiKey?: string;
}

// Configuration - can be moved to environment variables
const AZURE_CONFIG: AzureDataAPIConfig = {
  endpoint: import.meta.env.VITE_AZURE_DATA_API_ENDPOINT || '',
  apiKey: import.meta.env.VITE_AZURE_DATA_API_KEY,
};

// Storage keys
const LOCAL_STORAGE_KEY = 'avatar-legends-templates';
const CLOUD_AVAILABLE_KEY = 'avatar-legends-cloud-available';
const LAST_SYNC_KEY = 'avatar-legends-last-sync';

export class TemplateStorageService {
  private static instance: TemplateStorageService;
  private cloudAvailable: boolean = false;
  private syncInProgress: boolean = false;

  private constructor() {
    this.checkCloudAvailability();
  }

  static getInstance(): TemplateStorageService {
    if (!TemplateStorageService.instance) {
      TemplateStorageService.instance = new TemplateStorageService();
    }
    return TemplateStorageService.instance;
  }

  /**
   * Check if Azure Data API Builder is available
   */
  private async checkCloudAvailability(): Promise<boolean> {
    if (!AZURE_CONFIG.endpoint) {
      console.log('Azure Data API endpoint not configured, using localStorage only');
      this.cloudAvailable = false;
      localStorage.setItem(CLOUD_AVAILABLE_KEY, 'false');
      return false;
    }

    try {
      const response = await fetch(`${AZURE_CONFIG.endpoint}/api/templates`, {
        method: 'HEAD',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      this.cloudAvailable = response.ok;
      localStorage.setItem(CLOUD_AVAILABLE_KEY, this.cloudAvailable.toString());
      return this.cloudAvailable;
    } catch (error) {
      console.warn('Cloud storage unavailable, falling back to localStorage:', error);
      this.cloudAvailable = false;
      localStorage.setItem(CLOUD_AVAILABLE_KEY, 'false');
      return false;
    }
  }

  /**
   * Get request headers for Azure Data API
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (AZURE_CONFIG.apiKey) {
      headers['X-API-Key'] = AZURE_CONFIG.apiKey;
    }

    return headers;
  }

  /**
   * Get all templates (cloud first, then localStorage fallback)
   */
  async getTemplates(): Promise<SavedTemplate[]> {
    // Try cloud first if available
    if (this.cloudAvailable && AZURE_CONFIG.endpoint) {
      try {
        const response = await fetch(`${AZURE_CONFIG.endpoint}/api/templates`, {
          method: 'GET',
          headers: this.getHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          const templates = data.value || data;
          console.log('Loaded templates from cloud:', templates.length);

          // Also save to localStorage as cache
          this.saveToLocalStorage(templates);
          return templates;
        }
      } catch (error) {
        console.warn('Failed to load from cloud, using localStorage:', error);
        this.cloudAvailable = false;
      }
    }

    // Fallback to localStorage
    return this.loadFromLocalStorage();
  }

  /**
   * Save template (cloud first, then localStorage fallback)
   */
  async saveTemplate(template: SavedTemplate): Promise<void> {
    // Save to localStorage first (optimistic update)
    const templates = this.loadFromLocalStorage();
    const newTemplates = [...templates, template];
    this.saveToLocalStorage(newTemplates);

    // Try to sync to cloud
    if (this.cloudAvailable && AZURE_CONFIG.endpoint) {
      try {
        const response = await fetch(`${AZURE_CONFIG.endpoint}/api/templates`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(template),
        });

        if (!response.ok) {
          throw new Error(`Cloud save failed: ${response.statusText}`);
        }

        console.log('Template saved to cloud:', template.name);
        this.updateLastSync();
      } catch (error) {
        console.error('Failed to save to cloud, data saved locally only:', error);
      }
    }
  }

  /**
   * Update template (cloud first, then localStorage fallback)
   */
  async updateTemplate(
    id: string,
    updates: Partial<Omit<SavedTemplate, 'id' | 'createdAt'>>
  ): Promise<void> {
    // Update in localStorage first (optimistic update)
    const templates = this.loadFromLocalStorage();
    const newTemplates = templates.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
    );
    this.saveToLocalStorage(newTemplates);

    // Try to sync to cloud
    if (this.cloudAvailable && AZURE_CONFIG.endpoint) {
      try {
        const response = await fetch(
          `${AZURE_CONFIG.endpoint}/api/templates/${id}`,
          {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(updates),
          }
        );

        if (!response.ok) {
          throw new Error(`Cloud update failed: ${response.statusText}`);
        }

        console.log('Template updated in cloud:', id);
        this.updateLastSync();
      } catch (error) {
        console.error('Failed to update in cloud, data updated locally only:', error);
      }
    }
  }

  /**
   * Delete template (cloud first, then localStorage fallback)
   */
  async deleteTemplate(id: string): Promise<void> {
    // Delete from localStorage first (optimistic update)
    const templates = this.loadFromLocalStorage();
    const newTemplates = templates.filter((t) => t.id !== id);
    this.saveToLocalStorage(newTemplates);

    // Try to sync to cloud
    if (this.cloudAvailable && AZURE_CONFIG.endpoint) {
      try {
        const response = await fetch(
          `${AZURE_CONFIG.endpoint}/api/templates/${id}`,
          {
            method: 'DELETE',
            headers: this.getHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Cloud delete failed: ${response.statusText}`);
        }

        console.log('Template deleted from cloud:', id);
        this.updateLastSync();
      } catch (error) {
        console.error('Failed to delete from cloud, data deleted locally only:', error);
      }
    }
  }

  /**
   * Sync local storage to cloud (for recovery or initial sync)
   */
  async syncToCloud(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    if (!this.cloudAvailable || !AZURE_CONFIG.endpoint) {
      console.log('Cloud not available, cannot sync');
      return;
    }

    this.syncInProgress = true;

    try {
      const localTemplates = this.loadFromLocalStorage();

      // Get cloud templates
      const cloudTemplates = await this.getTemplates();
      const cloudIds = new Set(cloudTemplates.map(t => t.id));

      // Upload local templates that don't exist in cloud
      for (const template of localTemplates) {
        if (!cloudIds.has(template.id)) {
          await fetch(`${AZURE_CONFIG.endpoint}/api/templates`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(template),
          });
        }
      }

      console.log('Sync to cloud completed');
      this.updateLastSync();
    } catch (error) {
      console.error('Failed to sync to cloud:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Load templates from localStorage
   */
  private loadFromLocalStorage(): SavedTemplate[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  /**
   * Save templates to localStorage
   */
  private saveToLocalStorage(templates: SavedTemplate[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Update last sync timestamp
   */
  private updateLastSync(): void {
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  }

  /**
   * Get last sync timestamp
   */
  getLastSync(): number | null {
    const timestamp = localStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp) : null;
  }

  /**
   * Check if cloud is currently available
   */
  isCloudAvailable(): boolean {
    return this.cloudAvailable;
  }

  /**
   * Force refresh cloud availability check
   */
  async refreshCloudAvailability(): Promise<boolean> {
    return await this.checkCloudAvailability();
  }
}

// Export singleton instance
export const templateStorage = TemplateStorageService.getInstance();
