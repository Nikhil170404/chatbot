/**
 * Debug utility to check environment variables
 */
export const checkEnvVariables = () => {
  console.log('=== Environment Variables Debug ===');
  console.log('Node ENV:', process.env.NODE_ENV);
  console.log('OpenRouter Key exists:', !!process.env.REACT_APP_OPENROUTER_API_KEY);
  console.log('OpenRouter Key prefix:', process.env.REACT_APP_OPENROUTER_API_KEY?.substring(0, 10));
  console.log('Stock Data Source: DuckDuckGo Web Search (no API key needed)');
  console.log('All REACT_APP_ vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  console.log('===================================');
};
