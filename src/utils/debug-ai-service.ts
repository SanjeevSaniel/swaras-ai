// Debug functions to test your AI Service
// Add these to a new file: src/utils/debug-ai-service.js

import { AIService } from '@/services/ai-service';
import {
  topicClassification,
  levelDetectionPatterns,
  systemPrompts,
} from '@/constants/llm-prompts';

// Test 1: Check if constants are loaded properly
export function debugConstants() {
  console.log('=== DEBUGGING CONSTANTS ===');

  console.log('✅ Personas available:', Object.keys(systemPrompts));
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
export function debugTopicClassification(message: string) {
  console.log('=== DEBUGGING TOPIC CLASSIFICATION ===');
  console.log('Testing message:', message);

  // Note: classifyTopic method is not currently implemented in AIService
  // const result = (AIService as any).classifyTopic?.(message, true);
  // console.log('Classification result:', result);
  console.log('Note: classifyTopic method needs to be implemented in AIService');

  // Manual check
  const messageText = message.toLowerCase();
  console.log('Message lowercase:', messageText);

  if (topicClassification?.patterns) {
    console.log('Manual pattern matching:');
    for (const [topic, keywords] of Object.entries(
      topicClassification.patterns,
    )) {
      const matches = (keywords as string[]).filter((keyword: string) =>
        messageText.includes(keyword),
      );
      if (matches.length > 0) {
        console.log(`  ${topic}: ${matches.length} matches -`, matches);
      }
    }
  }

  return null;
}

// Test 3: Test level detection
export function debugLevelDetection(message: string, history: any[] = []) {
  console.log('=== DEBUGGING LEVEL DETECTION ===');
  console.log('Testing message:', message);

  // Note: analyzeUserLevel method is not currently implemented in AIService
  // const result = (AIService as any).analyzeUserLevel?.(message, history);
  // console.log('Level result:', result);
  console.log('Note: analyzeUserLevel method needs to be implemented in AIService');

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

  return null;
}

// Test 4: Test enhanced prompt building
export function debugPromptBuilding(personaId: string, message: string) {
  console.log('=== DEBUGGING PROMPT BUILDING ===');
  console.log('Persona:', personaId);
  console.log('Message:', message);

  try {
    // Note: These methods are not currently implemented in AIService
    // const level = (AIService as any).analyzeUserLevel?.(message);
    // const topic = (AIService as any).classifyTopic?.(message);
    console.log('Note: analyzeUserLevel and classifyTopic methods need to be implemented');

    // console.log('Detected level:', level);
    // console.log('Detected topic:', topic);

    // Check if system prompt exists
    if (!(systemPrompts as any)[personaId]) {
      console.error('❌ No system prompt found for persona:', personaId);
      return null;
    }

    console.log('✅ System prompt found for:', personaId);
    console.log(
      'System prompt preview:',
      (systemPrompts as any)[personaId].substring(0, 200) + '...',
    );

    // Note: buildEnhancedPrompt method is not currently implemented in AIService
    // const prompt = (AIService as any).buildEnhancedPrompt?.(
    //   personaId,
    //   message,
    //   level,
    //   topic,
    // );
    // console.log('✅ Enhanced prompt built successfully');
    // console.log('Enhanced prompt preview:', prompt.substring(0, 300) + '...');
    console.log('Note: buildEnhancedPrompt method needs to be implemented in AIService');

    return null;
  } catch (error: any) {
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
