// src/lib/persona-manager.ts - Generic Persona Management System

/**
 * Persona Schema Definition
 *
 * A persona represents any AI character that can interact with users.
 * This can be a coding mentor, life coach, therapist, historian, etc.
 */

interface Persona {
  id?: string;
  name: string;
  title: string;
  category?: string;
  avatar?: string;
  avatarUrl?: string;
  enabled?: boolean;
  [key: string]: any;
}

/**
 * Persona Category Types
 */
export const PersonaCategories = {
  EDUCATION: 'education',
  BUSINESS: 'business',
  LIFESTYLE: 'lifestyle',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  TECHNOLOGY: 'technology',
  CREATIVE: 'creative',
  PROFESSIONAL: 'professional',
  FITNESS: 'fitness',
  FINANCE: 'finance',
  PRODUCTIVITY: 'productivity',
};

/**
 * Communication Style Types
 */
export const CommunicationStyles = {
  FORMAL: 'formal',
  CASUAL: 'casual',
  FRIENDLY: 'friendly',
  PROFESSIONAL: 'professional',
  MOTIVATIONAL: 'motivational',
  HUMOROUS: 'humorous',
  EMPATHETIC: 'empathetic',
};

/**
 * Persona Manager Class
 * Handles loading, validation, and retrieval of personas
 */
export class PersonaManager {
  private personas: Map<string, Persona>;
  private categories: Map<string, string[]>;

  constructor(personasConfig: Record<string, any>) {
    this.personas = new Map();
    this.categories = new Map();

    if (personasConfig) {
      this.loadPersonas(personasConfig);
    }
  }

  /**
   * Load personas from configuration
   *
   * @param {Object} config - Personas configuration object
   */
  loadPersonas(config: Record<string, any>) {
    Object.entries(config).forEach(([id, persona]: [string, any]) => {
      const validatedPersona = this.validatePersona(id, persona);
      this.personas.set(id, validatedPersona);

      // Organize by category
      const category = validatedPersona.category || PersonaCategories.EDUCATION;
      if (!this.categories.has(category)) {
        this.categories.set(category, []);
      }
      this.categories.get(category).push(id);
    });
  }

  /**
   * Validate persona structure
   *
   * @param {string} id - Persona ID
   * @param {Object} persona - Persona data
   * @returns {Object} - Validated persona
   */
  validatePersona(id: string, persona: any): Persona {
    const required = ['name', 'description'];
    const missing = required.filter(field => !persona[field]);

    if (missing.length > 0) {
      throw new Error(`Persona '${id}' is missing required fields: ${missing.join(', ')}`);
    }

    return {
      id: id,
      name: persona.name,
      title: persona.title || persona.name,
      subtitle: persona.subtitle || '',
      description: persona.description,
      category: persona.category || PersonaCategories.EDUCATION,

      // Visual properties
      avatar: persona.avatar || '🤖',
      avatarUrl: persona.avatarUrl || null,
      bgColor: persona.bgColor || 'from-gray-100 to-gray-200',
      textColor: persona.textColor || 'text-gray-800',
      accentColor: persona.accentColor || 'bg-gray-500',

      // Expertise and capabilities
      expertise: persona.expertise || [],
      specialties: persona.specialties || [],

      // Communication style
      communicationStyle: {
        tone: persona.communicationStyle?.tone || 'friendly',
        language: persona.communicationStyle?.language || 'English',
        approach: persona.communicationStyle?.approach || 'helpful',
        signature: persona.communicationStyle?.signature || '',
        addressing: persona.communicationStyle?.addressing || '',
      },

      // Personality traits
      catchphrases: persona.catchphrases || [],
      greeting: persona.greeting || `Hello! I'm ${persona.name}. How can I help you today?`,
      bio: persona.bio || persona.description,

      // External links
      websiteUrl: persona.websiteUrl || null,
      socialLinks: persona.socialLinks || {},

      // AI behavior configuration
      systemPrompt: persona.systemPrompt || null,
      responseStyle: persona.responseStyle || {},
      temperature: persona.temperature || 0.7,

      // Scraping configuration
      scrapingConfig: persona.scrapingConfig || null,

      // Metadata
      enabled: persona.enabled !== false,
      featured: persona.featured || false,
      tags: persona.tags || [],
      createdAt: persona.createdAt || new Date().toISOString(),
    };
  }

  /**
   * Get persona by ID
   *
   * @param {string} id - Persona ID
   * @returns {Object|null} - Persona object or null
   */
  getPersona(id: string): Persona | null {
    return this.personas.get(id) || null;
  }

