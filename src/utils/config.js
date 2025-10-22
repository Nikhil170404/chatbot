// Environment configuration
export const config = {
  openRouterApiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
};

// Validate configuration
export const validateConfig = () => {
  const errors = [];

  if (!config.openRouterApiKey) {
    errors.push('REACT_APP_OPENROUTER_API_KEY is not set');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
