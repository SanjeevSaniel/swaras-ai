// src/services/hybrid-system.js - Hybrid AI System combining web scraping + GPT
import { OpenAI } from 'openai';
import { WebScraper } from '@/lib/web-scraper';
import { extractAndParseJSON } from '@/lib/json-utils';
import {
  getScrapingTargets,
  CACHE_CONFIG,
  OPENAI_CONFIG,
  personaManager
} from '@/constants/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Hybrid System that combines web scraping with GPT knowledge
 */
export class HybridSystem {
  private cache: Map<string, any>;
  private cacheExpiry: number;
  private scraper: WebScraper;

  constructor() {
    this.cache = new Map();
    this.cacheExpiry = CACHE_CONFIG.EXPIRY_TIME;
    this.scraper = new WebScraper();
  }

  /**
   * Scrapes current platform information for a persona
   *
   * @param {string} personaId - Persona identifier
   * @returns {Promise<Object>} - Scraped data
   */
  async scrapePersonaInfo(personaId) {
    console.log(`🕷️  Scraping platform information for ${personaId}...`);

    const targets = getScrapingTargets(personaId);
    if (!targets || targets.length === 0) {
      console.warn(`No scraping targets configured for ${personaId}`);
      return {};
    }

    return await this.scraper.scrapeMultiple(targets);
  }

