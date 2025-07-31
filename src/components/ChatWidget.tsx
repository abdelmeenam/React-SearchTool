import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

type Option = {
  icon: string;
  label: string;
  value: string;
  color: string;
};

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  type: string;
  options?: Option[];
};

type ChatHistory = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastModified: Date;
};

const initialGreeting: Message = {
  id: "greeting",
  sender: "bot",
  text: "Hello 👋! I'm your smart pharmacy assistant. Please type the drug name you want to check.",
  timestamp: new Date(),
  type: "greeting"
};

export default function PharmacyAssistantChat() {
  const [isOpen, setIsOpen] = useState(localStorage.getItem("WindowState") === "open");
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // Chat history states
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  // Audio state to track if loading sound is playing
  const [isLoadingSoundPlaying, setIsLoadingSoundPlaying] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-save current chat
  useEffect(() => {
    if (currentChatId && messages.length > 1) {
      saveChatHistory();
    }
  }, [messages, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    localStorage.setItem("WindowState", !isOpen ? "open" : "closed");
    if (!isOpen) {
      setShowHistoryPanel(false);
    }
  };

  // Generate chat title from first user message
  const generateChatTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(msg => msg.sender === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.text.slice(0, 30);
      return title.length < firstUserMessage.text.length ? title + "..." : title;
    }
    return "New Chat";
  };

  // Save current chat to history
  const saveChatHistory = useCallback(() => {
    if (!currentChatId) return;
    
    setChatHistories(prev => {
      const existingIndex = prev.findIndex(chat => chat.id === currentChatId);
      const chatData: ChatHistory = {
        id: currentChatId,
        title: generateChatTitle(messages),
        messages: messages,
        createdAt: existingIndex >= 0 ? prev[existingIndex].createdAt : new Date(),
        lastModified: new Date()
      };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = chatData;
        return updated;
      } else {
        return [chatData, ...prev];
      }
    });
  }, [currentChatId, messages]);

  // Start new chat
  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentChatId(newChatId);
    setMessages([initialGreeting]);
    setContext("");
    setInput("");
    setConversationHistory([]);
    setSuggestions([]);
    setShowHistoryPanel(false);
  };

  // Load chat from history
  const loadChatHistory = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setContext("");
      setInput("");
      
      // Rebuild conversation history
      const userMessages = chat.messages
        .filter(msg => msg.sender === "user")
        .map(msg => msg.text);
      setConversationHistory(userMessages);
      
      // Generate suggestions based on last message
      if (userMessages.length > 0) {
        const lastMessage = userMessages[userMessages.length - 1];
        setSuggestions(generateSuggestions(lastMessage, userMessages));
      }
      
      setShowHistoryPanel(false);
    }
  };

  // Delete chat history
  const deleteChatHistory = (chatId: string) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
    
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  // Rename chat
  const renameChatHistory = (chatId: string, newTitle: string) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle, lastModified: new Date() }
          : chat
      )
    );
    setEditingChatId(null);
    setEditingTitle("");
  };

  // Start editing chat title
  const startEditingTitle = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  // Initialize first chat if none exists
  useEffect(() => {
    if (!currentChatId) {
      startNewChat();
    }
  }, []);

  const playLoadingSound = useCallback(() => {
    setIsLoadingSoundPlaying(true);
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 1);
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.1); // Reduced volume
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    // Reset loading sound state after it finishes
    setTimeout(() => {
      setIsLoadingSoundPlaying(false);
    }, 1100);
  }, []);

  const playSound = useCallback((type: 'sent' | 'received') => {
    // Don't play received sound if loading sound is currently playing
    if (type === 'received' && isLoadingSoundPlaying) {
      return;
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'sent') {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.15);
    }
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01); // Consistent volume
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + (type === 'sent' ? 0.1 : 0.15));
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + (type === 'sent' ? 0.1 : 0.15));
  }, [isLoadingSoundPlaying]);

  const generateSuggestions = useCallback((userMessage: string, history: string[]) => {
    const suggestions: string[] = [];
    const lowerMessage = userMessage.toLowerCase();
    
    const mentionedDrugs = history.filter(msg => 
      msg.length > 2 && !msg.includes('?') && !msg.includes('thank')
    );
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('headache')) {
      suggestions.push("What about ibuprofen alternatives?");
      suggestions.push("Tell me about acetaminophen options");
      if (mentionedDrugs.length > 0) {
        suggestions.push(`Compare with ${mentionedDrugs[mentionedDrugs.length - 1]}`);
      }
    }
    
    if (lowerMessage.includes('antibiotic') || lowerMessage.includes('infection')) {
      suggestions.push("Show me penicillin alternatives");
      suggestions.push("What about cephalexin options?");
      suggestions.push("Are there natural alternatives?");
    }
    
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension')) {
      suggestions.push("ACE inhibitors alternatives");
      suggestions.push("Beta blockers options");
      suggestions.push("Diuretics alternatives");
    }
    
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      suggestions.push("Metformin alternatives");
      suggestions.push("Insulin options");
      suggestions.push("Natural diabetes remedies");
    }
    
    if (mentionedDrugs.length > 1) {
      suggestions.push(`Compare ${mentionedDrugs[mentionedDrugs.length - 1]} with ${mentionedDrugs[mentionedDrugs.length - 2]}`);
    }
    
    if (mentionedDrugs.length > 0) {
      suggestions.push(`Side effects of ${mentionedDrugs[mentionedDrugs.length - 1]}`);
      suggestions.push(`Dosage for ${mentionedDrugs[mentionedDrugs.length - 1]}`);
    }
    
    return [...new Set(suggestions)].slice(0, 4);
  }, []);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
    
    if (msg.sender === "user") {
      const newHistory = [...conversationHistory, msg.text];
      setConversationHistory(newHistory);
      
      const newSuggestions = generateSuggestions(msg.text, newHistory);
      setSuggestions(newSuggestions);
    }
    
    if (msg.sender === "bot" && !isLoadingSoundPlaying) {
      // Only play received sound if loading sound is not playing
      setTimeout(() => playSound('received'), 300);
    }
  };

  const sendToAPI = async (payload: Record<string, any>) => {
    setIsLoading(true);
    setIsTyping(true);
    
    playLoadingSound();
    
    try {
      const res = await fetch("https://store.medisearchtool.com/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.type) data.type = "message";

      const botMsg: Message = {
        id: Date.now().toString(),
        sender: "bot",
        text: data.text || "No response from server.",
        timestamp: new Date(),
        type: data.type,
        options: data.options || []
      };
      
      // Wait for loading sound to finish before adding message
      setTimeout(() => {
        addMessage(botMsg);
      }, 1200);

    } catch (err) {
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          sender: "bot",
          text: "❌ Failed to connect to backend.",
          timestamp: new Date(),
          type: "error"
        });
      }, 1200);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsTyping(false);
      }, 1200);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmedInput,
      timestamp: new Date(),
      type: "message"
    };
    addMessage(userMsg);
    playSound('sent');

    setInput("");

    sendToAPI({ message: trimmedInput, context });
  };

  const handleOptionSelect = (option: Option) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: `${option.icon} ${option.label}`,
      timestamp: new Date(),
      type: "message"
    };
    addMessage(userMsg);
    playSound('sent');

    sendToAPI({ option: option.value, context });
  };

  const handleSuggestionClick = (suggestion: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: suggestion,
      timestamp: new Date(),
      type: "message"
    };
    addMessage(userMsg);
    playSound('sent');

    sendToAPI({ message: suggestion, context });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999]">
      {/* Chat Toggle Button */}
      <button
        className={`
          group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full 
          bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600
          hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700
          text-white flex items-center justify-center cursor-pointer 
          shadow-lg hover:shadow-xl
          border-none transition-all duration-300 transform hover:scale-105 
          active:scale-95
          ${isOpen ? 'rotate-45' : 'rotate-0'}
          before:absolute before:inset-0 before:rounded-full before:bg-white/20 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
        `}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open pharmacy assistant chat"}
      >
        <div className="relative z-10">
          {isOpen ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span className="text-lg sm:text-xl">💊</span>
          )}
        </div>
        
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
        )}
      </button>

      {/* History Panel */}
      {showHistoryPanel && (
        <div className="absolute bottom-14 right-0 sm:bottom-16 sm:right-0 w-screen sm:w-[340px] h-screen sm:h-[480px] bg-white/95 backdrop-blur-xl rounded-none sm:rounded-2xl shadow-2xl border border-gray-100/50 flex flex-col overflow-hidden">
          {/* History Header */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chat History</h3>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🗨️</div>
                <p className="text-sm">No chat history yet</p>
              </div>
            ) : (
              chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 
                    transition-all duration-200 cursor-pointer hover:shadow-md
                    ${currentChatId === chat.id ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">💬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                renameChatHistory(chat.id, editingTitle);
                              } else if (e.key === 'Escape') {
                                cancelEditing();
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => renameChatHistory(chat.id, editingTitle)}
                            className="text-green-600 hover:text-green-700 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => loadChatHistory(chat.id)}
                          className="flex-1"
                        >
                          <h4 className="font-medium text-sm text-gray-900 truncate">{chat.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(chat.lastModified)}</p>
                          <p className="text-xs text-gray-400 mt-1">{chat.messages.length} messages</p>
                        </div>
                      )}
                    </div>
                    
                    {editingChatId !== chat.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingTitle(chat.id, chat.title);
                          }}
                          className="text-gray-400 hover:text-blue-600 p-1"
                          title="Rename"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChatHistory(chat.id);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Delete"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat Window */}
      <div className={`
        absolute bottom-14 right-0 sm:bottom-16 sm:right-0
        w-screen h-screen sm:w-[340px] sm:h-[480px] lg:w-[380px] lg:h-[520px]
        bg-white/95 backdrop-blur-xl rounded-none sm:rounded-2xl 
        shadow-2xl border border-gray-100/50
        flex flex-col overflow-hidden
        transition-all duration-300 ease-out transform-gpu
        ${isOpen && !showHistoryPanel ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="relative p-3 sm:p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-xl sm:text-2xl">🏥</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold truncate">Pharmacy Assistant</h3>
                <p className="text-blue-100 text-xs sm:text-sm opacity-90 truncate">Smart Drug Alternative Finder</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                className="
                  bg-white/20 hover:bg-white/30 active:bg-white/40
                  text-white text-xs px-2 py-1 rounded-full 
                  transition-all duration-200 backdrop-blur-sm
                  border border-white/30 hover:border-white/50
                  flex items-center gap-1
                "
                onClick={startNewChat}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </button>
              
              <button
                className="
                  bg-white/20 hover:bg-white/30 active:bg-white/40
                  text-white text-xs px-2 py-1 rounded-full 
                  transition-all duration-200 backdrop-blur-sm
                  border border-white/30 hover:border-white/50
                  flex items-center gap-1
                "
                onClick={() => setShowHistoryPanel(true)}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History ({chatHistories.length})
              </button>
              
              <div className="flex-1"></div>
              <div className="flex items-center gap-1 text-xs text-blue-100">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`
                flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300
                ${msg.sender === 'user' ? 'flex-row-reverse' : ''}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center 
                text-xs sm:text-sm flex-shrink-0 shadow-sm
                ${msg.sender === 'bot' 
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                }
              `}>
                {msg.sender === "bot" ? "🤖" : "👤"}
              </div>

              <div className={`flex flex-col max-w-[75%] sm:max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`
                  group relative px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed
                  transition-all duration-200 hover:shadow-md
                  ${msg.sender === "user" 
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md shadow-lg hover:shadow-xl" 
                    : "bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm hover:shadow-md hover:border-gray-200"
                  }
                `}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  
                  <div className={`
                    absolute top-0 w-2 h-2 transform rotate-45
                    ${msg.sender === "user" 
                      ? "bg-blue-500 -right-1" 
                      : "bg-white border-l border-t border-gray-100 -left-1"
                    }
                  `}></div>
                </div>
                
                <div className="text-xs text-gray-400 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Options */}
          {messages.map((msg) => (
            msg.type === "options" && msg.options && (
              <div key={`${msg.id}-options`} className="ml-8 sm:ml-11 space-y-2">
                {msg.options.map((option, index) => (
                  <button
                    key={option.value}
                    className={`
                      w-full p-2 sm:p-3 rounded-xl border text-left 
                      transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                      active:scale-[0.98] backdrop-blur-sm
                      ${option.color} animate-in slide-in-from-left-1 duration-300
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg">{option.icon}</span>
                      <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 shadow-sm text-blue-700">
                🤖
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-100/50 bg-white/80 backdrop-blur-xl">
          {/* Smart Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 font-medium">💡 Smart Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="
                      px-3 py-1.5 text-xs bg-gradient-to-r from-blue-50 to-indigo-50
                      text-blue-700 rounded-full border border-blue-200
                      hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300
                      transition-all duration-200 hover:scale-105 active:scale-95
                      shadow-sm hover:shadow-md backdrop-blur-sm
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                placeholder="Type your message here..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                className="
                  w-full p-2 sm:p-3 pr-10 border border-gray-200 rounded-2xl 
                  text-xs sm:text-sm resize-none 
                  focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 
                  transition-all duration-200 bg-white/90 backdrop-blur-sm
                  placeholder:text-gray-400
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                style={{ 
                  maxHeight: "100px", 
                  minHeight: "40px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 transparent"
                }}
              />
              
              {/* Character counter for long messages */}
              {input.length > 100 && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                  {input.length}/500
                </div>
              )}
            </div>
            
            <button
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                bg-gradient-to-br from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                active:scale-95
                text-white border-none flex items-center justify-center cursor-pointer 
                transition-all duration-200 shadow-lg hover:shadow-xl
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                ${!input.trim() ? 'opacity-30 cursor-not-allowed' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}