  /**
   * Get all personas
   *
   * @param {Object} filters - Optional filters
   * @returns {Array} - Array of personas
   */
  getAllPersonas(filters: any = {}): Persona[] {
    let personas = Array.from(this.personas.values());

    // Filter by category
    if (filters.category) {
      personas = personas.filter(p => p.category === filters.category);
    }

    // Filter by enabled status
    if (filters.enabled !== undefined) {
      personas = personas.filter(p => p.enabled === filters.enabled);
    }

    // Filter by featured
    if (filters.featured) {
      personas = personas.filter(p => p.featured === true);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      personas = personas.filter(p =>
        filters.tags.some(tag => p.tags.includes(tag))
      );
    }

    return personas;
  }

  /**
   * Get personas by category
   *
   * @param {string} category - Category name
   * @returns {Array} - Array of personas
   */
  getPersonasByCategory(category: string): Persona[] {
    const ids = this.categories.get(category) || [];
    return ids.map(id => this.personas.get(id)).filter(Boolean) as Persona[];
  }

  /**
   * Get all categories with persona counts
   *
   * @returns {Array} - Array of category objects
   */
  getCategories(): Array<{category: string; count: number; personas: string[]}> {
    return Array.from(this.categories.entries()).map(([category, ids]) => ({
      category,
      count: ids.length,
      personas: ids,
    }));
  }

  /**
   * Add or update persona
   *
   * @param {string} id - Persona ID
   * @param {Object} personaData - Persona data
   */
  setPersona(id: string, personaData: any): void {
    const validatedPersona = this.validatePersona(id, personaData);
    this.personas.set(id, validatedPersona);

    // Update category index
    const category = validatedPersona.category;
    if (!this.categories.has(category)) {
      this.categories.set(category, []);
    }
    if (!this.categories.get(category).includes(id)) {
      this.categories.get(category).push(id);
    }
  }

  /**
   * Remove persona
   *
   * @param {string} id - Persona ID
   * @returns {boolean} - True if removed
   */
  removePersona(id: string): boolean {
    const persona = this.personas.get(id);
    if (!persona) return false;

    // Remove from category index
    const categoryIds = this.categories.get(persona.category);
    if (categoryIds) {
      const index = categoryIds.indexOf(id);
      if (index > -1) {
        categoryIds.splice(index, 1);
      }
    }

    return this.personas.delete(id);
  }

  /**
   * Check if persona exists
   *
   * @param {string} id - Persona ID
   * @returns {boolean} - True if exists
   */
  hasPersona(id: string): boolean {
    return this.personas.has(id);
  }

  /**
   * Get persona count
   *
   * @returns {number} - Total number of personas
   */
  getPersonaCount(): number {
    return this.personas.size;
  }

  /**
   * Search personas by query
   *
   * @param {string} query - Search query
   * @returns {Array} - Matching personas
   */
  searchPersonas(query: string): Persona[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.personas.values()).filter(persona => {
      return (
        persona.name.toLowerCase().includes(lowerQuery) ||
        persona.description.toLowerCase().includes(lowerQuery) ||
        persona.expertise.some(e => e.toLowerCase().includes(lowerQuery)) ||
        persona.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Get full persona name (for backwards compatibility)
   *
   * @param {string} id - Persona ID
   * @returns {string} - Full name
   */
  getPersonaName(id) {
    const persona = this.getPersona(id);
    return persona ? persona.name : id;
  }

  /**
   * Export personas to JSON
   *
   * @returns {string} - JSON string
   */
  exportToJSON() {
    const personasObj = {};
    this.personas.forEach((persona, id) => {
      personasObj[id] = persona;
    });
    return JSON.stringify(personasObj, null, 2);
  }

  /**
   * Import personas from JSON
   *
   * @param {string} jsonString - JSON string
   */
  importFromJSON(jsonString) {
    const config = JSON.parse(jsonString);
    this.loadPersonas(config);
  }
}

/**
 * Create persona manager instance
 *
 * @param {Object} config - Personas configuration
 * @returns {PersonaManager} - Manager instance
 */
export function createPersonaManager(config) {
  return new PersonaManager(config);
}

/**
 * Default persona template
 */
export const DEFAULT_PERSONA_TEMPLATE = {
  name: 'New Persona',
  title: 'AI Assistant',
  subtitle: '',
  description: 'A helpful AI assistant',
  category: PersonaCategories.EDUCATION,
  avatar: '🤖',
  avatarUrl: null,
  bgColor: 'from-gray-100 to-gray-200',
  textColor: 'text-gray-800',
  accentColor: 'bg-gray-500',
  expertise: [],
  specialties: [],
  communicationStyle: {
    tone: 'friendly',
    language: 'English',
    approach: 'helpful',
    signature: '',
    addressing: '',
  },
  catchphrases: [],
  greeting: 'Hello! How can I help you today?',
  bio: 'A helpful AI assistant',
  websiteUrl: null,
  socialLinks: {},
  systemPrompt: null,
  responseStyle: {},
  temperature: 0.7,
  scrapingConfig: null,
  enabled: true,
  featured: false,
  tags: [],
};
