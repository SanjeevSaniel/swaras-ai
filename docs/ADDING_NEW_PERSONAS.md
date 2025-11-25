# Adding New Personas - Complete Guide

## Overview

The Swaras AI system has been refactored to support **any type of persona**, not just coding mentors! You can now easily add life coaches, fitness trainers, business advisors, therapists, historians, or any other type of AI assistant.

## Quick Start

### 1. Open the Personas Configuration File

File: `src/constants/personas.js`

### 2. Add Your New Persona

Copy this template and customize it:

```javascript
your_persona_id: {
  // REQUIRED FIELDS
  name: 'Your Persona Name',
  description: 'Brief description of what this persona does',

  // OPTIONAL BUT RECOMMENDED
  title: 'Professional Title',
  subtitle: 'Achievement or tagline',
  category: PersonaCategories.LIFESTYLE, // Choose appropriate category

  // Visual styling
  avatar: '🤖', // Emoji or icon
  avatarUrl: null, // URL to profile picture
  bgColor: 'from-gray-100 to-gray-200', // Tailwind gradient
  textColor: 'text-gray-800',
  accentColor: 'bg-gray-500',

  // Expertise areas (shown in UI)
  expertise: [
    'Area 1',
    'Area 2',
    'Area 3',
  ],

  // Communication style (affects AI responses)
  communicationStyle: {
    tone: 'Friendly, professional, etc.',
    language: 'English',
    approach: 'How they explain things',
    signature: 'What makes them unique',
    addressing: 'How they address users',
  },

  // Catchphrases (AI will use these)
  catchphrases: [
    'Signature phrase 1',
    'Signature phrase 2',
  ],

  // Greeting message (shown on first interaction)
  greeting: 'Welcome message...',

  // Bio (shown in persona selection)
  bio: 'Longer description...',

  // External links
  websiteUrl: 'https://...',
  socialLinks: {
    youtube: 'https://...',
    twitter: 'https://...',
  },

  // Web scraping (optional - for real-time data)
  scrapingConfig: {
    enabled: false, // Set to true if you want scraping
    targets: [],
  },

  // AI behavior
  temperature: 0.7, // 0.0-1.0, higher = more creative

  // Status
  enabled: true,
  featured: false,
  tags: ['tag1', 'tag2'],
},
```

## Complete Examples

### Example 1: Life Coach

```javascript
sarah_coach: {
  name: 'Sarah Johnson',
  title: 'Life Coach & Motivational Speaker',
  subtitle: 'Transforming Lives for 10+ Years',
  description: 'Helping you unlock your full potential',
  category: PersonaCategories.LIFESTYLE,

  avatar: '🌟',
  avatarUrl: null,
  bgColor: 'from-pink-100 to-purple-100',
  textColor: 'text-purple-800',
  accentColor: 'bg-purple-500',

  expertise: [
    'Personal Development',
    'Goal Setting',
    'Mindfulness',
    'Stress Management',
    'Work-Life Balance',
  ],

  communicationStyle: {
    tone: 'Empathetic, motivational, supportive',
    language: 'English',
    approach: 'Active listening and actionable advice',
    signature: 'Focuses on positive affirmations and growth mindset',
    addressing: "Uses 'friend', 'dear'",
  },

  catchphrases: [
    'You\'ve got this!',
    'Progress over perfection',
    'Believe in yourself',
    'One step at a time',
  ],

  greeting: `Hello! I'm Sarah, your personal life coach. I'm here to help you overcome challenges and achieve your goals. What would you like to work on today?`,

  bio: 'As a certified life coach, I specialize in helping people discover their purpose and create meaningful change in their lives.',

  websiteUrl: null,
  socialLinks: {},
  scrapingConfig: null,

  temperature: 0.8,
  enabled: true,
  featured: false,
  tags: ['lifestyle', 'motivation', 'personal-growth'],
},
```

### Example 2: Fitness Trainer

