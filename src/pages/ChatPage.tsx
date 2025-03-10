
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/chat/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import ChatNavigation from '@/components/ChatNavigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TagFilterBar from '@/components/chat/TagFilterBar';
import EmptyStateMessage from '@/components/chat/EmptyStateMessage';
import { Character } from '@/types';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // If we have an ID from the route, set that character as active
    if (id && id !== 'new') {
      const character = characters.find(c => c.id === id);
      if (character) {
        setActiveCharacter(character.id);
      } else {
        // If character not found, go to main chat page
        navigate('/chat');
      }
    } else if (id === 'new') {
      handleCreateCharacter();
    } else if (characters.length > 0 && !activeCharacter) {
      // Default to first character if none is active
      setActiveCharacter(characters[0].id);
    }
  }, [id, characters, activeCharacter]);

  // Get all unique tags from characters
  const allTags = [...new Set(characters.flatMap(char => char.tags || []))];

  const handleCreateCharacter = () => {
    setEditingCharacter(null);
    setIsEditorOpen(true);
  };

  const handleEditCharacter = (id: string) => {
    const character = characters.find((c) => c.id === id);
    if (character) {
      setEditingCharacter(character);
      setIsEditorOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleReturnToLanding = () => {
    // Navigate to landing page
    navigate('/');
  };

  // Check if the selected tags filter matches the current character
  const doesCharacterMatchTags = (character: Character) => {
    if (selectedTags.length === 0) return true;
    if (!character.tags || character.tags.length === 0) return false;
    
    // Check if character has all selected tags
    return selectedTags.every(tag => character.tags?.includes(tag));
  };

  // If tags are selected and active character doesn't match, try to select another character
  useEffect(() => {
    if (selectedTags.length > 0 && activeCharacter && !doesCharacterMatchTags(activeCharacter)) {
      // Find the first character that matches the selected tags
      const matchingCharacter = characters.find(c => doesCharacterMatchTags(c));
      if (matchingCharacter) {
        setActiveCharacter(matchingCharacter.id);
      }
    }
  }, [selectedTags]);

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
        
        {/* Tags bar */}
        <TagFilterBar 
          allTags={allTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
        />
        
        {activeCharacter ? (
          doesCharacterMatchTags(activeCharacter) ? (
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
            <EmptyStateMessage
              title="No Matching Characters"
              description="None of your characters match the selected tags. Try selecting different tags or create a new character."
              buttonText="Create Character"
              onButtonClick={handleCreateCharacter}
              clearTagsButton={true}
              onClearTags={() => setSelectedTags([])}
            />
          )
        ) : characters.length === 0 ? (
          <EmptyStateMessage
            title="Welcome to AI Haven"
            description="Create your first character to start chatting."
            buttonText="Create New Character"
            onButtonClick={handleCreateCharacter}
          />
        ) : (
          <EmptyStateMessage
            title="Select a Character"
            description="Choose an existing character from the sidebar or create a new one to start chatting."
            buttonText="Create New Character"
            onButtonClick={handleCreateCharacter}
          />
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

export default ChatPage;
