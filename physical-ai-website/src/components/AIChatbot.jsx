import React, { useState, useEffect, useRef } from 'react';
import { getEnhancedContext } from '../utils/textSelection';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Hello! I\'m your AI assistant for the Physical AI & Humanoid Robotics textbook. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenAIChatbot = (event) => {
      setIsOpen(true);
      // Optionally pre-fill with context from the event
      if (event.detail?.context) {
        setInputValue(`I have a question about this page: ${event.detail.context}`);
      }
    };

    window.addEventListener('openAIChatbot', handleOpenAIChatbot);

    return () => {
      window.removeEventListener('openAIChatbot', handleOpenAIChatbot);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);

    // Clear input if it was pre-filled with context
    if (inputValue.startsWith('I have a question about this page:')) {
      setInputValue('');
    } else {
      setInputValue('');
    }

    setIsLoading(true);

    try {
      // Get enhanced context from the page
      const context = getEnhancedContext();

      // Call backend API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          context_page: context.pageContext.pathname,
          selected_text: context.selectedText,
          mode: context.hasSelection ? 'selected_text_only' : 'full_book'
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Chatbot widget button */}
      <div className="ai-chatbot-widget">
        <button
          className="ai-chatbot-button"
          onClick={toggleChat}
          aria-label="Open AI Chatbot"
        >
          🤖
        </button>
      </div>

      {/* Chatbot drawer */}
      <div className={`ai-chatbot-drawer ${isOpen ? 'open' : ''}`}>
        <div className="ai-chatbot-header">
          <div className="ai-chatbot-title">Physical AI Assistant</div>
          <button
            className="ai-chatbot-close"
            onClick={closeChat}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div className="ai-chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="ai-message">
              <span className="loading-dots">Thinking</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chatbot-input-area">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Physical AI & Robotics..."
              className="ai-chatbot-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-chatbot-send-button"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
          <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
            AI uses textbook content for accurate responses
          </small>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;