
export interface Character {
  id: string;
  name: string;
  description: string;
  personality: {
    kinkiness: number;
    dominance: number;
    submissiveness: number;
    intelligence: number;
    empathy: number;
    creativity: number;
    humor: number;
    confidence: number;
    curiosity: number;
    reliability: number;
    passion: number;
    sensuality: number;
    flirtatiousness: number;
    adventurousness: number;
    intensity: number;
  };
  imageUrl: string;
  defaultPrompt: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isUser: boolean;
}

export interface ModelConfig {
  name: string;
  endpoint: string;
  type: 'ollama' | 'stability';
  apiKey?: string;
}

export type ThemeType = 'dark' | 'light' | 'purple' | 'ocean' | 'sunset' | 'emerald' | 'cherry' | 'midnight';
