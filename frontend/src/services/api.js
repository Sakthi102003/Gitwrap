const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetch GitHub Wrapped data for a user
 */
export async function fetchWrappedData(username, year = new Date().getFullYear()) {
  try {
    const response = await fetch(`${API_URL}/api/wrapped/${username}?year=${year}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch wrapped data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching wrapped data:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/api/wrapped/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
}
