// API Configuration for different environments
const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (process.env.NODE_ENV === 'production') {
    // Use Railway backend URL in production
    return process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.railway.app';
  }
  
  // Use localhost in development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ME: `${API_BASE_URL}/api/auth/me`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    GITHUB: `${API_BASE_URL}/api/auth/github`,
  },
  GENERATE: `${API_BASE_URL}/api/generate`,
  GENERATIONS: `${API_BASE_URL}/api/generations`,
  USER: `${API_BASE_URL}/api/user`,
  ADMIN: `${API_BASE_URL}/api/admin`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

