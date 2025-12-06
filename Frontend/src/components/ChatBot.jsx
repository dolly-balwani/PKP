import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { 
  Send, 
  Bot, 
  User, 
  Menu, 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Sun, 
  Leaf, 
  Zap,
  Loader2,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! 🌞 Main SahayBot hoon — aapke feelings, thoughts aur stress ke saath empathize karne ke liye yahan hoon. Aaj aap kaise feel kar rahe hain?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('warm');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize user and session
  useEffect(() => {
    // Get or create user ID
    const storedUserId = localStorage.getItem('sahaybot_user_id');
    if (!storedUserId) {
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sahaybot_user_id', newUserId);
      setUserId(newUserId);
    } else {
      setUserId(storedUserId);
    }

    // Generate new session ID
    const newSessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);

    // Notify backend of new session
    const startSession = async () => {
      try {
        await fetch('/api/chat/start_session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: storedUserId || userId, 
            sessionId: newSessionId 
          })
        });
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    startSession();

    // Cleanup on unmount
    return () => {
      const endSession = async () => {
        try {
          await fetch('/api/chat/end_session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: storedUserId || userId, 
              sessionId: newSessionId 
            })
          });
        } catch (error) {
          console.error('Error ending session:', error);
        }
      };
      endSession();
    };
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Theme switching
  const switchTheme = (theme) => {
    setCurrentTheme(theme);
    document.body.className = theme === 'warm' ? '' : `theme-${theme}`;
  };

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'warm': return <Sun className="w-4 h-4" />;
      case 'natural': return <Leaf className="w-4 h-4" />;
      case 'modern': return <Zap className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'warm': return '#f99c5b';
      case 'natural': return '#52c97a';
      case 'modern': return '#3d9098';
      default: return '#3d9098';
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId || !sessionId) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call backend API
      const response = await fetch('/api/chat/chat_with_bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId,
          userMessage: input
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Hide typing indicator
      setIsTyping(false);

      if (data.reply) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No reply from server');
      }

    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "⚠️ Server error. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf1f5] lg:pl-72">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between" style={{borderColor:'#c8ced1'}}>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#2e2f34]" />
        </button>
        <h1 className="text-lg font-bold text-[#2e2f34]">SahayBot</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col h-screen lg:h-[calc(100vh-0px)]">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-6 bg-white border-b" style={{borderColor:'#c8ced1'}}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors" 
              style={{background:'#c8ced1'}}
            >
              <ArrowLeft className="w-5 h-5 text-[#2e2f34]" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3d9098] rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2e2f34]">SahayBot</h1>
                <p className="text-sm text-[#767272]">Your AI mental wellness companion</p>
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#767272] mr-2">Theme:</span>
            {['warm', 'natural', 'modern'].map(theme => (
              <button
                key={theme}
                onClick={() => switchTheme(theme)}
                className={`p-2 rounded-lg transition-all ${
                  currentTheme === theme 
                    ? 'bg-[#3d9098] text-white shadow-sm' 
                    : 'hover:bg-[#f2f7eb] text-[#767272]'
                }`}
                title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
              >
                {getThemeIcon(theme)}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-[#3d9098]' 
                      : 'bg-[#f2f7eb] border-2' 
                  }`} style={msg.sender === 'bot' ? {borderColor:'#3d9098'} : {}}>
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4" style={{color:'#3d9098'}} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-[#3d9098] text-white' 
                      : 'bg-white border' 
                  }`} style={msg.sender === 'bot' ? {borderColor:'#c8ced1'} : {}}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold">
                        {msg.sender === 'user' ? 'You' : 'SahayBot'}
                      </span>
                      <span className={`text-xs ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-[#767272]'
                      }`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className={`text-sm leading-relaxed ${
                      msg.sender === 'user' ? 'text-white' : 'text-[#2e2f34]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-[#f2f7eb] border-2 flex items-center justify-center flex-shrink-0" style={{borderColor:'#3d9098'}}>
                    <Bot className="w-4 h-4" style={{color:'#3d9098'}} />
                  </div>
                  <div className="bg-white border rounded-2xl p-4" style={{borderColor:'#c8ced1'}}>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#3d9098]" />
                      <span className="text-sm text-[#767272]">SahayBot is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-6" style={{borderColor:'#c8ced1'}}>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share your thoughts... मैं यहाँ हूँ 💙"
                  className="w-full p-4 border rounded-xl focus:outline-none focus:border-[#3d9098] focus:ring-2 focus:ring-[#3d9098]/20 resize-none"
                  style={{borderColor:'#c8ced1'}}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  disabled={isTyping}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-xs text-[#767272]">
                    <Shield className="w-3 h-3" />
                    <span>100% Anonymous & Secure</span>
                  </div>
                  <span className="text-xs text-[#767272]">Press Enter to send</span>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  isTyping || !input.trim()
                    ? 'opacity-50 cursor-not-allowed bg-[#c8ced1] text-white'
                    : 'bg-[#3d9098] text-white hover:opacity-90'
                }`}
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{isTyping ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}