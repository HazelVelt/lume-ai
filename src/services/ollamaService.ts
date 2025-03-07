
import { toast } from "sonner";

const OLLAMA_ENDPOINT = 'http://localhost:11434/api';

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(endpoint: string = OLLAMA_ENDPOINT, model: string = 'mistral') {
    this.baseUrl = endpoint;
    this.model = model;
  }

  async generateResponse(
    prompt: string, 
    systemPrompt: string, 
    conversation: { role: string; content: string }[]
  ): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation,
        { role: 'user', content: prompt }
      ];

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data = await response.json();
      return data.message?.content || '';
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to connect to Ollama. Make sure it\'s running locally.');
      return 'I apologize, but I\'m having trouble connecting to my language model. Please ensure Ollama is running on your computer.';
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`);
      if (!response.ok) {
        throw new Error('Failed to list models');
      }
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Error listing models:', error);
      toast.error('Failed to connect to Ollama. Make sure it\'s running locally.');
      return [];
    }
  }

  setModel(model: string): void {
    this.model = model;
  }
}

export default new OllamaService();
