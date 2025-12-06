import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:9000/api"; // Updated base URL

const useSahaayChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm Sahaay, your emotional wellbeing companion 🌿 How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [distressLevel, setDistressLevel] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userId] = useState(() => {
    // Try to get userId from localStorage, or generate a new one
    const storedId = localStorage.getItem('sahaay_userId');
    if (storedId) return storedId;
    const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sahaay_userId', newId);
    return newId;
  });
  const [error, setError] = useState(null);

  // Create axios instance with base config
  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // For sending cookies
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error);
      setError(error.response?.data?.message || 'Something went wrong');
      return Promise.reject(error);
    }
  );

  // 📌 Add system message
  const addSystemMessage = useCallback((text, type = 'info') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      type,
      timestamp: new Date()
    }]);
  }, []);

  // 📌 Start Session
  const startSession = useCallback(async () => {
    try {
      setError(null);
      setIsTyping(true);
      
      const response = await api.post('/sessions/start', {
        userId,
        initialDistressScore: 1
      });
      
      setSessionId(response.data.sessionId);
      setIsSessionActive(true);
      setIsTyping(false);
      
      // Add welcome message from the server if available
      if (response.data.welcomeMessage) {
        addMessage(response.data.welcomeMessage, 'bot');
      }
      
      return response.data.sessionId;
    } catch (err) {
      console.error('Start session error:', err);
      setError("Failed to start chat. Please try again.");
      addSystemMessage("Session could not start. Please try again.", 'error');
      setIsTyping(false);
      return null;
    }
  }, [userId, addSystemMessage]);

  // 📌 Add Message Helper
  const addMessage = useCallback((text, sender = 'bot', type = 'text') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender,
      type,
      timestamp: new Date()
    }]);
  }, []);

  // 📌 End Session
  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      setIsTyping(true);
      await api.post(`/sessions/${sessionId}/end`, {
        userId
      });
      setIsSessionActive(false);
      setSessionId('');
      addSystemMessage("Session ended. Start a new one whenever you're ready.", 'info');
    } catch (err) {
      console.error('Error ending session:', err);
      addSystemMessage("Error ending session. You can safely close the chat.", 'error');
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId, addSystemMessage, api]);

  // 📌 Send Message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) {
      addSystemMessage("Please type a message.", 'warning');
      return;
    }

    if (!isSessionActive) {
      await startSession();
    }

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await api.post('/chat', {
        message: text,
        sessionId,
        userId,
        distressLevel
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: response.data.type || 'text',
        data: response.data.data || null
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.data.distressScore !== undefined) {
        setDistressLevel(response.data.distressScore);
      }
      
      if (response.data.sessionId && response.data.sessionId !== sessionId) {
        setSessionId(response.data.sessionId);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      addSystemMessage("I'm having trouble connecting. Please try again.", 'error');
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId, distressLevel, isSessionActive, startSession, addSystemMessage, api]);

  // Initialize session on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check for existing session
        const response = await api.get('/sessions/active');
        if (response.data.active) {
          setSessionId(response.data.sessionId);
          setIsSessionActive(true);
          // Optionally load previous messages
          if (response.data.messages?.length) {
            setMessages(prev => [...prev, ...response.data.messages]);
          }
        } else {
          await startSession();
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        // Fallback to starting a new session
        await startSession();
      }
    };

    initializeChat();
    
    return () => {
      if (isSessionActive) {
        endSession().catch(console.error);
      }
    };
  }, [startSession, endSession, isSessionActive]);

  return {
    messages,
    sendMessage,
    isTyping,
    distressLevel,
    error,
    sessionId,
    isSessionActive,
    startSession,
    endSession,
    addMessage,
    addSystemMessage
  };
};

export default useSahaayChat;
