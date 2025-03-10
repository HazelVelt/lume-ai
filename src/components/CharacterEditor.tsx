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
import { Loader2, RefreshCw, User, Upload, X, Tag as TagIcon, Plus, Search } from 'lucide-react';

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
    { 
      key: 'kinkiness', 
      label: 'Kinkiness', 
      description: 'How open-minded and adventurous the character is'
    },
    { 
      key: 'dominance', 
      label: 'Dominance', 
      description: 'How controlling and assertive the character is'
    },
    { 
      key: 'submissiveness', 
      label: 'Submissiveness', 
      description: 'How yielding and compliant the character is'
    },
    { 
      key: 'intelligence', 
      label: 'Intelligence', 
      description: 'How smart and knowledgeable the character is'
    },
    { 
      key: 'empathy', 
      label: 'Empathy', 
      description: 'How understanding and compassionate the character is'
    },
    { 
      key: 'creativity', 
      label: 'Creativity', 
      description: 'How imaginative and innovative the character is'
    },
    { 
      key: 'humor', 
      label: 'Humor', 
      description: 'How funny and witty the character is'
    },
    { 
      key: 'confidence', 
      label: 'Confidence', 
      description: 'How self-assured and certain the character is'
    },
    { 
      key: 'curiosity', 
      label: 'Curiosity', 
      description: 'How eager the character is to learn and explore'
    },
    { 
      key: 'reliability', 
      label: 'Reliability', 
      description: 'How dependable and trustworthy the character is'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {character ? 'Edit Character' : 'Create New Character'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[calc(80vh-120px)] overflow-y-auto pr-2 scrollbar-none">
          <div className="grid grid-cols-1 gap-4 px-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character name"
                className="glass-morphism px-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your character's backstory, traits, and personality..."
                rows={4}
                className="glass-morphism px-6"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <TagIcon className="h-4 w-4" />
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
                    className="glass-morphism pl-8"
                  />
                  <Search className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                  
                  {showTagSuggestions && (
                    <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {tagSuggestions
                        .filter(tag => 
                          tag.toLowerCase().includes(tagInput.toLowerCase()) && 
                          !tags.includes(tag)
                        )
                        .map(tag => (
                          <div 
                            key={tag} 
                            className="px-3 py-2 hover:bg-accent1/10 cursor-pointer text-sm"
                            onClick={() => handleAddTag(tag)}
                          >
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
                  className="whitespace-nowrap"
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
                    className="flex items-center gap-1 py-1"
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
                <h3 className="text-lg font-semibold">Personality Traits</h3>
                <div className="space-y-6">
                  {personalitySliders.map((slider) => (
                    <PersonalitySlider
                      key={slider.key}
                      label={slider.label}
                      description={slider.description}
                      value={personality[slider.key as keyof typeof personality]}
                      onChange={(value) =>
                        setPersonality((prev) => ({ ...prev, [slider.key]: value }))
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Character Image</h3>
                  <span className="text-xs text-foreground/40">(Optional)</span>
                </div>
                
                <div className="relative rounded-lg overflow-hidden aspect-square bg-muted flex items-center justify-center glass-morphism">
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
                  <Label htmlFor="imagePrompt">Image Prompt (for AI generation)</Label>
                  <Textarea
                    id="imagePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe how your character should look..."
                    rows={2}
                    className="glass-morphism px-6"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !imagePrompt.trim()}
                      className="flex-1"
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
                      className="flex-1"
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
                      className="flex-shrink-0"
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent1 hover:bg-accent1/80">
            {character ? 'Save Changes' : 'Create Character'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterEditor;
