import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:9000/api/sahaay";

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
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [error, setError] = useState(null);

  // 📌 Add system message
  const addSystemMessage = useCallback((text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      timestamp: new Date()
    }]);
  }, []);

  // 📌 Start Session
  const startSession = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE}/start_session`, {
        userId,
        initialDistressScore: 1
      });
      setSessionId(response.data.sessionId);
      setIsSessionActive(true);
      return response.data.sessionId;
    } catch (err) {
      setError("Failed to start chat. Please try again.");
      addSystemMessage("Session could not start. Please try again.");
      return null;
    }
  }, [userId, addSystemMessage]);

  // 📌 End Session
  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await axios.post(`${API_BASE}/end_session`, {
        sessionId,
        userId,
        finalDistressScore: distressLevel
      });
      setSessionId('');
      setIsSessionActive(false);
    } catch {
      setError("Error ending the chat session.");
    }
  }, [sessionId, userId, distressLevel]);

  // 📌 Send Message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !sessionId) return null;

    // user message added
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        sessionId,
        userId,
        message: text
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response.text,
        sender: 'bot',
        timestamp: new Date(),
        interventionType: response.data.response.interventionType
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.data.distressLevel) {
        setDistressLevel(response.data.distressLevel);
      }

      return response.data;
    } catch {
      setError("Sorry, Sahaay had an issue replying. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId]);

  // 📌 Clear Chat
  const clearChat = useCallback(() => {
    setMessages([{
      id: 1,
      text: "Namaste! I'm Sahaay 🌿 I'm here with you. Tell me, how are you feeling?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setDistressLevel(1);
  }, []);

  // 📌 Auto start session
  useEffect(() => {
    startSession();
    return () => {
      if (isSessionActive) endSession();
    };
  }, [startSession, endSession, isSessionActive]);

  return {
    messages,
    isTyping,
    distressLevel,
    sessionId,
    isSessionActive,
    error,
    sendMessage,
    startSession,
    endSession,
    clearChat,
    addSystemMessage
  };
};

export default useSahaayChat;
