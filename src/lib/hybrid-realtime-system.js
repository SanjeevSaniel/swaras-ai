// Hybrid Real-Time Information System
// src/lib/hybrid-realtime-system.js

import { OpenAI } from 'openai';
import { load } from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class HybridRealTimeSystem {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
    this.scraperConfig = {
      timeout: 10000,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };
  }

  // Step 1: Real-time web scraping for current information
  async scrapeCurrentWebInfo(personaName) {
    console.log(`🕷️ Scraping real-time web information for ${personaName}...`);

    const scrapingTargets = this.getScrapingTargets(personaName);
    const scrapedData = {};

    for (const target of scrapingTargets) {
      try {
        console.log(`🔍 Scraping ${target.url}...`);
        const data = await this.scrapeWebsite(target.url, target.selectors);

        scrapedData[target.name] = {
          ...data,
          scrapedAt: new Date().toISOString(),
          source: target.url,
          confidence: 0.95, // High confidence for scraped data
        };

        // Add small delay to be respectful
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to scrape ${target.url}:`, error.message);
        scrapedData[target.name] = {
          error: error.message,
          scrapedAt: new Date().toISOString(),
          confidence: 0.0,
        };
      }
    }

    return scrapedData;
  }

  // Define scraping targets based on persona
  getScrapingTargets(personaName) {
    if (personaName.includes('Hitesh')) {
      return [
        {
          name: 'hitesh_personal',
          url: 'https://hitesh.ai',
          selectors: {
            bio: 'meta[name="description"]',
            links: 'a[href*="chaicode"], a[href*="youtube"], a[href*="github"]',
            currentRole: '.hero-title, .bio, .about',
            platforms: '.platform, .link, .social',
          },
        },
        {
          name: 'chaicode_platform',
          url: 'https://chaicode.com',
          selectors: {
            title: 'title',
            description: 'meta[name="description"]',
            courses: '.course, .program, .offering',
            features: '.feature, .benefit',
            pricing: '.price, .cost, .plan',
          },
        },
        {
          name: 'youtube_channel',
          url: 'https://www.youtube.com/@chaiaurcode/about',
          selectors: {
            subscriberCount: '#subscriber-count, .subscriber-count',
            description: '#description, .channel-description',
            recentVideos: '.video-title',
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
            currentRole: '.hero, .about, .bio',
            projects: '.project, .work',
            skills: '.skill, .technology',
          },
        },
        {
          name: 'piyush_youtube',
          url: 'https://www.youtube.com/@PiyushGargDev/about',
          selectors: {
            subscriberCount: '#subscriber-count',
            description: '#description',
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
          'User-Agent': this.scraperConfig.userAgent,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(this.scraperConfig.timeout),
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
              // Single element - get text, href, or content
              const element = elements.first();
              extractedData[key] =
                element.attr('content') ||
                element.attr('href') ||
                element.text().trim();
            } else {
              // Multiple elements - get array
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
      extractedData.lastModified = response.headers.get('last-modified');

      return extractedData;
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  // Step 2: Social media API integration
  async fetchSocialMediaData(personaName) {
    console.log(`📱 Fetching social media data for ${personaName}...`);

    const socialData = {};

    try {
      // YouTube Data API v3 (if API key available)
      if (process.env.YOUTUBE_API_KEY) {
        const youtubeData = await this.fetchYouTubeData(personaName);
        socialData.youtube = youtubeData;
      }

      // GitHub API (public data)
      const githubData = await this.fetchGitHubData(personaName);
      if (githubData) {
        socialData.github = githubData;
      }

      return socialData;
    } catch (error) {
      console.error('❌ Social media data fetch failed:', error);
      return {};
    }
  }

  // YouTube API integration
  async fetchYouTubeData(personaName) {
    if (!process.env.YOUTUBE_API_KEY) {
      return { error: 'YouTube API key not configured' };
    }

    const channelMap = {
      'Hitesh Choudhary': 'chaiaurcode',
      'Piyush Garg': 'PiyushGargDev',
    };

    const channelName = channelMap[personaName];
    if (!channelName) return null;

    try {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forUsername=${channelName}&key=${process.env.YOUTUBE_API_KEY}`,
      );

      if (!channelResponse.ok) {
        throw new Error(`YouTube API error: ${channelResponse.status}`);
      }

      const channelData = await channelResponse.json();

      if (channelData.items && channelData.items.length > 0) {
        const channel = channelData.items[0];
        return {
          subscriberCount: parseInt(channel.statistics.subscriberCount),
          videoCount: parseInt(channel.statistics.videoCount),
          viewCount: parseInt(channel.statistics.viewCount),
          description: channel.snippet.description,
          publishedAt: channel.snippet.publishedAt,
          fetchedAt: new Date().toISOString(),
          confidence: 0.98,
        };
      }

      return { error: 'Channel not found' };
    } catch (error) {
      return { error: error.message };
    }
  }

  // GitHub API integration
  async fetchGitHubData(personaName) {
    const githubMap = {
      'Hitesh Choudhary': 'hiteshchoudhary',
      'Piyush Garg': 'piyushgarg-dev',
    };

    const username = githubMap[personaName];
    if (!username) return null;

    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`,
      );

      if (!userResponse.ok) {
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      return {
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        location: userData.location,
        blog: userData.blog,
        company: userData.company,
        updatedAt: userData.updated_at,
        fetchedAt: new Date().toISOString(),
        confidence: 0.95,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Step 3: Combine GPT knowledge with real-time data
  async combineKnowledgeSources(personaName, userQuery) {
    console.log(`🔄 Combining knowledge sources for ${personaName}...`);

    // Check cache first
    const cacheKey = `hybrid_${personaName}_${
      Date.now() - (Date.now() % this.cacheExpiry)
    }`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      console.log('📦 Using cached hybrid knowledge');
      return cached;
    }

    try {
      // Parallel execution for speed
      const [gptKnowledge, scrapedData, socialData] = await Promise.allSettled([
        this.extractGPTKnowledge(personaName, userQuery),
        this.scrapeCurrentWebInfo(personaName),
        this.fetchSocialMediaData(personaName),
      ]);

      const hybridKnowledge = {
        sources: {
          gpt: {
            data:
              gptKnowledge.status === 'fulfilled' ? gptKnowledge.value : null,
            status: gptKnowledge.status,
            confidence: gptKnowledge.status === 'fulfilled' ? 0.7 : 0.0,
            limitations: 'Training data cutoff, no real-time access',
          },
          scraped: {
            data: scrapedData.status === 'fulfilled' ? scrapedData.value : null,
            status: scrapedData.status,
            confidence: scrapedData.status === 'fulfilled' ? 0.9 : 0.0,
            limitations: 'May fail due to website changes, anti-scraping',
          },
          social: {
            data: socialData.status === 'fulfilled' ? socialData.value : null,
            status: socialData.status,
            confidence: socialData.status === 'fulfilled' ? 0.95 : 0.0,
            limitations: 'Rate limited, requires API keys',
          },
        },
        synthesis: await this.synthesizeInformation(
          gptKnowledge.status === 'fulfilled' ? gptKnowledge.value : null,
          scrapedData.status === 'fulfilled' ? scrapedData.value : null,
          socialData.status === 'fulfilled' ? socialData.value : null,
          personaName,
          userQuery,
        ),
        timestamp: new Date().toISOString(),
        cacheExpiry: Date.now() + this.cacheExpiry,
      };

      // Cache the result
      this.cache.set(cacheKey, hybridKnowledge);

      return hybridKnowledge;
    } catch (error) {
      console.error('❌ Hybrid knowledge combination failed:', error);
      throw error;
    }
  }

  // Extract knowledge from GPT (your existing system)
  async extractGPTKnowledge(personaName, userQuery) {
    const gptPrompt = `Based on your training data, provide comprehensive information about ${personaName}.

USER CONTEXT: "${userQuery}"

Include:
1. Professional background and current role
2. Known platforms and websites
3. Areas of expertise 
4. Teaching/content style
5. Recent projects or focus areas

IMPORTANT: Include confidence levels and admit any uncertainties or potential outdated information.

RESPOND WITH JSON:
{
  "personalInfo": {
    "name": "${personaName}",
    "role": "current role",
    "background": "professional background"
  },
  "knownPlatforms": [
    {
      "name": "platform name",
      "url": "platform url", 
      "type": "platform type",
      "confidence": 0.8,
      "lastKnownStatus": "active/inactive/unknown"
    }
  ],
  "expertise": ["skill areas"],
  "limitations": "what information might be outdated",
  "trainingCutoff": "approximate training data cutoff",
  "confidence": 0.75
}`;

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

  // Synthesize information from all sources
  async synthesizeInformation(
    gptData,
    scrapedData,
    socialData,
    personaName,
    userQuery,
  ) {
    console.log('🧠 Synthesizing information from all sources...');

    const synthesisPrompt = `You are an information synthesis expert. Combine information from multiple sources to create the most accurate, current profile.

PERSONA: ${personaName}
USER QUERY: "${userQuery}"

INFORMATION SOURCES:

GPT KNOWLEDGE (Training data - may be outdated):
${JSON.stringify(gptData, null, 2)}

SCRAPED WEB DATA (Real-time - high currency):
${JSON.stringify(scrapedData, null, 2)}

SOCIAL MEDIA DATA (Real-time - high accuracy):
${JSON.stringify(socialData, null, 2)}

SYNTHESIS TASK:
1. Identify the most current and reliable information
2. Resolve conflicts between sources (prioritize real-time data)
3. Fill gaps using complementary information
4. Flag outdated or conflicting data
5. Create unified, current profile

RESPOND WITH JSON:
{
  "synthesizedProfile": {
    "currentStatus": {
      "name": "${personaName}",
      "primaryRole": "most current role",
      "currentFocus": "current projects/focus",
      "lastUpdated": "source of most recent info"
    },
    "activePlatforms": [
      {
        "name": "platform name",
        "url": "current url",
        "type": "platform type",
        "status": "verified active/inactive",
        "description": "current description",
        "dataSource": "scraped/social/gpt",
        "confidence": 0.95,
        "relevantToQuery": true/false
      }
    ],
    "currentCapabilities": {
      "expertise": ["current skill areas"],
      "offerings": ["current courses/content"],
      "teaching_style": "current approach"
    }
  },
  "dataQuality": {
    "overallConfidence": 0.85,
    "sourcesUsed": ["scraped", "social", "gpt"],
    "conflictsResolved": ["list any conflicts and resolutions"],
    "gapsIdentified": ["information still missing"],
    "currencyLevel": "high/medium/low"
  },
  "recommendations": {
    "platformToRecommend": "best platform for user query",
    "responseStrategy": "how persona should respond",
    "currentOfferings": "what to mention as current"
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
      console.error('❌ Information synthesis failed:', error);

      // Return basic synthesis if AI fails
      return {
        synthesizedProfile: {
          currentStatus: {
            name: personaName,
            primaryRole: 'Educator/Content Creator',
            currentFocus: 'Teaching and content creation',
          },
          activePlatforms: this.extractPlatformsFromSources(
            gptData,
            scrapedData,
            socialData,
          ),
          currentCapabilities: {
            expertise: ['Web Development', 'Teaching'],
            offerings: ['Educational Content'],
          },
        },
        dataQuality: {
          overallConfidence: 0.5,
          sourcesUsed: ['fallback'],
          currencyLevel: 'low',
        },
        recommendations: {
          platformToRecommend: 'Check multiple sources',
          responseStrategy: 'Provide general guidance',
        },
      };
    }
  }

  // Extract platforms from various sources
  extractPlatformsFromSources(gptData, scrapedData, socialData) {
    const platforms = [];

    // From scraped data
    if (scrapedData) {
      Object.entries(scrapedData).forEach(([sourceName, data]) => {
        if (data.source && !data.error) {
          platforms.push({
            name: sourceName,
            url: data.source,
            type: 'website',
            status: 'verified active',
            dataSource: 'scraped',
            confidence: 0.9,
          });
        }
      });
    }

    // From social data
    if (socialData) {
      Object.entries(socialData).forEach(([platform, data]) => {
        if (!data.error) {
          platforms.push({
            name: platform,
            type: 'social media',
            status: 'verified active',
            dataSource: 'social',
            confidence: 0.95,
          });
        }
      });
    }

    // From GPT data
    if (gptData?.knownPlatforms) {
      gptData.knownPlatforms.forEach((platform) => {
        // Only add if not already found in real-time sources
        if (!platforms.find((p) => p.url === platform.url)) {
          platforms.push({
            ...platform,
            dataSource: 'gpt',
            status: 'unverified',
          });
        }
      });
    }

    return platforms;
  }

  // Utility function to parse JSON (same as your existing)
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

  // Main hybrid processing function
  async processHybridKnowledge(
    personaName,
    userQuery,
    conversationHistory = [],
  ) {
    console.log(`🔄 Processing hybrid knowledge for ${personaName}...`);

    try {
      // Get combined knowledge from all sources
      const hybridKnowledge = await this.combineKnowledgeSources(
        personaName,
        userQuery,
      );

      // Generate response using synthesized information
      const response = await this.generateHybridResponse(
        personaName,
        userQuery,
        hybridKnowledge.synthesis,
        conversationHistory,
      );

      return {
        response,
        metadata: {
          source: 'hybrid_realtime',
          hybridKnowledge,
          timestamp: new Date().toISOString(),
          confidence: hybridKnowledge.synthesis.dataQuality.overallConfidence,
          sourcesUsed: hybridKnowledge.synthesis.dataQuality.sourcesUsed,
          currencyLevel: hybridKnowledge.synthesis.dataQuality.currencyLevel,
        },
      };
    } catch (error) {
      console.error('❌ Hybrid processing failed:', error);
      throw error;
    }
  }

  // Generate response using hybrid information
  async generateHybridResponse(
    personaName,
    userQuery,
    synthesizedInfo,
    conversationHistory,
  ) {
    const responsePrompt = `You are ${personaName}. Respond to the user using the most current, accurate information available.

CURRENT SYNTHESIZED INFORMATION ABOUT YOU:
${JSON.stringify(synthesizedInfo, null, 2)}

USER QUERY: "${userQuery}"

CONVERSATION HISTORY:
${conversationHistory
  .slice(-4)
  .map((msg) => `${msg.sender === 'user' ? 'User' : 'You'}: ${msg.content}`)
  .join('\n')}

RESPONSE REQUIREMENTS:
1. Use the most current platform information from the synthesis
2. Mention verified active platforms relevant to the user's query
3. Base recommendations on current offerings
4. Maintain your authentic speaking style
5. Prioritize information with high confidence levels

${this.getPersonaResponseGuidelines(personaName, synthesizedInfo)}

Respond as ${personaName} using your most current information:`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: responsePrompt }],
        temperature: 0.8,
        max_tokens: 700,
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Hybrid response generation failed: ${error.message}`);
    }
  }

  // Get persona-specific response guidelines
  getPersonaResponseGuidelines(personaName, synthesizedInfo) {
    const activePlatforms =
      synthesizedInfo.synthesizedProfile?.activePlatforms || [];
    const primaryPlatform =
      activePlatforms.find((p) => p.relevantToQuery) || activePlatforms[0];

    if (personaName.includes('Hitesh')) {
      return `HITESH AUTHENTIC STYLE:
- Use "Haanji!", "Arre bhai!", "Bilkul!" 
- Natural Hinglish mixing
- Chai/cooking analogies for explanations
- Encouraging tone: "Bilkul kar sakte ho!"

CURRENT PLATFORM PRIORITY:
${
  primaryPlatform
    ? `- Primary: ${primaryPlatform.name} (${primaryPlatform.url})`
    : '- Check synthesized data for current platforms'
}
- Mention as your current active platform
- Describe current offerings available there`;
    } else {
      return `PIYUSH AUTHENTIC STYLE:
- Direct and confident
- Reality checks: "Companies don't care about..."
- Action-oriented: "Just build it"
- Modern tech focus

CURRENT PLATFORM PRIORITY:
${
  primaryPlatform
    ? `- Primary: ${primaryPlatform.name}`
    : '- Use current verified platforms'
}`;
    }
  }
}

export default HybridRealTimeSystem;
