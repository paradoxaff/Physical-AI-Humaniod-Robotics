// Client module to handle environment variables for Docusaurus
// This file is loaded by Docusaurus and makes environment variables available to the client

// Create a global ENV object to store environment variables
if (typeof window !== 'undefined') {
  window.ENV = {
    // Default values
    REACT_APP_RAG_API_URL: typeof process !== 'undefined' && process.env && process.env.REACT_APP_RAG_API_URL
      ? process.env.REACT_APP_RAG_API_URL
      : 'http://localhost:8000',
  };
}