  /**
   * Extracts GPT knowledge about a persona
   *
   * @param {string} personaName - Full persona name
   * @param {string} userQuery - User's query for context
   * @returns {Promise<Object>} - GPT knowledge
   */
  async extractGPTKnowledge(personaName, userQuery) {
    console.log(`🧠 Extracting GPT knowledge for ${personaName}...`);

    const gptPrompt = `You are a knowledge extraction system. Based on your training data, provide comprehensive information about ${personaName}.

USER CONTEXT: "${userQuery}"

EXTRACT CURRENT INFORMATION (as of your training data):
1. Professional background and current role
2. Known platforms and websites they own/operate
3. Areas of expertise and teaching focus
4. Communication style and personality
5. Recent projects or initiatives you're aware of

RESPOND WITH JSON:
{
  "personalInfo": {
    "name": "${personaName}",
    "primaryRole": "current main role",
    "background": "professional background",
    "experience": "years of experience"
  },
  "knownPlatforms": [
    {
      "name": "platform name",
      "url": "platform url if known",
      "type": "learning platform/website/youtube",
      "ownership": "owns/operates/founded",
      "confidence": 0.8,
      "description": "what this platform offers"
    }
  ],
  "expertise": ["skill areas"],
  "communicationStyle": {
    "tone": "friendly/direct/encouraging",
    "language": "hinglish/english",
    "catchphrases": ["common phrases they use"],
    "teachingStyle": "step-by-step/practical/theoretical"
  },
  "currentFocus": "what they're currently focused on",
  "limitations": {
    "trainingCutoff": "information may be outdated",
    "confidence": 0.75,
    "uncertainAreas": ["areas where information might be outdated"]
  }
}

CRITICAL: Be honest about confidence levels and potential outdated information.`;

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [{ role: 'user', content: gptPrompt }],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const responseText = response.choices[0].message.content.trim();
      return extractAndParseJSON(responseText);
    } catch (error) {
      throw new Error(`GPT knowledge extraction failed: ${error.message}`);
    }
  }

  /**
   * Synthesizes scraped data with GPT knowledge
   *
   * @param {Object} scrapedData - Data from web scraping
   * @param {Object} gptData - Data from GPT
   * @param {string} personaName - Persona name
   * @param {string} userQuery - User's query
   * @returns {Promise<Object>} - Synthesized knowledge
   */
  async synthesizeKnowledge(scrapedData, gptData, personaName, userQuery) {
    console.log('🧠 Synthesizing scraped data with GPT knowledge...');

    const synthesisPrompt = `You are an information synthesis expert. Combine scraped real-time data with GPT knowledge to create the most accurate profile.

PERSONA: ${personaName}
USER QUERY: "${userQuery}"

REAL-TIME SCRAPED DATA (high confidence):
${JSON.stringify(scrapedData, null, 2)}

GPT TRAINING DATA (may be outdated):
${JSON.stringify(gptData, null, 2)}

SYNTHESIS RULES:
1. Real-time scraped data takes priority over GPT data
2. Use GPT data to fill gaps where scraping didn't capture info
3. Resolve conflicts by favoring scraped data
4. Identify currently active platforms vs historical ones
5. Create unified, current profile

RESPOND WITH JSON:
{
  "currentProfile": {
    "name": "${personaName}",
    "primaryRole": "most current role from available data",
    "currentFocus": "current projects/focus areas",
    "activePlatforms": [
      {
        "name": "platform name",
        "url": "verified current url",
        "type": "platform type",
        "status": "verified active/inactive",
        "confidence": 0.95,
        "dataSource": "scraped/gpt/both",
        "relevantToQuery": true,
        "description": "what platform currently offers"
      }
    ],
    "capabilities": {
      "expertise": ["current expertise areas"],
      "teachingStyle": "current approach",
      "communicationStyle": "how they currently communicate"
    }
  },
  "dataQuality": {
    "overallConfidence": 0.85,
    "scrapingSuccess": true,
    "platformsVerified": 2,
    "gapsIdentified": ["areas where more info needed"],
    "conflicts": ["any conflicts between sources and how resolved"]
  },
  "responseStrategy": {
    "platformToRecommend": "best platform for user query",
    "communicationTone": "how persona should respond",
    "keyPointsToMention": ["important points for this query"]
  }
}`;

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [{ role: 'user', content: synthesisPrompt }],
        temperature: 0.1,
        max_tokens: 1200,
      });

      const responseText = response.choices[0].message.content.trim();
      return extractAndParseJSON(responseText);
    } catch (error) {
      console.error('❌ Knowledge synthesis failed:', error);
      return this.createBasicSynthesis(scrapedData, gptData, personaName);
    }
  }

  /**
   * Creates basic synthesis when AI synthesis fails
   *
   * @param {Object} scrapedData - Scraped data
   * @param {Object} gptData - GPT data
   * @param {string} personaName - Persona name
   * @returns {Object} - Basic synthesized data
   */
  createBasicSynthesis(scrapedData: any, gptData: any, personaName: string): any {
    const activePlatforms: any[] = [];

    // Extract platforms from scraped data
    Object.entries(scrapedData).forEach(([source, data]: [string, any]) => {
      if (data.url && !data.error) {
        activePlatforms.push({
          name: source,
          url: data.url,
          type: 'website',
          status: 'verified active',
          confidence: 0.9,
          dataSource: 'scraped',
        });
      }
    });

    // Add GPT platforms if not found in scraped data
    if (gptData?.knownPlatforms) {
      gptData.knownPlatforms.forEach((platform) => {
        if (!activePlatforms.find((p) => p.url === platform.url)) {
          activePlatforms.push({
            ...platform,
            status: 'unverified',
            dataSource: 'gpt',
          });
        }
      });
    }

    return {
      currentProfile: {
        name: personaName,
        primaryRole: gptData?.personalInfo?.primaryRole || 'Educator/Content Creator',
        activePlatforms,
        capabilities: {
          expertise: gptData?.expertise || ['Web Development', 'Teaching'],
          communicationStyle: gptData?.communicationStyle || {},
        },
      },
      dataQuality: {
        overallConfidence: 0.7,
        scrapingSuccess: Object.values(scrapedData).some((d: any) => !d.error),
        platformsVerified: activePlatforms.filter(
          (p) => p.dataSource === 'scraped',
        ).length,
      },
      responseStrategy: {
        platformToRecommend: activePlatforms[0]?.name || 'website',
        communicationTone: 'authentic and helpful',
      },
    };
  }

  /**
   * Generates persona-specific response guidelines
   *
   * @param {string} personaId - Persona identifier
   * @param {Object} synthesizedKnowledge - Synthesized knowledge
   * @returns {string} - Guidelines text
   */
  getPersonaGuidelines(personaId, synthesizedKnowledge) {
    const persona = personaManager.getPersona(personaId);
    if (!persona) {
      return 'Use authentic and professional tone';
    }

    const style = synthesizedKnowledge.currentProfile?.capabilities?.communicationStyle || persona.communicationStyle;
    const platforms = synthesizedKnowledge.currentProfile?.activePlatforms || [];
    const primaryPlatform = platforms.find((p) => p.relevantToQuery) || platforms[0];

    // Build dynamic guidelines from persona data
    let guidelines = `${persona.name.toUpperCase()} AUTHENTIC STYLE:\n`;
    guidelines += `- Tone: ${style.tone}\n`;
    guidelines += `- Language: ${style.language}\n`;
    guidelines += `- Approach: ${style.approach}\n`;

    if (style.signature) {
      guidelines += `- Signature: ${style.signature}\n`;
    }

    if (style.addressing) {
      guidelines += `- Addressing: ${style.addressing}\n`;
    }

    // Add catchphrases if available
    if (persona.catchphrases && persona.catchphrases.length > 0) {
      guidelines += `\nCOMMON PHRASES:\n`;
      persona.catchphrases.slice(0, 5).forEach(phrase => {
        guidelines += `- "${phrase}"\n`;
      });
    }

    // Add expertise areas
    if (persona.expertise && persona.expertise.length > 0) {
      guidelines += `\nEXPERTISE AREAS:\n`;
      persona.expertise.slice(0, 5).forEach(area => {
        guidelines += `- ${area}\n`;
      });
    }

    // Add platform information
    if (primaryPlatform) {
      guidelines += `\nCURRENT PLATFORM TO MENTION:\n`;
      guidelines += `- ${primaryPlatform.name}: ${primaryPlatform.url}\n`;
      guidelines += `- Describe as your current active platform\n`;
    } else if (persona.websiteUrl) {
      guidelines += `\nCURRENT PLATFORM TO MENTION:\n`;
      guidelines += `- Website: ${persona.websiteUrl}\n`;
    }

    return guidelines;
  }

  /**
   * Generates response using synthesized knowledge
   *
   * @param {string} personaId - Persona identifier
   * @param {string} personaName - Full persona name
   * @param {string} userQuery - User's query
   * @param {Object} synthesizedKnowledge - Synthesized knowledge
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<string>} - Generated response
   */
  async generateResponse(personaId, personaName, userQuery, synthesizedKnowledge, conversationHistory = []) {
    const responsePrompt = `You are ${personaName}. Respond authentically using the most current information available.

CURRENT SYNTHESIZED KNOWLEDGE:
${JSON.stringify(synthesizedKnowledge, null, 2)}

USER QUERY: "${userQuery}"

CONVERSATION HISTORY:
${conversationHistory
  .slice(-4)
  .map((msg) => `${msg.sender === 'user' ? 'User' : 'You'}: ${msg.content}`)
  .join('\n')}

RESPONSE REQUIREMENTS:
1. Use your authentic speaking style from the knowledge
2. Mention currently active platforms relevant to the query
3. Reference your current expertise and offerings
4. Maintain natural conversation flow
5. Include specific platform links if relevant

${this.getPersonaGuidelines(personaId, synthesizedKnowledge)}

Respond as ${personaName} using your current information:`;

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [{ role: 'user', content: responsePrompt }],
        temperature: 0.8,
        max_tokens: 700,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Response generation failed: ${error.message}`);
    }
  }

  /**
   * Main processing method - coordinates entire hybrid flow
   *
   * @param {string} personaId - Persona identifier
   * @param {string} personaName - Full persona name
   * @param {string} userQuery - User's query
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<Object>} - Response and metadata
   */
  async process(personaId, personaName, userQuery, conversationHistory = []) {
    console.log(`🔄 Processing hybrid system for ${personaName}...`);

    try {
      // Run scraping and GPT extraction in parallel
      const [scrapedData, gptData] = await Promise.allSettled([
        this.scrapePersonaInfo(personaId),
        this.extractGPTKnowledge(personaName, userQuery),
      ]);

      const scrapingResult = scrapedData.status === 'fulfilled' ? scrapedData.value : {};
      const gptResult = gptData.status === 'fulfilled' ? gptData.value : null;

      console.log('📊 Data collection results:');
      console.log(`   Scraping: ${scrapedData.status} (${Object.keys(scrapingResult).length} sources)`);
      console.log(`   GPT: ${gptData.status}`);

      // Synthesize the knowledge
      const synthesizedKnowledge = await this.synthesizeKnowledge(
        scrapingResult,
        gptResult,
        personaName,
        userQuery,
      );

      // Generate response
      const response = await this.generateResponse(
        personaId,
        personaName,
        userQuery,
        synthesizedKnowledge,
        conversationHistory,
      );

      return {
        response,
        metadata: {
          source: 'hybrid_system',
          scrapingSuccess: scrapedData.status === 'fulfilled',
          gptSuccess: gptData.status === 'fulfilled',
          platformsFound: synthesizedKnowledge.currentProfile.activePlatforms.length,
          confidence: synthesizedKnowledge.dataQuality.overallConfidence,
          dataQuality: synthesizedKnowledge.dataQuality,
        },
      };
    } catch (error) {
      console.error('❌ Hybrid processing failed:', error);
      throw error;
    }
  }
}

/**
 * Creates a hybrid system instance
 *
 * @returns {HybridSystem} - Hybrid system instance
 */
export function createHybridSystem() {
  return new HybridSystem();
}
