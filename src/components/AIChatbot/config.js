// AI Chatbot Configuration
export const AI_CHATBOT_CONFIG = {
  // API Configuration
  API_BASE_URL: typeof window !== 'undefined' && window.ENV
    ? window.ENV.REACT_APP_RAG_API_URL
    : 'http://localhost:8000',

  // Model Configuration
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  TOP_P: 0.9,

  // UI Configuration
  INITIAL_MESSAGE: "Hello! I'm your Physical AI & Humanoid Robotics assistant. Ask me anything about the textbook content!",
  PLACEHOLDER_TEXT: "Ask about Physical AI concepts...",
  BUTTON_SIZE: 60,
  WINDOW_WIDTH: 400,
  WINDOW_HEIGHT: 600,

  // Context Modes
  CONTEXT_MODES: {
    FULL_BOOK: 'full_book',
    SELECTED_TEXT: 'selected_text'
  },

  // Animation Settings
  ANIMATION_DURATION: 300, // ms

  // Shortcut Keys
  SHORTCUT_KEY: {
    TOGGLE: 'k', // Ctrl/Cmd + K to toggle
    MODIFIER: ['Control', 'Meta'] // Control or Meta (Cmd on Mac)
  },

  // Message Settings
  MAX_HISTORY_MESSAGES: 20,
  AUTO_SCROLL_DELAY: 100, // ms

  // Colors (AI/Robotics theme)
  COLORS: {
    PRIMARY_GRADIENT: 'linear-gradient(135deg, #0ea5e9 0%, #a78bfa 100%)', // neon blue to soft purple
    USER_BUBBLE_LIGHT: '#dbeafe',
    USER_BUBBLE_DARK: '#3b82f6',
    BOT_BUBBLE_LIGHT: '#f1f5f9',
    BOT_BUBBLE_DARK: '#334155',
    HEADER_BG: 'linear-gradient(135deg, #0ea5e9 0%, #a78bfa 100%)',
    BORDER_LIGHT: '#e2e8f0',
    BORDER_DARK: '#334155'
  }
};