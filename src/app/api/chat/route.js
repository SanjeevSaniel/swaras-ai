// src/app/api/chat/route.js - Hybrid System without Social APIs
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { load } from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simplified Hybrid System - Web Scraping + GPT Only
class SimpleHybridSystem {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  // Web scraping for current platform information
  async scrapeCurrentPlatformInfo(personaName) {
    console.log(`🕷️ Scraping platform information for ${personaName}...`);

    const scrapingTargets = this.getScrapingTargets(personaName);
    const scrapedData = {};

    for (const target of scrapingTargets) {
      try {
        console.log(`🔍 Scraping ${target.url}...`);
        const data = await this.scrapeWebsite(target.url, target.selectors);

        scrapedData[target.name] = {
          ...data,
          url: target.url,
          scrapedAt: new Date().toISOString(),
          confidence: 0.95,
          status: 'active',
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to scrape ${target.url}:`, error.message);
        scrapedData[target.name] = {
          error: error.message,
          url: target.url,
          confidence: 0.0,
          status: 'failed',
        };
      }
    }

    return scrapedData;
  }

  // Define scraping targets (no social APIs needed)
  getScrapingTargets(personaName) {
    if (personaName.includes('Hitesh')) {
      return [
        {
          name: 'hitesh_personal',
          url: 'https://hitesh.ai',
          selectors: {
            bio: 'meta[name="description"]',
            title: 'title',
            mainHeading: 'h1, .hero-title, .main-title',
            description: '.bio, .about, .description',
            links: 'a[href*="chaicode"], a[href*="youtube"], a[href*="github"]',
            currentProjects: '.project, .current, .latest',
          },
        },
        {
          name: 'chaicode_platform',
          url: 'https://chaicode.com',
          selectors: {
            title: 'title',
            description: 'meta[name="description"]',
            mainHeading: 'h1, .hero-title',
            courses: '.course, .program, .offering, .course-card',
            features: '.feature, .benefit, .service',
            navigation: '.nav, .menu, .header-links',
          },
        },
        {
          name: 'chaicode_courses',
          url: 'https://courses.chaicode.com',
          selectors: {
            courseList: '.course-card, .course-item, .program',
            courseLinks: 'a[href*="course"], a[href*="learn"]',
            pricing: '.price, .cost',
            features: '.feature, .benefit',
          },
        },
      ];
    } else if (personaName.includes('Piyush')) {
      return [
        {
          name: 'piyush_personal',
          url: 'https://piyushgarg.dev',
          selectors: {
            bio: 'meta[name="description"]',
            title: 'title',
            about: '.about, .bio, .description',
            projects: '.project, .work, .portfolio',
            skills: '.skill, .technology, .expertise',
          },
        },
      ];
    }

    return [];
  }

  // Web scraping implementation
  async scrapeWebsite(url, selectors) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = load(html);

      const extractedData = {};

      // Extract data based on selectors
      Object.entries(selectors).forEach(([key, selector]) => {
        try {
          const elements = $(selector);

          if (elements.length > 0) {
            if (elements.length === 1) {
              const element = elements.first();
              extractedData[key] =
                element.attr('content') ||
                element.attr('href') ||
                element.text().trim();
            } else {
              extractedData[key] = elements
                .map((i, el) => {
                  const elem = $(el);
                  return (
                    elem.attr('content') ||
                    elem.attr('href') ||
                    elem.text().trim()
                  );
                })
                .get()
                .filter((text) => text && text.length > 0);
            }
          }
        } catch (selectorError) {
          console.warn(`Selector error for ${key}:`, selectorError.message);
        }
      });

      // Extract additional metadata
      extractedData.pageTitle = $('title').text().trim();
      extractedData.metaDescription = $('meta[name="description"]').attr(
        'content',
      );
      extractedData.isActive = true; // Website is responding

      return extractedData;
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  // Extract GPT knowledge (enhanced for better accuracy)
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

CRITICAL: Be honest about confidence levels and potential outdated information.

Target person: ${personaName}
Query context: "${userQuery}"`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: gptPrompt }],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const responseText = response.choices[0].message.content.trim();
      return this.extractAndParseJSON(responseText);
    } catch (error) {
      throw new Error(`GPT knowledge extraction failed: ${error.message}`);
    }
  }

