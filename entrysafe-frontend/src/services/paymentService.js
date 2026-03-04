/**
 * Payment Service
 * Handles subscription management
 * Author: Mlungisi Mncube
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Create PayPal subscription
 * @param {string} plan - Plan ID (starter, premium, annual)
 * @param {string} firebaseToken - Firebase JWT token
 * @param {string} returnUrl - URL to return after successful payment
 * @param {string} cancelUrl - URL to return if user cancels
 * @returns {Promise<Object>} Subscription details with approval URL
 */
export async function createSubscription(plan, firebaseToken, returnUrl, cancelUrl) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify({
        plan: plan,
        return_url: returnUrl,
        cancel_url: cancelUrl
      })
    });

    if (response.status === 401) {
      throw new Error('Authentication required. Please login.');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to create subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Create Subscription Error:', error);
    throw error;
  }
}

/**
 * Execute billing agreement after PayPal approval
 * @param {string} token - PayPal agreement token from URL
 * @param {string} firebaseToken - Firebase JWT token
 * @returns {Promise<Object>} Subscription activation result
 */
export async function executeAgreement(token, firebaseToken) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/execute-agreement/${token}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to execute agreement');
    }

    return await response.json();
  } catch (error) {
    console.error('Execute Agreement Error:', error);
    throw error;
  }
}

/**
 * Get current subscription status
 * @param {string} firebaseToken - Firebase JWT token
 * @returns {Promise<Object>} Subscription status
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

/**
 * Cancel active subscription
 * @param {string} firebaseToken - Firebase JWT token
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelSubscription(firebaseToken) {
  try {
    const response = await fetch(`${API_BASE}/api/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    throw error;
  }
}
