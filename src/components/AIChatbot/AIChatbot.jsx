import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import { AI_CHATBOT_CONFIG } from './config';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your Physical AI & Humanoid Robotics assistant. Ask me anything about the textbook content!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  const location = useLocation();
  const { colorMode } = useColorMode();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle opening chatbot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Get selected text from the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString()?.trim();
      if (selectedText && selectedText.length > 10) { // Only if substantial text is selected
        setSelectedText(selectedText);
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Determine context mode based on selected text
      const contextMode = selectedText ? 'selected_text' : 'full_book';

      // Check if we have an API URL configured
      if (!AI_CHATBOT_CONFIG.API_BASE_URL || AI_CHATBOT_CONFIG.API_BASE_URL === 'http://localhost:8000') {
        // Fallback response when no API is configured
        const fallbackResponse = {
          response: "I'm your Physical AI assistant! This is a fallback response since the API server is not configured. In a production environment, this would connect to a RAG system with your textbook content.",
          sources: ["Physical AI & Humanoid Robotics Textbook"],
          confidence: 0.9,
          context_used: contextMode
        };

        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: fallbackResponse.response,
          sources: fallbackResponse.sources,
          confidence: fallbackResponse.confidence,
          context_used: fallbackResponse.context_used,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${AI_CHATBOT_CONFIG.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: currentInput, timestamp: new Date().toISOString() }
          ],
          context_mode: contextMode,
          selected_text: selectedText || null,
          temperature: AI_CHATBOT_CONFIG.TEMPERATURE
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        sources: data.sources || [],
        confidence: data.confidence || 0.8,
        context_used: data.context_used || contextMode,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sources: [],
        confidence: 0,
        context_used: 'error',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your Physical AI & Humanoid Robotics assistant. Ask me anything about the textbook content!',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="ai-chatbot-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #a78bfa 100%)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        aria-label="Open AI Assistant"
      >
        🤖
      </button>

      {/* Chatbot Drawer */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="ai-chatbot-drawer"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '400px',
            height: '600px',
            backgroundColor: colorMode === 'dark' ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #a78bfa 100%)',
              color: 'white',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px' }}>Physical AI Assistant</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={clearChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                title="Clear chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: message.role === 'user'
                      ? (colorMode === 'dark' ? '#3b82f6' : '#dbeafe')
                      : (colorMode === 'dark' ? '#334155' : '#f1f5f9'),
                    color: message.role === 'user'
                      ? (colorMode === 'dark' ? 'white' : '#1e293b')
                      : (colorMode === 'dark' ? 'white' : '#1e293b'),
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                  {message.sources && message.sources.length > 0 && (
                    <div style={{
                      fontSize: '12px',
                      opacity: 0.7,
                      marginTop: '4px',
                      fontStyle: 'italic'
                    }}>
                      Sources: {message.sources.slice(0, 2).join(', ')}
                      {message.sources.length > 2 && ` +${message.sources.length - 2} more`}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: colorMode === 'dark' ? '#334155' : '#f1f5f9',
                    color: colorMode === 'dark' ? 'white' : '#1e293b',
                    fontSize: '14px'
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Context Indicator */}
          {selectedText && (
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: colorMode === 'dark' ? '#0f172a' : '#e0f2fe',
                color: colorMode === 'dark' ? '#7dd3fc' : '#0891b2',
                fontSize: '12px',
                borderTop: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              🎯 Using selected text context: "{selectedText.substring(0, 50)}..."
            </div>
          )}

          {/* Input Area */}
          <div
            style={{
              padding: '16px',
              borderTop: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`,
              backgroundColor: colorMode === 'dark' ? '#1e293b' : '#ffffff'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Physical AI concepts..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  backgroundColor: colorMode === 'dark' ? '#334155' : '#ffffff',
                  color: colorMode === 'dark' ? '#e2e8f0' : '#1e293b',
                  resize: 'none',
                  minHeight: '50px',
                  maxHeight: '100px',
                  fontSize: '14px'
                }}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              Tip: Press Ctrl/Cmd+K to quickly open the chatbot
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ai-chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .ai-chatbot-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default AIChatbot;