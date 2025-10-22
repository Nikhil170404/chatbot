/**
 * Debug utility to check environment variables
 */
export const checkEnvVariables = () => {
  console.log('=== Environment Variables Debug ===');
  console.log('Node ENV:', process.env.NODE_ENV);
  console.log('OpenRouter Key exists:', !!process.env.REACT_APP_OPENROUTER_API_KEY);
  console.log('OpenRouter Key prefix:', process.env.REACT_APP_OPENROUTER_API_KEY?.substring(0, 10));
  console.log('Alpha Vantage Key exists:', !!process.env.REACT_APP_ALPHA_VANTAGE_KEY);
  console.log('Alpha Vantage Key:', process.env.REACT_APP_ALPHA_VANTAGE_KEY);
  console.log('All REACT_APP_ vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  console.log('===================================');
};
