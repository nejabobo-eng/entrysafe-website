/**
 * Docs AI Service
 * Handles document AI operations
 * Author: Mlungisi Mncube
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Call Docs AI endpoint for document analysis
 * @param {string} prompt - Document-related query
 * @param {string} firebaseToken - Firebase JWT token
 * @param {number} maxTokens - Maximum tokens for response
 * @param {number} temperature - AI creativity (0.0-1.0)
 * @returns {Promise<Object>} AI response
 */
export async function askDocsAI(prompt, firebaseToken, maxTokens = 500, temperature = 0.7) {
  try {
    const response = await fetch(`${API_BASE}/api/ai/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    if (response.status === 401) {
      throw new Error('Authentication required. Please login again.');
    }

    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.detail || 'AI usage limit exceeded. Please upgrade your plan.');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'AI request failed');
    }

    const data = await response.json();
    return {
      result: data.result,
      tokensUsed: data.tokens_used
    };

  } catch (error) {
    console.error('Docs AI Error:', error);
    throw error;
  }
}
