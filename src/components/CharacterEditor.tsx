
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import PersonalitySlider from './PersonalitySlider';
import { Character } from '@/types';
import { useCharacter } from '@/contexts/CharacterContext';
import stabilityAIService from '@/services/stabilityAIService';
import { toast } from 'sonner';
import { 
  Loader2, RefreshCw, User, Upload, X, Tag as TagIcon, 
  Plus, Search, Palette, Brush, Wand2, Pencil, Sparkles
} from 'lucide-react';

interface CharacterEditorProps {
  character?: Character;
  isOpen: boolean;
  onClose: () => void;
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  const { createCharacter, updateCharacter, modelConfig, characters } = useCharacter();
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [personality, setPersonality] = useState({
    kinkiness: 50,
    dominance: 50,
    submissiveness: 50,
    intelligence: 50,
    empathy: 50,
    creativity: 50,
    humor: 50,
    confidence: 50,
    curiosity: 50,
    reliability: 50,
  });

  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setImagePrompt(character.defaultPrompt || '');
      setImageUrl(character.imageUrl || '');
      setTags(character.tags || []);
      setPersonality({
        kinkiness: character.personality.kinkiness,
        dominance: character.personality.dominance,
        submissiveness: character.personality.submissiveness,
        intelligence: character.personality.intelligence || 50,
        empathy: character.personality.empathy || 50,
        creativity: character.personality.creativity || 50,
        humor: character.personality.humor || 50,
        confidence: character.personality.confidence || 50,
        curiosity: character.personality.curiosity || 50,
        reliability: character.personality.reliability || 50,
      });
    } else {
      setName('');
      setDescription('');
      setImagePrompt('Full body portrait of a character');
      setImageUrl('');
      setTags([]);
      setTagInput('');
      setPersonality({
        kinkiness: 50,
        dominance: 50,
        submissiveness: 50,
        intelligence: 50,
        empathy: 50,
        creativity: 50,
        humor: 50,
        confidence: 50,
        curiosity: 50,
        reliability: 50,
      });
    }
  }, [character, isOpen]);

  useEffect(() => {
    const allTags = new Set<string>();
    characters.forEach(char => {
      if (char.tags && char.tags.length > 0) {
        char.tags.forEach(tag => allTags.add(tag));
      }
    });
    setTagSuggestions(Array.from(allTags));
  }, [characters]);

  useEffect(() => {
    if (tagInput.trim() !== '') {
      const filteredSuggestions = tagSuggestions.filter(
        tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
      );
      setShowTagSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowTagSuggestions(false);
    }
  }, [tagInput, tags, tagSuggestions]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!modelConfig.imageGen.apiKey) {
      toast.error('Please enter your Stability AI API key in the settings to generate images', {
        duration: 2000,
      });
      return;
    }

    if (!imagePrompt.trim()) {
      toast.error('Please enter an image prompt', {
        duration: 2000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      stabilityAIService.setApiKey(modelConfig.imageGen.apiKey);
      stabilityAIService.setModel(modelConfig.imageGen.name);
      
      const prompt = imagePrompt + ", digital art, high quality, beautiful artwork";
      const imageUrl = await stabilityAIService.generateImage(prompt);
      
      if (imageUrl) {
        setImageUrl(imageUrl);
        toast.success('Image generated successfully', {
          duration: 2000,
        });
      } 
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = (tagToAdd: string = tagInput) => {
    if (tagToAdd.trim() && !tags.includes(tagToAdd.trim())) {
      setTags(prev => [...prev, tagToAdd.trim()]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a name', {
        duration: 2000,
      });
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description', {
        duration: 2000,
      });
      return;
    }

    const characterData = {
      name,
      description,
      personality,
      imageUrl: imageUrl || PLACEHOLDER_IMAGE,
      defaultPrompt: imagePrompt,
      tags,
    };

    if (character) {
      updateCharacter(character.id, characterData);
    } else {
      createCharacter(characterData);
    }

    onClose();
  };

  const personalitySliders = [
    // Emotional traits
    { 
      key: 'empathy', 
      label: 'Empathy', 
      description: 'How understanding and compassionate the character is',
      icon: <Palette className="h-4 w-4" />
    },
    { 
      key: 'humor', 
      label: 'Humor', 
      description: 'How funny and witty the character is',
      icon: <Sparkles className="h-4 w-4" />
    },
    // Intellectual traits
    { 
      key: 'intelligence', 
      label: 'Intelligence', 
      description: 'How smart and knowledgeable the character is',
      icon: <Brush className="h-4 w-4" />
    },
    { 
      key: 'creativity', 
      label: 'Creativity', 
      description: 'How imaginative and innovative the character is',
      icon: <Brush className="h-4 w-4" />
    },
    { 
      key: 'curiosity', 
      label: 'Curiosity', 
      description: 'How eager the character is to learn and explore',
      icon: <Sparkles className="h-4 w-4" />
    },
    // Personality core traits
    { 
      key: 'confidence', 
      label: 'Confidence', 
      description: 'How self-assured and certain the character is',
      icon: <Wand2 className="h-4 w-4" />
    },
    { 
      key: 'reliability', 
      label: 'Reliability', 
      description: 'How dependable and trustworthy the character is',
      icon: <Pencil className="h-4 w-4" />
    },
    // Relationship dynamics
    { 
      key: 'dominance', 
      label: 'Dominance', 
      description: 'How controlling and assertive the character is',
      icon: <Wand2 className="h-4 w-4" />
    },
    { 
      key: 'submissiveness', 
      label: 'Submissiveness', 
      description: 'How yielding and compliant the character is',
      icon: <Pencil className="h-4 w-4" />
    },
    { 
      key: 'kinkiness', 
      label: 'Kinkiness', 
      description: 'How open-minded and adventurous the character is',
      icon: <Sparkles className="h-4 w-4" />
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold handcrafted-border pb-2 sketch-underline">
            <Palette className="inline-block mr-2 h-5 w-5 text-accent1" />
            {character ? 'Edit Character' : 'Create New Character'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[calc(80vh-120px)] overflow-y-auto pr-2 scrollbar-none">
          <div className="grid grid-cols-1 gap-4 px-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1 text-lg">
                <Wand2 className="h-4 w-4 text-accent1" />
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character name"
                className="handcrafted-input px-6 text-lg shadow-accent1/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1 text-lg">
                <Brush className="h-4 w-4 text-accent1" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your character's backstory, traits, and personality..."
                rows={4}
                className="handcrafted-input px-6 shadow-accent1/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-lg">
                <TagIcon className="h-4 w-4 text-accent1" />
                Tags
              </Label>
              <div className="flex items-center gap-2 relative">
                <div className="relative flex-1">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onFocus={() => tagInput.trim() !== '' && setShowTagSuggestions(true)}
                    placeholder="Add tags (press Enter)"
                    className="handcrafted-input pl-8 shadow-accent1/20"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  
                  {showTagSuggestions && (
                    <div className="absolute z-10 mt-1 w-full bg-background border-2 border-border rounded-md shadow-lg max-h-40 overflow-y-auto animate-fade-in">
                      {tagSuggestions
                        .filter(tag => 
                          tag.toLowerCase().includes(tagInput.toLowerCase()) && 
                          !tags.includes(tag)
                        )
                        .map(tag => (
                          <div 
                            key={tag} 
                            className="px-3 py-2 hover:bg-accent1/10 cursor-pointer text-sm flex items-center gap-2"
                            onClick={() => handleAddTag(tag)}
                          >
                            <Plus className="h-3 w-3 text-accent1" />
                            {tag}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag()}
                  disabled={!tagInput.trim()}
                  className="whitespace-nowrap handcrafted-input h-10 px-4 shadow-accent1/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tag
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1 py-1 border border-border animate-pulse-soft"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">No tags added yet</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold sketch-underline inline-block">
                  <Palette className="inline-block mr-2 h-5 w-5 text-accent1" />
                  Personality Traits
                </h3>
                <div className="space-y-6 handcrafted-border p-4 rounded-lg bg-background/50">
                  {personalitySliders.map((slider) => (
                    <PersonalitySlider
                      key={slider.key}
                      label={slider.label}
                      description={slider.description}
                      value={personality[slider.key as keyof typeof personality]}
                      onChange={(value) =>
                        setPersonality((prev) => ({ ...prev, [slider.key]: value }))
                      }
                      icon={slider.icon}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold sketch-underline inline-block">
                    <Wand2 className="inline-block mr-2 h-5 w-5 text-accent1" />
                    Character Image
                  </h3>
                  <span className="text-xs text-foreground/40">(Optional)</span>
                </div>
                
                <div className="relative rounded-lg overflow-hidden aspect-square bg-muted flex items-center justify-center handcrafted-card transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name || "Character"}
                      className="w-full h-full object-cover"
                      onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm p-4 text-center flex flex-col items-center justify-center h-full">
                      <User className="h-16 w-16 mb-2 text-muted-foreground/50" />
                      <span>No image selected</span>
                      <span className="text-xs text-muted-foreground/50 mt-1">
                        You can generate an image, upload one, or use a placeholder
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagePrompt" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-accent1" />
                    Image Prompt (for AI generation)
                  </Label>
                  <Textarea
                    id="imagePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe how your character should look..."
                    rows={2}
                    className="handcrafted-input px-6 shadow-accent1/20"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !imagePrompt.trim()}
                      className="flex-1 handcrafted-input h-auto py-2 hover:bg-accent1/10 shadow-accent1/20"
                      variant="outline"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      className="flex-1 handcrafted-input h-auto py-2 hover:bg-accent1/10 shadow-accent1/20"
                      type="button"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      onClick={() => setImageUrl(PLACEHOLDER_IMAGE)}
                      variant="outline"
                      className="flex-shrink-0 handcrafted-input h-auto py-2 hover:bg-accent1/10 shadow-accent1/20"
                      type="button"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                  {!modelConfig.imageGen.apiKey && (
                    <p className="text-xs text-amber-400 mt-1">
                      You need to add a Stability AI API key in Settings to generate images
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="handcrafted-input">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-accent1 hover:bg-accent1/80 handcrafted-input shadow-accent1/20"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {character ? 'Save Changes' : 'Create Character'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterEditor;
