const API_BASE = 'http://localhost:5001';

export const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};