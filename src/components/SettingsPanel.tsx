
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCharacter } from '@/contexts/CharacterContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ollamaService from '@/services/ollamaService';
import stabilityAIService from '@/services/stabilityAIService';
import { Loader2 } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { modelConfig, updateModelConfig } = useCharacter();
  
  const [ollamaEndpoint, setOllamaEndpoint] = useState(modelConfig.llm.endpoint);
  const [ollamaModel, setOllamaModel] = useState(modelConfig.llm.name);
  const [stabilityApiKey, setStabilityApiKey] = useState(modelConfig.imageGen.apiKey || '');
  
  const [availableOllamaModels, setAvailableOllamaModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setOllamaEndpoint(modelConfig.llm.endpoint);
      setOllamaModel(modelConfig.llm.name);
      setStabilityApiKey(modelConfig.imageGen.apiKey || '');
      
      loadOllamaModels();
    }
  }, [isOpen, modelConfig]);
  
  const loadOllamaModels = async () => {
    setIsLoadingModels(true);
    try {
      const models = await ollamaService.listModels();
      setAvailableOllamaModels(models.length > 0 ? models : ['mistral', 'llama2', 'mixtral']);
    } catch (error) {
      console.error('Error loading models:', error);
      setAvailableOllamaModels(['mistral', 'llama2', 'mixtral']);
    } finally {
      setIsLoadingModels(false);
    }
  };
  
  const handleSave = () => {
    // Update LLM settings
    updateModelConfig('llm', {
      name: ollamaModel,
      endpoint: ollamaEndpoint,
    });
    
    // Update image generation settings
    updateModelConfig('imageGen', {
      apiKey: stabilityApiKey,
    });
    
    toast.success('Settings saved successfully');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="llm" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="llm">Language Model</TabsTrigger>
            <TabsTrigger value="image">Image Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="llm" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ollamaEndpoint">Ollama API Endpoint</Label>
              <Input
                id="ollamaEndpoint"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434/api"
                className="glass-morphism"
              />
              <p className="text-xs text-muted-foreground">
                Default: http://localhost:11434/api
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ollamaModel">Ollama Model</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input
                    id="ollamaModel"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    placeholder="mistral"
                    className="glass-morphism"
                  />
                </div>
                
                <Button 
                  onClick={loadOllamaModels} 
                  variant="outline" 
                  disabled={isLoadingModels}
                  className="glass-morphism"
                >
                  {isLoadingModels ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Models'
                  )}
                </Button>
              </div>
              
              {availableOllamaModels.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Available Models:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {availableOllamaModels.map((model) => (
                      <Button
                        key={model}
                        variant="ghost"
                        size="sm"
                        className={`text-xs py-1 px-2 h-auto ${
                          ollamaModel === model
                            ? 'bg-accent1/30 text-white'
                            : 'bg-secondary/50 text-muted-foreground'
                        }`}
                        onClick={() => setOllamaModel(model)}
                      >
                        {model}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Make sure you have Ollama running locally with your preferred model downloaded.
                <br />
                <a 
                  href="https://ollama.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent1 hover:underline"
                >
                  Visit Ollama website
                </a>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stabilityApiKey">Stability AI API Key</Label>
              <Input
                id="stabilityApiKey"
                value={stabilityApiKey}
                onChange={(e) => setStabilityApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Stability AI API key"
                className="glass-morphism"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a
                  href="https://platform.stability.ai/account/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent1 hover:underline"
                >
                  Stability AI platform
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent1 hover:bg-accent1/80">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
