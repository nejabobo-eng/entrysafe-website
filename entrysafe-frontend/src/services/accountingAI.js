/**
 * Accounting AI Service
 * Handles communication with Entry Safe Backend API
 * Author: Mlungisi Mncube
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Call Accounting AI endpoint
 * @param {string} prompt - User's question or command
 * @param {string} firebaseToken - Firebase JWT token
 * @param {number} maxTokens - Maximum tokens for response (default 500)
 * @param {number} temperature - AI creativity (0.0-1.0, default 0.7)
 * @returns {Promise<Object>} AI response with result and tokens_used
 */
export async function askAccountingAI(prompt, firebaseToken, maxTokens = 500, temperature = 0.7) {
  try {
    const response = await fetch(`${API_BASE}/api/ai/accounting`, {
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

    // Handle different error types
    if (response.status === 401) {
      throw new Error('Authentication required. Please login again.');
    }

    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.detail || 'AI usage limit exceeded. Please upgrade your plan.');
    }

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
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
    console.error('Accounting AI Error:', error);
    throw error;
  }
}

/**
 * Get user's current subscription status
 * @param {string} firebaseToken - Firebase JWT token
 * @returns {Promise<Object>} Subscription details (tier, status, etc)
 */
export async function getSubscriptionStatus(firebaseToken) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/subscription-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Subscription Status Error:', error);
    throw error;
  }
}
