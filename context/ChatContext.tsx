"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  threadId?: string;
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
  sendMessage: (text: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: (chatId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  isChatListOpen: boolean;
  toggleChatList: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

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

  const changeCurrentChat = (chatId: string | null) => {
    if (!chatId) {
      setCurrentChat(null);
      return;
    }
    
    const chat = currentChannel.chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      if (window.innerWidth < 768) {
        setIsChatListOpen(false);
      }
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create thread');
      }

      const newChat: Chat = {
        id: `chat-${currentChannel.id}-${Date.now()}`,
        name: `New Chat ${currentChannel.chats.length + 1}`,
        messages: [],
        lastActivity: new Date(),
        threadId: data.threadId
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
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create a new chat. Please try again.');
    }
  };

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
    
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(updatedCurrentChannel.chats[0] || null);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentChat || !currentChat.threadId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };

    updateChatWithNewMessage(currentChat.id, newMessage);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          threadId: currentChat.threadId,
          message: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      if (data.message) {
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          text: data.message,
          isUser: false,
          timestamp: new Date()
        };
        updateChatWithNewMessage(currentChat.id, assistantMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', (!darkMode).toString());
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
  };

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