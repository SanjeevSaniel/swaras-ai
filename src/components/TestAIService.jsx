// src/components/TestAIService.jsx
// Add this component to test AI Service locally

import React, { useState } from 'react';
import {
  debugConstants,
  debugFullAnalysis,
  runAllTests,
} from '@/utils/debug-ai-service';

export default function TestAIService() {
  const [testMessage, setTestMessage] = useState('How do I learn React?');
  const [testPersona, setTestPersona] = useState('hitesh');
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);

  // Capture console logs
  const originalConsoleLog = console.log;
  const captureConsoleLogs = () => {
    const capturedLogs = [];
    console.log = (...args) => {
      capturedLogs.push(args.join(' '));
      originalConsoleLog(...args);
    };
    return () => {
      console.log = originalConsoleLog;
      setLogs(capturedLogs);
    };
  };

  const runTest = () => {
    const restoreConsole = captureConsoleLogs();

    try {
      const result = debugFullAnalysis(testMessage, testPersona);
      setResults(result);
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      restoreConsole();
    }
  };

  const runAllTestsHandler = () => {
    const restoreConsole = captureConsoleLogs();

    try {
      runAllTests();
      setResults({
        message: 'All tests completed - check console for details',
      });
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      restoreConsole();
    }
  };

  const testConstants = () => {
    const restoreConsole = captureConsoleLogs();

    try {
      debugConstants();
      setResults({ message: 'Constants checked - see console for details' });
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      restoreConsole();
    }
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>
          AI Service Debug Tool
        </h1>

        {/* Test Controls */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Test Configuration</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Test Message
              </label>
              <input
                type='text'
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                placeholder='Enter test message...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Persona
              </label>
              <select
                value={testPersona}
                onChange={(e) => setTestPersona(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'>
                <option value='hitesh'>Hitesh Choudhary</option>
                <option value='piyush'>Piyush Garg</option>
              </select>
            </div>
          </div>

          <div className='flex flex-wrap gap-3'>
            <button
              onClick={runTest}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
              🧪 Run Single Test
            </button>

            <button
              onClick={runAllTestsHandler}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'>
              🚀 Run All Tests
            </button>

            <button
              onClick={testConstants}
              className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'>
              🔍 Check Constants
            </button>

            <button
              onClick={() => {
                setResults(null);
                setLogs([]);
              }}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'>
              🗑️ Clear Results
            </button>
          </div>
        </div>

        {/* Quick Test Messages */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Quick Test Messages</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {[
              'How do I learn React?',
              "What's the best way to start my programming career?",
              'Explain JavaScript promises and async/await',
              'How to build a MERN stack application?',
              'System design for scalable applications',
              'TypeScript vs JavaScript differences',
              'Best practices for Node.js backend',
              'How to optimize React performance?',
            ].map((msg, index) => (
              <button
                key={index}
                onClick={() => setTestMessage(msg)}
                className='p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors'>
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Test Results</h2>
            <pre className='bg-gray-50 p-4 rounded-md overflow-auto text-sm'>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        {/* Console Logs */}
        {logs.length > 0 && (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Console Output</h2>
            <div className='bg-black text-green-400 p-4 rounded-md overflow-auto text-sm font-mono max-h-96'>
              {logs.map((log, index) => (
                <div
                  key={index}
                  className='mb-1'>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className='bg-blue-50 border border-blue-200 p-6 rounded-lg mt-6'>
          <h2 className='text-xl font-semibold mb-4 text-blue-800'>
            How to Use This Tool
          </h2>
          <ol className='list-decimal list-inside space-y-2 text-blue-700'>
            <li>
              <strong>Check Constants First:</strong> Click "Check Constants" to
              verify all your data is loaded correctly
            </li>
            <li>
              <strong>Run Single Test:</strong> Test specific messages to see
              topic/level detection
            </li>
            <li>
              <strong>Run All Tests:</strong> Run comprehensive tests with
              multiple message types
            </li>
            <li>
              <strong>Check Console:</strong> Open browser dev tools to see
              detailed debug information
            </li>
            <li>
              <strong>Verify Results:</strong> Look for topic classification,
              level detection, and prompt building
            </li>
          </ol>

          <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded'>
            <h3 className='font-semibold text-yellow-800 mb-2'>
              Common Issues to Check:
            </h3>
            <ul className='list-disc list-inside space-y-1 text-yellow-700 text-sm'>
              <li>Are topic patterns loading correctly?</li>
              <li>Are level detection patterns working?</li>
              <li>Are system prompts available for your personas?</li>
              <li>Is the enhanced prompt being built properly?</li>
              <li>Are the topic keywords matching your test messages?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
