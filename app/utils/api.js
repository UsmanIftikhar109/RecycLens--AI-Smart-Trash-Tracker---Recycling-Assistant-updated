import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get the base API URL for the backend
 */
export const getApiBaseUrl = () => {
  // In development, you can use your machine's IP address
  // For production, replace with your actual backend URL
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.18.61:5001';
  return baseUrl;
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
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Get token from storage
  const token = await getToken();
  
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  // Attach JWT if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }
    
    return data;
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
