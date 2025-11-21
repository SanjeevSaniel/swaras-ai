// src/app/api/chat/route.js - Refactored chat API endpoint
import { NextResponse } from 'next/server';
import { createHybridProcessor, getPersonaName } from '@/services/hybrid-processor';
import { validateChatRequest, ValidationError } from '@/utils/validation';
import { ERROR_TYPES, ERROR_MESSAGES } from '@/constants/config';

// Initialize processor (singleton pattern)
const processor = createHybridProcessor();

/**
 * POST /api/chat - Main chat endpoint
 *
 * @param {Request} req - Next.js request object
 * @returns {Promise<NextResponse>} - Response with AI message
 */
export async function POST(req) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const payload = await req.json();
    const { message, persona, history } = validateChatRequest(payload);

    // Get full persona name
    const personaName = getPersonaName(persona);

    console.log(`🚀 Processing chat for ${personaName}`);
    console.log(`📝 User message: "${message}"`);

    // Process conversation through hybrid system
    const result = await processor.processConversation(
      persona,
      personaName,
      message,
      history,
    );

    const totalTime = Date.now() - startTime;

    console.log(`✅ Response generated in ${totalTime}ms`);
    console.log(`📊 Source: ${result.metadata.source}`);

    // Return successful response
    return NextResponse.json({
      response: result.response,
      persona,
      timestamp: new Date().toISOString(),
      metadata: {
        ...result.metadata,
        totalTime,
        hybridType: 'scraping_plus_gpt',
        socialAPIs: false,
      },
    });
  } catch (error) {
    return handleError(error, startTime);
  }
}

/**
 * GET /api/chat - Health check endpoint
 *
 * @returns {Promise<NextResponse>} - Health status
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Swaras AI Chat API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: {
      webScraping: true,
      gptIntegration: true,
      fallbackSupport: true,
      validation: true,
    },
  });
}

/**
 * Handles errors and returns appropriate response
 *
 * @param {Error} error - Error that occurred
 * @param {number} startTime - Request start time
 * @returns {NextResponse} - Error response
 */
function handleError(error, startTime) {
  const processingTime = Date.now() - startTime;

  console.error('💥 Chat API error:', error);

  // Handle validation errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        message: error.message,
        type: error.type,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Handle known error types
  const errorType = determineErrorType(error);
  const errorMessage = ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

  return NextResponse.json(
    {
      error: 'Chat processing failed',
      message: errorMessage,
      type: errorType,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'system_error',
        processingTime,
      },
    },
    { status: 500 }
  );
}

/**
 * Determines error type from error object
 *
 * @param {Error} error - Error to categorize
 * @returns {string} - Error type constant
 */
function determineErrorType(error) {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_TYPES.NETWORK;
  }

  if (message.includes('timeout')) {
    return ERROR_TYPES.TIMEOUT;
  }

  if (message.includes('rate limit') || error.status === 429) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  if (message.includes('api key') || message.includes('auth')) {
    return ERROR_TYPES.AUTHENTICATION;
  }

  if (message.includes('scraping')) {
    return ERROR_TYPES.SCRAPING;
  }

  return ERROR_TYPES.UNKNOWN;
}
