
import React, { useState, useEffect } from 'react';
import { CharacterProvider, useCharacter } from '@/contexts/CharacterContext';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import LandingPage from '@/components/LandingPage';
import ChatNavigation from '@/components/ChatNavigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const MainContent = () => {
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);

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

  useEffect(() => {
    if (activeCharacter) {
      setShowLandingPage(false);
    }
  }, [activeCharacter]);

  const handleReturnToLanding = () => {
    // Clear active character and show landing page
    setActiveCharacter(null);
    setShowLandingPage(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden pt-0">
      {/* Sidebar */}
      <Sidebar 
        onCreateCharacter={handleCreateCharacter}
        onEditCharacter={handleEditCharacter}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full bg-background relative">
        <Header 
          activeCharacter={activeCharacter} 
          onReturnHome={handleReturnToLanding} 
        />
        
        {activeCharacter ? (
          <>
            <ChatInterface 
              character={activeCharacter}
              onReturn={handleReturnToLanding}
            />
            <ChatNavigation 
              character={activeCharacter}
              onEdit={handleEditCharacter}
              onDelete={deleteCharacter}
            />
          </>
        ) : (
          showLandingPage && <LandingPage onCreateCharacter={handleCreateCharacter} />
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
