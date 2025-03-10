
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
import { 
  Loader2, Moon, Sun, Palette, CreditCard, 
  Droplets, Sunset, Gem, Heart, ScrollText, Settings2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { modelConfig, updateModelConfig, updateCardSize, cardSize } = useCharacter();
  const { theme, setTheme } = useTheme();
  
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
    if (size <= 15) return 'Tiny';
    if (size <= 30) return 'Compact';
    if (size <= 45) return 'Small';
    if (size <= 60) return 'Medium';
    if (size <= 75) return 'Large';
    if (size <= 90) return 'Extra Large';
    return 'Massive';
  };
  
  const themeOptions: { label: string; value: ThemeType; icon: React.ReactNode }[] = [
    { label: 'Light', value: 'light', icon: <Sun className="h-5 w-5" /> },
    { label: 'Dark', value: 'dark', icon: <Moon className="h-5 w-5" /> },
    { label: 'Purple', value: 'purple', icon: <Palette className="h-5 w-5" /> },
    { label: 'Ocean', value: 'ocean', icon: <Droplets className="h-5 w-5" /> },
    { label: 'Sunset', value: 'sunset', icon: <Sunset className="h-5 w-5" /> },
    { label: 'Emerald', value: 'emerald', icon: <Gem className="h-5 w-5" /> },
    { label: 'Cherry', value: 'cherry', icon: <Heart className="h-5 w-5" /> },
    { label: 'Midnight', value: 'midnight', icon: <ScrollText className="h-5 w-5" /> },
  ];
  
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
      <DialogContent className="sm:max-w-[500px] animate-scale-in paper-texture rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold sketch-underline">
            <Settings2 className="inline-block mr-2 h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 handcrafted-border rounded-md p-1 bg-background/50">
            <TabsTrigger 
              value="llm" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hand-drawn-button shadow-primary/20"
            >
              Language Model
            </TabsTrigger>
            <TabsTrigger 
              value="image" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hand-drawn-button shadow-primary/20"
            >
              Image Generation
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hand-drawn-button shadow-primary/20"
            >
              Appearance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="llm" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ollamaEndpoint" className="wavy-decoration">Ollama API Endpoint</Label>
              <Input
                id="ollamaEndpoint"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434/api"
                className="handcrafted-input"
              />
              <p className="text-xs text-muted-foreground">
                Default: http://localhost:11434/api
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ollamaModel" className="wavy-decoration">Ollama Model</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input
                    id="ollamaModel"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    placeholder="mistral"
                    className="handcrafted-input"
                  />
                </div>
                
                <Button 
                  onClick={loadOllamaModels} 
                  variant="outline" 
                  disabled={isLoadingOllamaModels}
                  className="hand-drawn-button shadow-primary/20"
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
                <div className="mt-2 p-3 bg-background/30 rounded-lg border border-dashed border-border/60">
                  <Label className="text-xs text-muted-foreground wavy-decoration">Available Models:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {availableOllamaModels.map((model) => (
                      <Button
                        key={model}
                        variant="ghost"
                        size="sm"
                        className={`text-xs py-1 px-2 h-auto ${
                          ollamaModel === model
                            ? 'bg-accent1/30 text-foreground font-bold'
                            : 'bg-secondary/50 text-muted-foreground'
                        } hand-drawn-button shadow-accent1/10`}
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
              <Label htmlFor="stabilityApiKey" className="wavy-decoration">Stability AI API Key</Label>
              <Input
                id="stabilityApiKey"
                value={stabilityApiKey}
                onChange={(e) => setStabilityApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Stability AI API key"
                className="handcrafted-input"
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
              <Label htmlFor="stabilityModel" className="wavy-decoration">Stability AI Model</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={stabilityModel} 
                  onValueChange={setStabilityModel}
                >
                  <SelectTrigger className="handcrafted-input">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="paper-texture border-2 border-dashed border-border/60">
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
                  className="hand-drawn-button shadow-primary/20"
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
              <Label className="wavy-decoration">Theme</Label>
              
              <Select value={theme} onValueChange={(value: ThemeType) => setTheme(value)}>
                <SelectTrigger className="handcrafted-input">
                  <SelectValue placeholder="Select a theme">
                    <div className="flex items-center gap-2">
                      {themeOptions.find(option => option.value === theme)?.icon}
                      <span>{themeOptions.find(option => option.value === theme)?.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="paper-texture border-2 border-dashed border-border/60">
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-4 gap-3 mt-3">
                {themeOptions.map((option) => (
                  <Button 
                    key={option.value}
                    variant={theme === option.value ? 'default' : 'outline'}
                    className={`flex items-center justify-center gap-2 py-4 flex-col 
                      ${theme === option.value ? 'bg-accent1 hover:bg-accent1/80 dark:text-black' : ''}
                      hand-drawn-button shadow-primary/20
                    `}
                    onClick={() => setTheme(option.value)}
                  >
                    {option.icon}
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 pt-4 mt-2 border-t border-dashed border-border/40">
              <div className="flex items-center justify-between">
                <Label className="flex items-center wavy-decoration">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Size
                </Label>
                <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                  {getCardSizeLabel(cardSizeValue)}
                </span>
              </div>
              
              <div className="handcrafted-slider">
                <Slider 
                  value={[cardSizeValue]} 
                  onValueChange={(value) => setCardSizeValue(value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="my-4"
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tiny</span>
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
                <span>Massive</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Adjust the size of character cards in the sidebar
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-2 border-t border-dashed border-border/40">
          <Button variant="outline" onClick={onClose} className="hand-drawn-button shadow-primary/20">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent1 hover:bg-accent1/80 dark:text-black hand-drawn-button shadow-accent1/30">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
