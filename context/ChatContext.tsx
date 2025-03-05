"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Redesigned interfaces for AI-focused chat
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  lastActivity: Date;
}

export interface AIChannel {
  id: string;
  name: string;
  description: string;
  iconEmoji: string;
  color: string;
  chats: Chat[];
  isActive: boolean;
}

interface ChatContextType {
  channels: AIChannel[];
  currentChannel: AIChannel;
  currentChat: Chat | null;
  isTyping: boolean;
  setCurrentChannel: (channelId: string) => void;
  setCurrentChat: (chatId: string | null) => void;
  sendMessage: (text: string) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  isChatListOpen: boolean;
  toggleChatList: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample initial chat data
const createSampleChat = (id: string, name: string): Chat => ({
  id,
  name,
  lastActivity: new Date(),
  messages: [
    {
      id: `msg-${id}-1`,
      text: `Welcome to ${name}! How can I assist you today?`,
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    }
  ]
});

// Initial AI channels
const initialChannels: AIChannel[] = [
  {
    id: 'channel-userguide',
    name: 'User Guide Assistant',
    description: 'Get help with product documentation and guidance',
    iconEmoji: '📚',
    color: 'emerald',
    isActive: true,
    chats: [
      createSampleChat('chat-userguide-1', 'Guide Help'),
      createSampleChat('chat-userguide-2', 'Product Questions')
    ]
  },
  {
    id: 'channel-report',
    name: 'Report Builder',
    description: 'Generate data reports and visualizations',
    iconEmoji: '📊',
    color: 'blue',
    isActive: false,
    chats: [
      createSampleChat('chat-report-1', 'Monthly Report'),
      createSampleChat('chat-report-2', 'Sales Analytics')
    ]
  },
  {
    id: 'channel-sql',
    name: 'SQL Assistant',
    description: 'Get help with SQL queries and database issues',
    iconEmoji: '💾',
    color: 'purple',
    isActive: false,
    chats: [
      createSampleChat('chat-sql-1', 'Query Optimization'),
      createSampleChat('chat-sql-2', 'Database Schema')
    ]
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<AIChannel[]>(initialChannels);
  const [currentChannel, setCurrentChannel] = useState<AIChannel>(initialChannels[0]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(initialChannels[0].chats[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(true);

  // Simulate AI typing response
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (currentChat && currentChat.messages.length > 0 && currentChat.messages[currentChat.messages.length - 1].isUser) {
      // Start typing effect after user message
      setIsTyping(true);
      
      typingTimeout = setTimeout(() => {
        // Generate AI response after typing
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          text: generateAIResponse(currentChannel.name, currentChat.messages[currentChat.messages.length - 1].text),
          isUser: false,
          timestamp: new Date()
        };
        
        setIsTyping(false);
        updateChatWithNewMessage(currentChat.id, newMessage);
      }, 2000);
    }
    
    return () => clearTimeout(typingTimeout);
  }, [currentChat?.messages]);

  // Generate simple responses based on channel type
  const generateAIResponse = (channelName: string, userMessage: string): string => {
    const userMsgLower = userMessage.toLowerCase();
    
    if (channelName.includes('User Guide')) {
      if (userMsgLower.includes('help') || userMsgLower.includes('guide')) {
        return "I can help you navigate our product. What specific feature are you looking for guidance on?";
      }
      return "As your User Guide Assistant, I'm here to provide documentation and help you understand product features. What would you like to know?";
    }
    
    if (channelName.includes('Report')) {
      if (userMsgLower.includes('report') || userMsgLower.includes('data')) {
        return "I can help generate various reports. Would you like a sales report, customer analysis, or something else?";
      }
      return "I'm your Report Builder Assistant. I can help you create insightful data visualizations and reports. What type of data are you working with?";
    }
    
    if (channelName.includes('SQL')) {
      if (userMsgLower.includes('query') || userMsgLower.includes('sql')) {
        return "For SQL optimization, I'd need to see your current query. Can you share the SQL code you're working with?";
      }
      return "As your SQL Assistant, I can help optimize queries, design schemas, and troubleshoot database issues. What's your database question?";
    }
    
    return "I'm here to help! Could you provide more details about what you need?";
  };

  // Function to change channels
  const changeCurrentChannel = (channelId: string) => {
    const updatedChannels = channels.map(channel => ({
      ...channel,
      isActive: channel.id === channelId
    }));

    setChannels(updatedChannels);
    const newCurrentChannel = updatedChannels.find(ch => ch.id === channelId) || updatedChannels[0];
    setCurrentChannel(newCurrentChannel);
    setCurrentChat(newCurrentChannel.chats[0] || null);
    setIsMobileSidebarOpen(false);
  };

  // Function to change chats within a channel
  const changeCurrentChat = (chatId: string | null) => {
    if (!chatId) {
      setCurrentChat(null);
      return;
    }
    
    const chat = currentChannel.chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      if (window.innerWidth < 768) {
        setIsChatListOpen(false); // Close chat list on mobile when selecting a chat
      }
    }
  };

  // Send a new message
  const sendMessage = (text: string) => {
    if (!text.trim() || !currentChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };

    updateChatWithNewMessage(currentChat.id, newMessage);
  };

  // Create a new chat in the current channel
  const createNewChat = () => {
    const newChatName = `New Chat ${currentChannel.chats.length + 1}`;
    const newChat: Chat = {
      id: `chat-${currentChannel.id}-${Date.now()}`,
      name: newChatName,
      messages: [],
      lastActivity: new Date()
    };

    const updatedChannels = channels.map(channel => {
      if (channel.id === currentChannel.id) {
        return {
          ...channel,
          chats: [newChat, ...channel.chats]
        };
      }
      return channel;
    });

    setChannels(updatedChannels);
    setCurrentChannel(updatedChannels.find(c => c.id === currentChannel.id) || updatedChannels[0]);
    setCurrentChat(newChat);
  };

  // Delete a chat from current channel
  const deleteChat = (chatId: string) => {
    const updatedChannels = channels.map(channel => {
      if (channel.id === currentChannel.id) {
        return {
          ...channel,
          chats: channel.chats.filter(chat => chat.id !== chatId)
        };
      }
      return channel;
    });

    setChannels(updatedChannels);
    const updatedCurrentChannel = updatedChannels.find(c => c.id === currentChannel.id) || updatedChannels[0];
    setCurrentChannel(updatedCurrentChannel);
    
    // If deleted current chat, select the first available chat
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(updatedCurrentChannel.chats[0] || null);
    }
  };

  // Helper to update a chat with a new message
  const updateChatWithNewMessage = (chatId: string, message: ChatMessage) => {
    const updatedChannels = channels.map(channel => {
      if (channel.id === currentChannel.id) {
        return {
          ...channel,
          chats: channel.chats.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, message],
                lastActivity: new Date()
              };
            }
            return chat;
          })
        };
      }
      return channel;
    });

    setChannels(updatedChannels);
    setCurrentChannel(updatedChannels.find(c => c.id === currentChannel.id) || updatedChannels[0]);
    setCurrentChat(
      updatedChannels
        .find(c => c.id === currentChannel.id)
        ?.chats.find(c => c.id === chatId) || null
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', (!darkMode).toString());
    }
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Toggle chat list (for mobile/tablet view)
  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) {
        setDarkMode(savedDarkMode === 'true');
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
      }
    }
  }, []);

  const value = {
    channels,
    currentChannel,
    currentChat,
    isTyping,
    setCurrentChannel: changeCurrentChannel,
    setCurrentChat: changeCurrentChat,
    sendMessage,
    createNewChat,
    deleteChat,
    darkMode,
    toggleDarkMode,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    isChatListOpen,
    toggleChatList
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};