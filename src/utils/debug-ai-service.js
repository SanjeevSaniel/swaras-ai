// Debug functions to test your AI Service
// Add these to a new file: src/utils/debug-ai-service.js

import { AIService } from '@/services/ai-service';
import {
  topicClassification,
  levelDetectionPatterns,
  systemPrompts,
  personas,
} from '@/constants/llm-prompts';

// Test 1: Check if constants are loaded properly
export function debugConstants() {
  console.log('=== DEBUGGING CONSTANTS ===');

  console.log('✅ Personas available:', Object.keys(personas));
  console.log('✅ System prompts available:', Object.keys(systemPrompts));

  // Check topic patterns
  if (topicClassification?.patterns) {
    console.log(
      '✅ Topic patterns available:',
      Object.keys(topicClassification.patterns),
    );
    console.log(
      '   React keywords:',
      topicClassification.patterns.react?.slice(0, 5),
    );
    console.log(
      '   Career keywords:',
      topicClassification.patterns.career?.slice(0, 5),
    );
  } else {
    console.error('❌ Topic classification patterns NOT FOUND');
  }

  // Check level patterns
  if (levelDetectionPatterns) {
    console.log('✅ Level patterns available:', {
      beginner: levelDetectionPatterns.beginner ? 'YES' : 'NO',
      intermediate: levelDetectionPatterns.intermediate ? 'YES' : 'NO',
      advanced: levelDetectionPatterns.advanced ? 'YES' : 'NO',
    });
  } else {
    console.error('❌ Level detection patterns NOT FOUND');
  }
}

// Test 2: Test topic classification
export function debugTopicClassification(message) {
  console.log('=== DEBUGGING TOPIC CLASSIFICATION ===');
  console.log('Testing message:', message);

  const result = AIService.classifyTopic(message, true);
  console.log('Classification result:', result);

  // Manual check
  const messageText = message.toLowerCase();
  console.log('Message lowercase:', messageText);

  if (topicClassification?.patterns) {
    console.log('Manual pattern matching:');
    for (const [topic, keywords] of Object.entries(
      topicClassification.patterns,
    )) {
      const matches = keywords.filter((keyword) =>
        messageText.includes(keyword),
      );
      if (matches.length > 0) {
        console.log(`  ${topic}: ${matches.length} matches -`, matches);
      }
    }
  }

  return result;
}

// Test 3: Test level detection
export function debugLevelDetection(message, history = []) {
  console.log('=== DEBUGGING LEVEL DETECTION ===');
  console.log('Testing message:', message);

  const result = AIService.analyzeUserLevel(message, history);
  console.log('Level result:', result);

  // Manual check
  const messageText = message.toLowerCase();
  console.log('Message lowercase:', messageText);

  if (levelDetectionPatterns) {
    console.log('Manual level pattern matching:');

    const beginnerScore =
      levelDetectionPatterns.beginner?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    const advancedScore =
      levelDetectionPatterns.advanced?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    const intermediateScore =
      levelDetectionPatterns.intermediate?.filter((keyword) =>
        messageText.includes(keyword),
      ).length || 0;

    console.log(
      '  Beginner score:',
      beginnerScore,
      levelDetectionPatterns.beginner?.filter((k) => messageText.includes(k)),
    );
    console.log(
      '  Intermediate score:',
      intermediateScore,
      levelDetectionPatterns.intermediate?.filter((k) =>
        messageText.includes(k),
      ),
    );
    console.log(
      '  Advanced score:',
      advancedScore,
      levelDetectionPatterns.advanced?.filter((k) => messageText.includes(k)),
    );
  }

  return result;
}

// Test 4: Test enhanced prompt building
export function debugPromptBuilding(personaId, message) {
  console.log('=== DEBUGGING PROMPT BUILDING ===');
  console.log('Persona:', personaId);
  console.log('Message:', message);

  try {
    const level = AIService.analyzeUserLevel(message);
    const topic = AIService.classifyTopic(message);

    console.log('Detected level:', level);
    console.log('Detected topic:', topic);

    // Check if system prompt exists
    if (!systemPrompts[personaId]) {
      console.error('❌ No system prompt found for persona:', personaId);
      return null;
    }

    console.log('✅ System prompt found for:', personaId);
    console.log(
      'System prompt preview:',
      systemPrompts[personaId].substring(0, 200) + '...',
    );

    const prompt = AIService.buildEnhancedPrompt(
      personaId,
      message,
      level,
      topic,
    );
    console.log('✅ Enhanced prompt built successfully');
    console.log('Enhanced prompt preview:', prompt.substring(0, 300) + '...');

    return prompt;
  } catch (error) {
    console.error('❌ Prompt building failed:', error);
    return null;
  }
}

// Test 5: Test full AI service request (without API call)
export function debugFullAnalysis(message, personaId) {
  console.log('=== DEBUGGING FULL AI SERVICE ANALYSIS ===');

  console.log('1. Constants check...');
  debugConstants();

  console.log('\n2. Topic classification...');
  const topicResult = debugTopicClassification(message);

  console.log('\n3. Level detection...');
  const levelResult = debugLevelDetection(message);

  console.log('\n4. Prompt building...');
  const promptResult = debugPromptBuilding(personaId, message);

  console.log('\n=== SUMMARY ===');
  console.log('Message:', message);
  console.log('Persona:', personaId);
  console.log('Detected Topic:', topicResult);
  console.log('Detected Level:', levelResult);
  console.log('Prompt Built:', promptResult ? 'SUCCESS' : 'FAILED');

  return {
    topic: topicResult,
    level: levelResult,
    promptBuilt: !!promptResult,
    prompt: promptResult,
  };
}

// Usage examples:
export function runAllTests() {
  console.log('🧪 Running all AI Service tests...\n');

  // Test with different messages
  const testMessages = [
    'How do I learn React?',
    "What's the best way to start my programming career?",
    'Explain JavaScript promises and async/await',
    'How to build a MERN stack application?',
    'System design for scalable applications',
  ];

  testMessages.forEach((message, index) => {
    console.log(`\n📝 Test ${index + 1}: "${message}"`);
    debugFullAnalysis(message, 'hitesh');
    console.log('─'.repeat(80));
  });
}

// Quick test function
export function quickTest(
  message = 'How do I learn React?',
  persona = 'hitesh',
) {
  console.log('🚀 Quick Test - AI Service Debug');
  return debugFullAnalysis(message, persona);
}