  // Synthesize scraped data with GPT knowledge
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
        "relevantToQuery": true/false,
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
    "scrapingSuccess": true/false,
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
        model: 'gpt-4o',
        messages: [{ role: 'user', content: synthesisPrompt }],
        temperature: 0.1,
        max_tokens: 1200,
      });

      const responseText = response.choices[0].message.content.trim();
      return this.extractAndParseJSON(responseText);
    } catch (error) {
      console.error('❌ Knowledge synthesis failed:', error);

      // Return basic synthesis if AI fails
      return this.createBasicSynthesis(scrapedData, gptData, personaName);
    }
  }

  // Basic synthesis fallback
  createBasicSynthesis(scrapedData, gptData, personaName) {
    const activePlatforms = [];

    // Extract platforms from scraped data
    Object.entries(scrapedData).forEach(([source, data]) => {
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
        primaryRole:
          gptData?.personalInfo?.primaryRole || 'Educator/Content Creator',
        activePlatforms,
        capabilities: {
          expertise: gptData?.expertise || ['Web Development', 'Teaching'],
          communicationStyle: gptData?.communicationStyle || {},
        },
      },
      dataQuality: {
        overallConfidence: 0.7,
        scrapingSuccess: Object.values(scrapedData).some((d) => !d.error),
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

  // Generate response using synthesized knowledge
  async generateResponseWithKnowledge(
    personaName,
    userQuery,
    synthesizedKnowledge,
    conversationHistory,
  ) {
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

${this.getPersonaGuidelines(personaName, synthesizedKnowledge)}

Respond as ${personaName} using your current information:`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: responsePrompt }],
        temperature: 0.8,
        max_tokens: 700,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Response generation failed: ${error.message}`);
    }
  }

  // Get persona-specific guidelines
  getPersonaGuidelines(personaName, synthesizedKnowledge) {
    const style =
      synthesizedKnowledge.currentProfile?.capabilities?.communicationStyle ||
      {};
    const platforms =
      synthesizedKnowledge.currentProfile?.activePlatforms || [];
    const primaryPlatform =
      platforms.find((p) => p.relevantToQuery) || platforms[0];

    if (personaName.includes('Hitesh')) {
      return `HITESH AUTHENTIC STYLE:
- Use "Haanji!", "Arre bhai!", "Bilkul!"
- Natural Hinglish mixing: "chaliye", "dekho", "samjho"
- Chai/cooking analogies for explanations
- Encouraging tone: "Bilkul kar sakte ho!"
- Teaching approach: step-by-step guidance

CURRENT PLATFORM TO MENTION:
${
  primaryPlatform
    ? `- ${primaryPlatform.name}: ${primaryPlatform.url}`
    : '- Use available platforms from knowledge'
}
- Describe as your current active platform
- Reference current offerings and courses`;
    } else {
      return `PIYUSH AUTHENTIC STYLE:
- Direct and confident tone
- "Trust me, I'm a software engineer"
- Reality checks about industry
- Action-oriented: "Just build it"
- Production-focused advice

CURRENT PLATFORM TO MENTION:
${
  primaryPlatform
    ? `- ${primaryPlatform.name}: ${primaryPlatform.url}`
    : '- Use available platforms'
}`;
    }
  }

  // Main processing function
  async processSimpleHybrid(personaName, userQuery, conversationHistory = []) {
    console.log(
      `🔄 Processing simple hybrid (no social APIs) for ${personaName}...`,
    );

    try {
      // Run scraping and GPT extraction in parallel
      const [scrapedData, gptData] = await Promise.allSettled([
        this.scrapeCurrentPlatformInfo(personaName),
        this.extractGPTKnowledge(personaName, userQuery),
      ]);

      const scrapingResult =
        scrapedData.status === 'fulfilled' ? scrapedData.value : {};
      const gptResult = gptData.status === 'fulfilled' ? gptData.value : null;

      console.log('📊 Data collection results:');
      console.log(
        `   Scraping: ${scrapedData.status} (${
          Object.keys(scrapingResult).length
        } sources)`,
      );
      console.log(`   GPT: ${gptData.status}`);

      // Synthesize the knowledge
      const synthesizedKnowledge = await this.synthesizeKnowledge(
        scrapingResult,
        gptResult,
        personaName,
        userQuery,
      );

      // Generate response
      const response = await this.generateResponseWithKnowledge(
        personaName,
        userQuery,
        synthesizedKnowledge,
        conversationHistory,
      );

      return {
        response,
        metadata: {
          source: 'simple_hybrid_no_social',
          scrapingSuccess: scrapedData.status === 'fulfilled',
          gptSuccess: gptData.status === 'fulfilled',
          platformsFound:
            synthesizedKnowledge.currentProfile.activePlatforms.length,
          confidence: synthesizedKnowledge.dataQuality.overallConfidence,
          dataQuality: synthesizedKnowledge.dataQuality,
        },
      };
    } catch (error) {
      console.error('❌ Simple hybrid processing failed:', error);
      throw error;
    }
  }

  // JSON parsing utility
  extractAndParseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (directParseError) {
      const jsonPatterns = [
        /```json\s*([\s\S]*?)\s*```/g,
        /```\s*([\s\S]*?)\s*```/g,
        /`{[\s\S]*?}`/g,
        /{[\s\S]*}/g,
      ];

      for (const pattern of jsonPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          for (const match of matches) {
            try {
              let cleanedJson = match
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .replace(/`/g, '')
                .trim();

              return JSON.parse(cleanedJson);
            } catch (parseError) {
              continue;
            }
          }
        }
      }

      throw new Error(
        `JSON parsing failed. Text: ${text.substring(0, 200)}...`,
      );
    }
  }
}

// Simple hybrid processor
class SimpleHybridProcessor {
  constructor() {
    this.hybridSystem = new SimpleHybridSystem();
    this.timeouts = {
      quick: 10000, // 10 seconds
      detailed: 20000, // 20 seconds
    };
  }

  async processConversation(
    personaName,
    userMessage,
    conversationHistory = [],
  ) {
    const startTime = Date.now();

    try {
      // Determine timeout based on query complexity
      const isComplexQuery =
        userMessage.length > 50 ||
        userMessage.toLowerCase().includes('course') ||
        userMessage.toLowerCase().includes('platform');

      const timeout = isComplexQuery
        ? this.timeouts.detailed
        : this.timeouts.quick;

      // Process with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Processing timeout')), timeout);
      });

      const processingPromise = this.hybridSystem.processSimpleHybrid(
        personaName,
        userMessage,
        conversationHistory,
      );

      const result = await Promise.race([processingPromise, timeoutPromise]);
      const processingTime = Date.now() - startTime;

      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime,
          timeout: timeout,
          systemType: 'simple_hybrid_no_social',
        },
      };
    } catch (error) {
      return await this.handleFailure(
        error,
        personaName,
        userMessage,
        Date.now() - startTime,
      );
    }
  }

  async handleFailure(error, personaName, userMessage, processingTime) {
    console.error(
      '⚠️ Simple hybrid failed, using GPT-only fallback:',
      error.message,
    );

    try {
      const fallbackPrompt = `You are ${personaName}. Respond authentically to: "${userMessage}"

${
  personaName.includes('Hitesh')
    ? 'Use Hinglish style with "Haanji!", chai analogies, and encouraging tone. Mention your platforms like ChaiCode.com if relevant.'
    : 'Use direct, confident tone with practical advice. Reference your experience as a software engineer.'
}

Respond naturally:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: fallbackPrompt }],
        temperature: 0.8,
        max_tokens: 500,
      });

      return {
        response: response.choices[0].message.content,
        metadata: {
          source: 'gpt_only_fallback',
          originalError: error.message,
          processingTime,
          confidence: 0.6,
        },
      };
    } catch (fallbackError) {
      return {
        response: this.getEmergencyResponse(personaName),
        metadata: {
          source: 'emergency_fallback',
          errors: [error.message, fallbackError.message],
          processingTime,
        },
      };
    }
  }

  getEmergencyResponse(personaName) {
    if (personaName.includes('Hitesh')) {
      return 'Haanji bhai! Thoda technical issue aa raha hai, but main tumhara question samjha. Programming journey mein patience zaroori hai. Keep learning aur practice karte raho!';
    } else {
      return "Hey! System's having some issues right now, but I got your question. Keep building real projects - that's what matters in this industry!";
    }
  }
}

