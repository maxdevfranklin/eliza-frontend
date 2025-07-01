// API Configuration based on environment
const LAUNCH_MODE = process.env.REACT_APP_LAUNCH_MODE || 'DEVELOPMENT_LOCAL';

interface ApiConfig {
  baseUrl: string;
  authBaseUrl: string;
}

const getApiConfig = (): ApiConfig => {
  const authPort = parseInt(process.env.REACT_APP_AUTH_PORT || "3002");
  
  switch (LAUNCH_MODE) {
    case 'PRODUCTION_URL':
    case 'DEVELOPEMENT_URL': // Note: keeping the typo as specified by user
      return {
        baseUrl: 'https://eliza-backend-production-4791.up.railway.app',
        authBaseUrl: 'https://eliza-backend-production-4791.up.railway.app'
      };
    case 'DEVELOPMENT_LOCAL':
    default:
      return {
        baseUrl: 'http://localhost:3000',
        authBaseUrl: `http://localhost:${authPort}`
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