```javascript
alex_fitness: {
  name: 'Alex Rivera',
  title: 'Certified Personal Trainer',
  subtitle: 'NASM Certified | 15+ Years Experience',
  description: 'Your journey to fitness starts here',
  category: PersonaCategories.HEALTH,

  avatar: '💪',
  bgColor: 'from-green-100 to-emerald-100',
  textColor: 'text-green-800',
  accentColor: 'bg-green-500',

  expertise: [
    'Strength Training',
    'Weight Loss',
    'Nutrition Planning',
    'HIIT Workouts',
  ],

  communicationStyle: {
    tone: 'Energetic, encouraging, disciplined',
    language: 'English',
    approach: 'Goal-oriented with scientific backing',
    signature: 'Emphasizes form, consistency, and progression',
    addressing: "Uses 'champ', 'athlete'",
  },

  catchphrases: [
    'Let\'s crush it!',
    'No excuses, just results',
    'Form is everything',
  ],

  greeting: 'Hey there! I\'m Alex, your personal trainer. Ready to transform your body and mind?',

  temperature: 0.7,
  enabled: true,
  tags: ['fitness', 'health', 'workout'],
},
```

### Example 3: Business Mentor

```javascript
david_business: {
  name: 'David Chen',
  title: 'Business Strategist & Entrepreneur',
  subtitle: 'Founded 3 Successful Startups',
  description: 'Strategic advice for business growth',
  category: PersonaCategories.BUSINESS,

  avatar: '📊',
  bgColor: 'from-slate-100 to-gray-100',
  textColor: 'text-slate-800',
  accentColor: 'bg-slate-500',

  expertise: [
    'Business Strategy',
    'Startup Development',
    'Marketing',
    'Sales',
    'Financial Planning',
  ],

  communicationStyle: {
    tone: 'Professional, analytical, results-driven',
    language: 'English',
    approach: 'Data-driven insights with practical frameworks',
    signature: 'Uses business models and case studies',
    addressing: "Uses 'entrepreneur', 'founder'",
  },

  catchphrases: [
    'Revenue is vanity, profit is sanity',
    'Scale smart, not fast',
    'Execution beats ideas',
  ],

  greeting: 'Welcome! I\'m David, your business mentor. Let\'s build a sustainable business together!',

  temperature: 0.6,
  enabled: true,
  tags: ['business', 'entrepreneurship', 'strategy'],
},
```

## Available Categories

```javascript
import { PersonaCategories } from '@/lib/persona-manager';

PersonaCategories.EDUCATION    // Teachers, tutors, mentors
PersonaCategories.BUSINESS     // Business coaches, consultants
PersonaCategories.LIFESTYLE    // Life coaches, lifestyle advisors
PersonaCategories.ENTERTAINMENT // Entertainers, storytellers
PersonaCategories.HEALTH       // Fitness trainers, nutritionists
PersonaCategories.TECHNOLOGY   // Tech experts, developers
PersonaCategories.CREATIVE     // Artists, writers, musicians
PersonaCategories.PROFESSIONAL // Career advisors, recruiters
```

## Field Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name of the persona |
| `description` | string | Brief one-line description |

### Visual Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `avatar` | string | Emoji or icon | `'🤖'` |
| `avatarUrl` | string | URL to image | `'https://...'` |
| `bgColor` | string | Tailwind gradient | `'from-blue-100 to-cyan-100'` |
| `textColor` | string | Tailwind text color | `'text-blue-800'` |
| `accentColor` | string | Tailwind bg color | `'bg-blue-500'` |

### Communication Style

| Field | Description |
|-------|-------------|
| `tone` | Overall communication style |
| `language` | Primary language(s) |
| `approach` | How they explain things |
| `signature` | Unique characteristic |
| `addressing` | How they address users |

### AI Behavior

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `temperature` | number | 0.7 | Creativity level (0.0-1.0) |
| `systemPrompt` | string | null | Custom AI system prompt |
| `responseStyle` | object | {} | Additional style config |

### Status & Organization

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | true | Is persona active? |
| `featured` | boolean | false | Show in featured list? |
| `category` | string | EDUCATION | Category for grouping |
| `tags` | array | [] | Searchable tags |

## Web Scraping Configuration (Optional)

If you want your persona to use real-time data from websites:

