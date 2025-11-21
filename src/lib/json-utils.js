// src/lib/json-utils.js - JSON parsing utilities

/**
 * Extracts and parses JSON from various text formats
 * Handles code blocks, backticks, and raw JSON
 *
 * @param {string} text - Text containing JSON
 * @returns {Object} - Parsed JSON object
 * @throws {Error} - If JSON cannot be extracted or parsed
 */
export function extractAndParseJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string');
  }

  // Strategy 1: Try direct parsing
  try {
    return JSON.parse(text);
  } catch (directParseError) {
    // Continue to other strategies
  }

  // Strategy 2: Try various extraction patterns
  const jsonPatterns = [
    /```json\s*([\s\S]*?)\s*```/g,  // ```json ... ```
    /```\s*([\s\S]*?)\s*```/g,       // ``` ... ```
    /`{[\s\S]*?}`/g,                 // `{ ... }`
    /{[\s\S]*}/g,                    // { ... }
  ];

  for (const pattern of jsonPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        try {
          const cleanedJson = cleanJSONText(match);
          return JSON.parse(cleanedJson);
        } catch (parseError) {
          // Try next match
          continue;
        }
      }
    }
  }

  // If all strategies fail, throw error
  throw new Error(
    `JSON parsing failed. Text preview: ${text.substring(0, 200)}...`
  );
}

/**
 * Cleans JSON text by removing code block markers and extra characters
 *
 * @param {string} text - Raw text to clean
 * @returns {string} - Cleaned text
 */
export function cleanJSONText(text) {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^`+|`+$/g, '') // Remove leading/trailing backticks
    .trim();
}

/**
 * Safely parses JSON with fallback value
 *
 * @param {string} text - Text to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {Object|*} - Parsed JSON or fallback
 */
export function safeParseJSON(text, fallback = null) {
  try {
    return extractAndParseJSON(text);
  } catch (error) {
    console.warn('JSON parsing failed, using fallback:', error.message);
    return fallback;
  }
}

/**
 * Validates if a string contains valid JSON
 *
 * @param {string} text - Text to validate
 * @returns {boolean} - True if valid JSON can be extracted
 */
export function isValidJSON(text) {
  try {
    extractAndParseJSON(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts JSON array from text
 *
 * @param {string} text - Text containing JSON array
 * @returns {Array} - Parsed array
 * @throws {Error} - If array cannot be extracted
 */
export function extractJSONArray(text) {
  const result = extractAndParseJSON(text);
  if (!Array.isArray(result)) {
    throw new Error('Extracted JSON is not an array');
  }
  return result;
}

/**
 * Extracts JSON object from text
 *
 * @param {string} text - Text containing JSON object
 * @returns {Object} - Parsed object
 * @throws {Error} - If object cannot be extracted
 */
export function extractJSONObject(text) {
  const result = extractAndParseJSON(text);
  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new Error('Extracted JSON is not an object');
  }
  return result;
}
