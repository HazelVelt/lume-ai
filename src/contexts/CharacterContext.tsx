
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Character, ChatMessage, ModelConfig } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

type CharacterContextType = {
  characters: Character[];
  activeCharacter: Character | null;
  conversations: Record<string, ChatMessage[]>;
  modelConfig: {
    llm: ModelConfig;
    imageGen: ModelConfig;
  };
  createCharacter: (character: Omit<Character, 'id'>) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setActiveCharacter: (id: string) => void;
  addMessage: (characterId: string, content: string, isUser: boolean) => void;
  updateModelConfig: (type: 'llm' | 'imageGen', config: Partial<ModelConfig>) => void;
};

const defaultModelConfig = {
  llm: {
    name: 'mistral',
    endpoint: 'http://localhost:11434/api',
    type: 'ollama' as const,
  },
  imageGen: {
    name: 'stable-diffusion-v1-5',
    endpoint: 'https://api.stability.ai',
    type: 'stability' as const,
    apiKey: '',
  },
};

const CharacterContext = createContext<CharacterContextType | null>(null);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const [modelConfig, setModelConfig] = useState(defaultModelConfig);
  
  // Load from localStorage on initialization
  useEffect(() => {
    try {
      const savedCharacters = localStorage.getItem('aiCharacters');
      const savedConversations = localStorage.getItem('aiConversations');
      const savedModelConfig = localStorage.getItem('aiModelConfig');
      
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters));
      }
      
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
      
      if (savedModelConfig) {
        setModelConfig(JSON.parse(savedModelConfig));
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('aiCharacters', JSON.stringify(characters));
  }, [characters]);
  
  useEffect(() => {
    localStorage.setItem('aiConversations', JSON.stringify(conversations));
  }, [conversations]);
  
  useEffect(() => {
    localStorage.setItem('aiModelConfig', JSON.stringify(modelConfig));
  }, [modelConfig]);
  
  const createCharacter = (character: Omit<Character, 'id'>) => {
    const newCharacter = { ...character, id: uuidv4() };
    setCharacters((prev) => [...prev, newCharacter]);
    toast.success(`Created character: ${character.name}`);
    return newCharacter;
  };
  
  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters((prev) => 
      prev.map((char) => (char.id === id ? { ...char, ...updates } : char))
    );
    
    if (activeCharacter?.id === id) {
      setActiveCharacter((prev) => prev ? { ...prev, ...updates } : null);
    }
    
    toast.success(`Updated character: ${updates.name || 'Character'}`);
  };
  
  const deleteCharacter = (id: string) => {
    const character = characters.find(c => c.id === id);
    setCharacters((prev) => prev.filter((char) => char.id !== id));
    
    if (activeCharacter?.id === id) {
      setActiveCharacter(null);
    }
    
    // Also delete conversations
    setConversations((prev) => {
      const newConversations = { ...prev };
      delete newConversations[id];
      return newConversations;
    });
    
    toast.success(`Deleted character: ${character?.name || 'Character'}`);
  };
  
  const setActiveCharacterById = (id: string) => {
    const character = characters.find((char) => char.id === id);
    if (character) {
      setActiveCharacter(character);
    } else {
      toast.error(`Character not found`);
    }
  };
  
  const addMessage = (characterId: string, content: string, isUser: boolean) => {
    const message: ChatMessage = {
      id: uuidv4(),
      senderId: isUser ? 'user' : characterId,
      content,
      timestamp: Date.now(),
      isUser,
    };
    
    setConversations((prev) => ({
      ...prev,
      [characterId]: [...(prev[characterId] || []), message],
    }));
  };
  
  const updateModelConfig = (type: 'llm' | 'imageGen', config: Partial<ModelConfig>) => {
    setModelConfig((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...config,
      },
    }));
    
    toast.success(`Updated ${type === 'llm' ? 'language model' : 'image generation'} settings`);
  };
  
  return (
    <CharacterContext.Provider
      value={{
        characters,
        activeCharacter,
        conversations,
        modelConfig,
        createCharacter,
        updateCharacter,
        deleteCharacter,
        setActiveCharacter: setActiveCharacterById,
        addMessage,
        updateModelConfig,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