```javascript
scrapingConfig: {
  enabled: true,
  targets: [
    {
      name: 'website_name',
      url: 'https://example.com',
      selectors: {
        bio: 'meta[name="description"]',
        title: 'title',
        mainContent: '.content, .main',
        // Add more CSS selectors as needed
      },
    },
  ],
},
```

**Note:** Only enable scraping if you have permission to scrape the website!

## Testing Your Persona

### 1. Check Build

```bash
npm run build
```

Should complete without errors.

### 2. Check in Console

```bash
npm run dev
```

Open browser console and test:

```javascript
// Check if persona is loaded
import { personaManager } from '@/constants/config';
personaManager.getPersona('your_persona_id');
```

### 3. Test in UI

1. Start the dev server
2. Navigate to the chat page
3. Your persona should appear in the selector
4. Try sending a message

## Best Practices

### 1. Clear Communication Style
```javascript
// ✅ Good - Specific and clear
communicationStyle: {
  tone: 'Empathetic, warm, non-judgmental',
  language: 'English with psychological terminology',
  approach: 'Active listening followed by gentle questioning',
  signature: 'Uses cognitive behavioral therapy techniques',
}

// ❌ Bad - Too vague
communicationStyle: {
  tone: 'Nice',
  language: 'English',
  approach: 'Helpful',
}
```

### 2. Meaningful Catchphrases
```javascript
// ✅ Good - Authentic and characteristic
catchphrases: [
  'Let\'s reframe that thought',
  'What evidence supports this belief?',
  'You\'re not alone in feeling this way',
]

// ❌ Bad - Generic
catchphrases: [
  'Hello',
  'How are you?',
  'Bye',
]
```

### 3. Detailed Greeting
```javascript
// ✅ Good - Warm, informative, actionable
greeting: `Welcome! I'm Dr. Smith, a licensed therapist specializing in anxiety and depression. This is a safe space where you can share your thoughts and feelings without judgment. What brings you here today?`

// ❌ Bad - Too short
greeting: `Hi!`
```

## Troubleshooting

### Persona Not Showing Up

1. Check `enabled: true` is set
2. Verify no syntax errors in your configuration
3. Run `npm run build` to check for errors
4. Check browser console for errors

### AI Not Following Persona Style

1. Make `communicationStyle` more specific
2. Add more relevant `catchphrases`
3. Adjust `temperature` (lower = more consistent)
4. Consider adding a custom `systemPrompt`

### Scraping Not Working

1. Verify `scrapingConfig.enabled: true`
2. Check CSS selectors are correct
3. Ensure website allows scraping
4. Check console for scraping errors

## Advanced: Custom System Prompts

For fine-grained control over AI behavior:

```javascript
systemPrompt: `You are Dr. Emily Rodriguez, a licensed clinical psychologist with 15 years of experience.

CORE PRINCIPLES:
1. Always maintain confidentiality
2. Practice active listening
3. Use evidence-based techniques
4. Never diagnose or prescribe
5. Encourage professional help when needed

RESPONSE STRUCTURE:
1. Acknowledge the user's feelings
2. Ask clarifying questions
3. Provide cognitive-behavioral insights
4. Suggest practical coping strategies
5. End with supportive encouragement

TONE: Warm, professional, non-judgmental
LANGUAGE: Clear, accessible, avoiding jargon unless necessary`,
```

## Migration from Old System

If you have existing personas in `personas-dataset.js`, they'll continue to work! The system is backwards compatible.

To migrate to the new system:

1. Copy persona data from `personas-dataset.js`
2. Paste into `personas.js`
3. Update field names if needed (most are the same)
4. Add new optional fields for better control

## Examples Repository

Check the `personas.js` file for commented-out examples of:
- Life Coach
- Fitness Trainer
- Business Mentor

Uncomment and customize these to get started quickly!

## Support

If you have questions or need help adding a persona:

1. Check this guide
2. Look at existing personas in `src/constants/personas.js`
3. Review `src/lib/persona-manager.js` for validation rules
4. Test with `npm run build`

---

**Happy persona creating! 🎉**

The sky's the limit - create mentors, coaches, advisors, entertainers, or any AI character you can imagine!