// Persona mapping
const personaNames = {
  hitesh: 'Hitesh Choudhary',
  piyush: 'Piyush Garg',
};

// Initialize processor
const processor = new SimpleHybridProcessor();

// Main API route
export async function POST(req) {
  const startTime = Date.now();

  try {
    const { message, persona, history = [] } = await req.json();

    if (!message || !persona || !personaNames[persona]) {
      return NextResponse.json(
        { error: 'Valid message and persona required' },
        { status: 400 },
      );
    }

    const personaName = personaNames[persona];

    console.log(`🚀 Processing simple hybrid chat for ${personaName}`);
    console.log(`📝 User message: "${message}"`);

    const result = await processor.processConversation(
      personaName,
      message,
      history,
    );
    const totalTime = Date.now() - startTime;

    console.log(`✅ Response generated in ${totalTime}ms`);
    console.log(`📊 Source: ${result.metadata.source}`);

    return NextResponse.json({
      response: result.response,
      persona,
      timestamp: new Date().toISOString(),
      metadata: {
        ...result.metadata,
        totalTime,
        hybridType: 'scraping_plus_gpt_only',
        socialAPIs: false,
      },
    });
  } catch (error) {
    console.error('💥 Simple hybrid system failed:', error);

    return NextResponse.json(
      {
        error: 'Chat processing failed',
        details: error.message,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'system_error',
          processingTime: Date.now() - startTime,
        },
      },
      { status: 500 },
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'Simple Hybrid Chat System Online',
    timestamp: new Date().toISOString(),
    features: [
      '✅ Real-time web scraping',
      '✅ GPT knowledge integration',
      '✅ Information synthesis',
      '✅ No social APIs required',
      '✅ Intelligent fallbacks',
    ],
    requirements: [
      'OpenAI API key only',
      'No YouTube API needed',
      'No GitHub token needed',
      'Web scraping capability built-in',
    ],
  });
}
