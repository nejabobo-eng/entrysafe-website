import axios from 'axios';
import { auth } from '../lib/firebase';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests that need authentication
api.interceptors.request.use(
  async (config) => {
    // Only add token if user is logged in
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific error codes
      if (error.response.status === 401) {
        console.error('Unauthorized - Please log in again');
      } else if (error.response.status === 403) {
        console.error('Forbidden - Insufficient permissions');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server. Is the backend running?');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC ENDPOINTS (No Authentication)
// ============================================

/**
 * Submit contact form
 * @param {Object} contactData - { name, email, phone?, message }
 * @returns {Promise} Response with message and id
 */
export const submitContactForm = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

/**
 * Health check
 * @returns {Promise} Server health status
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// ============================================
// USER ENDPOINTS (Authentication Required)
// ============================================

/**
 * Get current user profile from backend
 * @returns {Promise} User profile data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Update current user profile
 * @param {Object} updates - Profile fields to update
 * @returns {Promise} Update confirmation
 */
export const updateUserProfile = async (updates) => {
  const response = await api.put('/users/me', updates);
  return response.data;
};

/**
 * Get user statistics
 * @returns {Promise} User stats (documents, downloads, etc.)
 */
export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};

// ============================================
// DOCUMENT ENDPOINTS (Authentication Required)
// ============================================

/**
 * Get user's documents
 * @returns {Promise} Array of documents
 */
export const getUserDocuments = async () => {
  const response = await api.get('/documents/');
  return response.data;
};

/**
 * Upload document metadata
 * @param {Object} documentData - { filename, fileType, fileSize, storagePath }
 * @returns {Promise} Upload confirmation with document ID
 */
export const uploadDocument = async (documentData) => {
  const response = await api.post('/documents/upload', documentData);
  return response.data;
};

/**
 * Get download URL for document
 * @param {string} documentId - Document ID
 * @returns {Promise} Signed download URL
 */
export const getDocumentDownloadUrl = async (documentId) => {
  const response = await api.get(`/documents/${documentId}/download-url`);
  return response.data;
};

/**
 * Delete document
 * @param {string} documentId - Document ID
 * @returns {Promise} Delete confirmation
 */
export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

// ============================================
// ADMIN ENDPOINTS (Admin Role Required)
// ============================================

/**
 * Get all users (admin only)
 * @param {number} skip - Pagination offset
 * @param {number} limit - Max results
 * @returns {Promise} Array of users
 */
export const getAllUsers = async (skip = 0, limit = 50) => {
  const response = await api.get('/admin/users', {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Update user role (admin only)
 * @param {string} uid - User Firebase UID
 * @param {string} role - New role (admin or client)
 * @returns {Promise} Update confirmation
 */
export const updateUserRole = async (uid, role) => {
  const response = await api.put(`/admin/users/${uid}/role`, { role });
  return response.data;
};

/**
 * Delete user (admin only)
 * @param {string} uid - User Firebase UID
 * @returns {Promise} Delete confirmation
 */
export const deleteUser = async (uid) => {
  const response = await api.delete(`/admin/users/${uid}`);
  return response.data;
};

/**
 * Get platform statistics (admin only)
 * @returns {Promise} Platform stats
 */
export const getPlatformStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

/**
 * Get all documents (admin only)
 * @param {number} skip - Pagination offset
 * @param {number} limit - Max results
 * @returns {Promise} Array of all documents
 */
export const getAllDocuments = async (skip = 0, limit = 50) => {
  const response = await api.get('/admin/documents', {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Get all contact submissions (admin only)
 * @param {number} skip - Pagination offset
 * @param {number} limit - Max results
 * @param {string} status - Filter by status (new, contacted, resolved)
 * @returns {Promise} Contact submissions
 */
export const getContactSubmissions = async (skip = 0, limit = 50, status = null) => {
  const params = { skip, limit };
  if (status) params.status = status;
  
  const response = await api.get('/contacts', { params });
  return response.data;
};

/**
 * Update contact status (admin only)
 * @param {string} contactId - Contact ID
 * @param {string} status - New status (new, contacted, resolved)
 * @returns {Promise} Update confirmation
 */
export const updateContactStatus = async (contactId, status) => {
  const response = await api.put(`/contacts/${contactId}/status`, { status });
  return response.data;
};

// Export the axios instance for custom requests
export default api;
