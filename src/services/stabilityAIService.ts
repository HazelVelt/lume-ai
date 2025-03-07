
import { toast } from "sonner";

const DEFAULT_MODEL = 'stable-diffusion-v1-5';
const API_HOST = 'https://api.stability.ai';

export class StabilityAIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = '', model: string = DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.model = model;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setModel(model: string): void {
    this.model = model;
  }

  async generateImage(prompt: string): Promise<string> {
    if (!this.apiKey) {
      toast.error('API key not set for Stability AI');
      return '';
    }

    try {
      const response = await fetch(`${API_HOST}/v1/generation/${this.model}/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 512,
          width: 512,
          samples: 1,
          steps: 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const responseJSON = await response.json();
      const imageBase64 = responseJSON.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please check your API key and try again.');
      return '';
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.apiKey) {
      return [DEFAULT_MODEL];
    }

    try {
      const response = await fetch(`${API_HOST}/v1/engines/list`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to list models');
      }

      const responseJSON = await response.json();
      return responseJSON.map((engine: any) => engine.id);
    } catch (error) {
      console.error('Error listing models:', error);
      return [DEFAULT_MODEL];
    }
  }
}

export default new StabilityAIService();
