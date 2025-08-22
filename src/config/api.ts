// API Configuration based on environment
const LAUNCH_MODE = process.env.REACT_APP_LAUNCH_MODE || 'DEVELOPEMENT_URL';

interface ApiConfig {
  baseUrl: string;
  authBaseUrl: string;
}

const getApiConfig = (): ApiConfig => {
  switch (LAUNCH_MODE) {
    case 'PRODUCTION_URL':
    case 'DEVELOPEMENT_URL': // Note: keeping the typo as specified by user
      return {
        baseUrl: 'https://eliza-backend-production-4791.up.railway.app',
        authBaseUrl: 'https://eliza-backend-production-4791.up.railway.app'
      };
    case 'DEVELOPMENT_LOCAL':
    default:
      // For local development, both APIs use the same port (3000)
      return {
        baseUrl: 'http://localhost:3000',
        authBaseUrl: 'http://localhost:3000'
      };
  }
};

export const apiConfig = getApiConfig();

// Helper function to get the full URL for message endpoint
export const getMessageUrl = (agentId: string = '01c95267-dd29-02bc-a9ad-d243b05a8d51') => {
  return `${apiConfig.baseUrl}/${agentId}/message`;
};

// Helper function to get auth URLs
export const getAuthUrl = (endpoint: string) => {
  return `${apiConfig.authBaseUrl}/auth/${endpoint}`;
};

// Admin endpoints
export const getAdminUsersUrl = () => `${apiConfig.authBaseUrl}/auth/admin/users`;
export const getAdminChatHistoryUrl = (username: string) => `${apiConfig.authBaseUrl}/auth/admin/chat-history?username=${username}`;

// Agents endpoints simplified: backend defaults to GraceFletcher when name is omitted
export const getAgentByNameUrl = () => `${apiConfig.baseUrl}/agents/by-name`;
export const putAgentByNameUrl = () => `${apiConfig.baseUrl}/agents/by-name`;

export const fetchComprehensiveRecord = async (roomId: string, userId: string, agentId: string) => {
  try {
    const response = await fetch(`${apiConfig.authBaseUrl}/auth/comprehensive-record?roomId=${roomId}&userId=${userId}&agentId=${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comprehensive record:', error);
    throw error;
  }
}; 