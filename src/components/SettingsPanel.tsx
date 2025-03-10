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
import { Loader2, Moon, Sun, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { modelConfig, updateModelConfig, updateCardSize, cardSize } = useCharacter();
  const { theme, toggleTheme } = useTheme();
  
  const [ollamaEndpoint, setOllamaEndpoint] = useState(modelConfig.llm.endpoint);
  const [ollamaModel, setOllamaModel] = useState(modelConfig.llm.name);
  const [stabilityApiKey, setStabilityApiKey] = useState(modelConfig.imageGen.apiKey || '');
  const [stabilityModel, setStabilityModel] = useState(modelConfig.imageGen.name || 'stable-diffusion-xl-1024-v1-0');
  const [cardSizeValue, setCardSizeValue] = useState(cardSize || 50);
  
  const [availableOllamaModels, setAvailableOllamaModels] = useState<string[]>([]);
  const [availableStabilityModels, setAvailableStabilityModels] = useState<string[]>([]);
  const [isLoadingOllamaModels, setIsLoadingOllamaModels] = useState(false);
  const [isLoadingStabilityModels, setIsLoadingStabilityModels] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setOllamaEndpoint(modelConfig.llm.endpoint);
      setOllamaModel(modelConfig.llm.name);
      setStabilityApiKey(modelConfig.imageGen.apiKey || '');
      setStabilityModel(modelConfig.imageGen.name || 'stable-diffusion-xl-1024-v1-0');
      setCardSizeValue(cardSize || 50);
      
      loadOllamaModels();
      if (modelConfig.imageGen.apiKey) {
        loadStabilityModels();
      }
    }
  }, [isOpen, modelConfig, cardSize]);
  
  const loadOllamaModels = async () => {
    setIsLoadingOllamaModels(true);
    try {
      const models = await ollamaService.listModels();
      setAvailableOllamaModels(models.length > 0 ? models : ['mistral', 'llama2', 'mixtral']);
    } catch (error) {
      console.error('Error loading models:', error);
      setAvailableOllamaModels(['mistral', 'llama2', 'mixtral']);
    } finally {
      setIsLoadingOllamaModels(false);
    }
  };
  
  const loadStabilityModels = async () => {
    setIsLoadingStabilityModels(true);
    try {
      stabilityAIService.setApiKey(stabilityApiKey);
      const models = await stabilityAIService.listModels();
      setAvailableStabilityModels(models);
    } catch (error) {
      console.error('Error loading Stability models:', error);
      setAvailableStabilityModels([
        'stable-diffusion-xl-1024-v1-0',
        'stable-diffusion-v1-5',
        'stable-diffusion-512-v2-1'
      ]);
    } finally {
      setIsLoadingStabilityModels(false);
    }
  };
  
  const getCardSizeLabel = (size: number) => {
    if (size <= 20) return 'Tiny';
    if (size <= 35) return 'Compact';
    if (size <= 50) return 'Regular';
    if (size <= 70) return 'Large';
    if (size <= 85) return 'Extra Large';
    return 'Massive';
  };
  
  const handleSave = () => {
    updateModelConfig('llm', {
      name: ollamaModel,
      endpoint: ollamaEndpoint,
    });
    
    updateModelConfig('imageGen', {
      apiKey: stabilityApiKey,
      name: stabilityModel
    });
    
    updateCardSize(cardSizeValue);
    
    toast.success('Settings saved successfully', {
      duration: 1000,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="llm" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="llm">Language Model</TabsTrigger>
            <TabsTrigger value="image">Image Generation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
                  disabled={isLoadingOllamaModels}
                  className="glass-morphism"
                >
                  {isLoadingOllamaModels ? (
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
            
            <div className="space-y-2">
              <Label htmlFor="stabilityModel">Stability AI Model</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={stabilityModel} 
                  onValueChange={setStabilityModel}
                >
                  <SelectTrigger className="glass-morphism">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStabilityModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={loadStabilityModels} 
                  variant="outline" 
                  disabled={isLoadingStabilityModels || !stabilityApiKey}
                  className="glass-morphism"
                >
                  {isLoadingStabilityModels ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Models'
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Recommended model: stable-diffusion-xl-1024-v1-0
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className={`flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-accent1 hover:bg-accent1/80' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </Button>
                
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className={`flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-accent1 hover:bg-accent1/80' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Size
                </Label>
                <span className="text-sm font-medium">{getCardSizeLabel(cardSizeValue)}</span>
              </div>
              <Slider 
                value={[cardSizeValue]} 
                onValueChange={(value) => setCardSizeValue(value[0])}
                min={10}
                max={100}
                step={5}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tiny</span>
                <span>Compact</span>
                <span>Regular</span>
                <span>Large</span>
                <span>Massive</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Adjust the size of character cards in the sidebar
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
