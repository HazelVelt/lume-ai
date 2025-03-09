
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { CharacterProvider, useCharacter } from '@/contexts/CharacterContext';
import CharacterCard from '@/components/CharacterCard';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import ThemeToggle from '@/components/ThemeToggle';
import LandingPage from '@/components/LandingPage';
import ChatNavigation from '@/components/ChatNavigation';

const MainContent = () => {
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden pt-0">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-0 md:w-16 overflow-hidden' : 'w-full md:w-[320px]'} border-r border-border bg-background/95 backdrop-blur-sm flex flex-col h-full transition-all duration-300 relative`}>
        <div className="p-4 border-b flex justify-between items-center">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-gradient cursor-pointer">
              AI Haven
            </h1>
          )}
          <div className="flex items-center space-x-1">
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

        {!isSidebarCollapsed && (
          <>
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

            <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
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
                      showPersonalityValues={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Sidebar toggle button - Fixed positioning and z-index */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-4 h-8 w-8 rounded-full bg-background border border-border shadow-md z-50"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full bg-background">
        {activeCharacter ? (
          <>
            <div className="p-4 border-b flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setActiveCharacter(null)} 
                className="px-0"
              >
                <h1 className="text-xl font-bold text-gradient">AI Haven</h1>
              </Button>
            </div>
            <ChatInterface character={activeCharacter} />
            <ChatNavigation 
              character={activeCharacter}
              onEdit={handleEditCharacter}
              onDelete={deleteCharacter}
            />
          </>
        ) : (
          <LandingPage onCreateCharacter={handleCreateCharacter} />
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
