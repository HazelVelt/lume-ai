
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PersonalitySlider from './PersonalitySlider';
import { Character } from '@/types';
import { useCharacter } from '@/contexts/CharacterContext';
import stabilityAIService from '@/services/stabilityAIService';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';

interface CharacterEditorProps {
  character?: Character;
  isOpen: boolean;
  onClose: () => void;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  const { createCharacter, updateCharacter, modelConfig } = useCharacter();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [personality, setPersonality] = useState({
    kinkiness: 50,
    dominance: 50,
    submissiveness: 50,
  });

  // Reset form when character changes
  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setImagePrompt(character.defaultPrompt);
      setImageUrl(character.imageUrl);
      setPersonality(character.personality);
    } else {
      setName('');
      setDescription('');
      setImagePrompt('Full body portrait of a character');
      setImageUrl('');
      setPersonality({
        kinkiness: 50,
        dominance: 50,
        submissiveness: 50,
      });
    }
  }, [character, isOpen]);

  const handleGenerateImage = async () => {
    if (!modelConfig.imageGen.apiKey) {
      toast.error('Please enter your Stability AI API key in the settings');
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
        toast.success('Image generated successfully');
      } else {
        toast.error('Failed to generate image');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error generating image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const characterData = {
      name,
      description,
      personality,
      imageUrl,
      defaultPrompt: imagePrompt,
    };

    if (character) {
      updateCharacter(character.id, characterData);
    } else {
      createCharacter(characterData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-none animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {character ? 'Edit Character' : 'Create New Character'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character name"
                className="glass-morphism"
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
                className="glass-morphism"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personality Traits</h3>
                <PersonalitySlider
                  label="Kinkiness"
                  value={personality.kinkiness}
                  onChange={(value) =>
                    setPersonality((prev) => ({ ...prev, kinkiness: value }))
                  }
                  color="bg-pink-500"
                />
                <PersonalitySlider
                  label="Dominance"
                  value={personality.dominance}
                  onChange={(value) =>
                    setPersonality((prev) => ({ ...prev, dominance: value }))
                  }
                  color="bg-red-500"
                />
                <PersonalitySlider
                  label="Submissiveness"
                  value={personality.submissiveness}
                  onChange={(value) =>
                    setPersonality((prev) => ({ ...prev, submissiveness: value }))
                  }
                  color="bg-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Character Image</h3>
                <div className="relative rounded-lg overflow-hidden aspect-square bg-muted flex items-center justify-center glass-morphism">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name || "Character"}
                      className="w-full h-full object-cover"
                      onError={() => setImageUrl('')}
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm p-4 text-center">
                      No image generated yet
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagePrompt">Image Prompt</Label>
                  <Textarea
                    id="imagePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe how your character should look..."
                    rows={2}
                    className="glass-morphism"
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !imagePrompt.trim() || !modelConfig.imageGen.apiKey}
                    className="w-full mt-2"
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
