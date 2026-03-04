/**
 * Pricing AI Service (AI Tender Management)
 * Handles tender analysis and pricing
 * Author: Mlungisi Mncube
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Call Pricing AI endpoint for tender analysis
 * @param {string} prompt - Tender-related query or document content
 * @param {string} firebaseToken - Firebase JWT token
 * @param {number} maxTokens - Maximum tokens for response
 * @param {number} temperature - AI creativity (0.0-1.0)
 * @returns {Promise<Object>} AI response
 */
export async function askPricingAI(prompt, firebaseToken, maxTokens = 500, temperature = 0.7) {
  try {
    const response = await fetch(`${API_BASE}/api/ai/pricing`, {
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
    console.error('Pricing AI Error:', error);
    throw error;
  }
}

/**
 * Analyze tender document
 * @param {string} tenderContent - Full tender document text
 * @param {string} firebaseToken - Firebase JWT token
 * @returns {Promise<Object>} Tender analysis with requirements, risks, pricing
 */
export async function analyzeTender(tenderContent, firebaseToken) {
  const prompt = `Analyze this tender document and extract:
1. Key requirements
2. Compliance requirements (CIDB, BEE, etc)
3. Risk factors
4. Suggested pricing strategy

Tender Document:
${tenderContent}`;

  return await askPricingAI(prompt, firebaseToken, 1000, 0.5);
}
