
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { CharacterProvider, useCharacter } from '@/contexts/CharacterContext';
import CharacterCard from '@/components/CharacterCard';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';

const MainContent = () => {
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Show welcome message on first load
  useEffect(() => {
    if (characters.length === 0) {
      toast('Welcome to AI Character Creator', {
        description: 'Create your first AI character to get started',
        duration: 5000,
      });
    }
  }, [characters.length]);

  const handleCreateCharacter = () => {
    setEditingCharacter(null);
    setIsEditorOpen(true);
  };

  const handleEditCharacter = (id) => {
    const character = characters.find((c) => c.id === id);
    if (character) {
      setEditingCharacter(character);
      setIsEditorOpen(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-[320px] border-r border-border bg-background/95 backdrop-blur-sm flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gradient">AI Character Creator</h1>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="h-8 w-8 rounded-full"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center p-4">
          <h2 className="text-sm font-semibold text-foreground/70">Your Characters</h2>
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleCreateCharacter}
            className="flex items-center text-xs h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-none">
          {characters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="glass-morphism p-6 rounded-lg max-w-[240px]">
                <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first AI character to start chatting
                </p>
                <Button 
                  onClick={handleCreateCharacter}
                  className="w-full bg-accent1 hover:bg-accent1/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Character
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onSelect={setActiveCharacter}
                  onEdit={handleEditCharacter}
                  onDelete={deleteCharacter}
                  isActive={activeCharacter?.id === character.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full bg-background">
        {activeCharacter ? (
          <ChatInterface character={activeCharacter} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="max-w-md glass-morphism p-8 rounded-xl animate-float">
              <h2 className="text-2xl font-bold mb-4 text-gradient">Welcome to AI Character Creator</h2>
              <p className="text-muted-foreground mb-6">
                Create AI characters with unique personalities and chat with them using your local language model.
              </p>
              
              <div className="space-y-4">
                <div className="glass-morphism p-4 rounded-lg text-left">
                  <h3 className="text-sm font-semibold mb-2">Getting Started:</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                    <li>Create your first character using the sidebar</li>
                    <li>Customize their personality traits</li>
                    <li>Generate an image with Stability AI</li>
                    <li>Select your character to start chatting</li>
                  </ol>
                </div>
                
                <div className="glass-morphism p-4 rounded-lg text-left">
                  <h3 className="text-sm font-semibold mb-2">Requirements:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                    <li><a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">Ollama</a> running locally for text generation</li>
                    <li><a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">Stability AI</a> API key for image generation</li>
                  </ul>
                </div>
                
                <Button
                  onClick={handleCreateCharacter}
                  className="w-full bg-accent1 hover:bg-accent1/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Character
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CharacterEditor
        character={editingCharacter}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <CharacterProvider>
      <MainContent />
    </CharacterProvider>
  );
};

export default Index;
