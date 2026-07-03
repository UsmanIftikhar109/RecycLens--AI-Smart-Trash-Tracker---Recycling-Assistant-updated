import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_PORT = 5001;

const normalizeBaseUrl = (value) => value.replace(/\/$/, '');

const getCandidateBaseUrls = () => {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const candidates = [];

  if (configuredBaseUrl) {
    candidates.push(normalizeBaseUrl(configuredBaseUrl));
  }

  if (Platform.OS === 'android') {
    candidates.push(`http://10.0.2.2:${API_PORT}`);
  }

  candidates.push(`http://localhost:${API_PORT}`);
  candidates.push(`http://127.0.0.1:${API_PORT}`);

  return [...new Set(candidates)];
};

/**
 * Get the base API URL for the backend
 */
export const getApiBaseUrl = () => {
  return getCandidateBaseUrls()[0];
};

/**
 * Retrieve JWT token from AsyncStorage
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Store JWT token in AsyncStorage
 */
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Remove JWT token from AsyncStorage
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Generic API request wrapper that auto-attaches JWT token
 * @param {string} endpoint - API endpoint (e.g., '/api/profile', '/api/scans')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<object>} - Parsed JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastError = null;

  try {
    for (const baseUrl of getCandidateBaseUrls()) {
      const url = `${baseUrl}${endpoint}`;

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
          ? await response.json()
          : { message: await response.text() };

        if (!response.ok) {
          const errorMessage = data.error || data.message || `API Error: ${response.status}`;
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        lastError = error;

        const isNetworkError =
          error instanceof TypeError ||
          /Network request failed|fetch/i.test(error.message || '');

        if (!isNetworkError) {
          throw error;
        }
      }
    }

    throw new Error(
      `Unable to reach the backend. Set EXPO_PUBLIC_API_BASE_URL to the correct server URL. Last error: ${lastError?.message || 'Unknown network error'}`
    );
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Helper for GET requests
 */
export const apiGet = (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Helper for POST requests
 */
export const apiPost = (endpoint, body) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Helper for PUT requests
 */
export const apiPut = (endpoint, body) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * Helper for DELETE requests
 */
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};
