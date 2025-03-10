import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/chat/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import Sidebar from '@/components/Sidebar';
import EmptyStateMessage from '@/components/chat/EmptyStateMessage';
import { Character } from '@/types';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter, isDeleting } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (id && id !== 'new') {
      const character = characters.find(c => c.id === id);
      if (character) {
        setActiveCharacter(character.id);
      } else {
        navigate('/chat');
      }
    } else if (id === 'new') {
      handleCreateCharacter();
    } else if (characters.length > 0 && !activeCharacter) {
      setActiveCharacter(characters[0].id);
    }
  }, [id, characters, activeCharacter]);

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

  const handleDeleteCharacter = (id: string) => {
    if (!isDeleting) {
      deleteCharacter(id);
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
    navigate('/');
  };

  const doesCharacterMatchTags = (character: Character) => {
    if (selectedTags.length === 0) return true;
    if (!character.tags || character.tags.length === 0) return false;
    
    return selectedTags.every(tag => character.tags?.includes(tag));
  };

  useEffect(() => {
    if (selectedTags.length > 0 && activeCharacter && !doesCharacterMatchTags(activeCharacter)) {
      const matchingCharacter = characters.find(c => doesCharacterMatchTags(c));
      if (matchingCharacter) {
        setActiveCharacter(matchingCharacter.id);
      }
    }
  }, [selectedTags]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar 
        onCreateCharacter={handleCreateCharacter}
        onEditCharacter={handleEditCharacter}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        onReturnHome={handleReturnToLanding}
      />

      <div className="flex-1 flex flex-col h-full bg-background relative z-10">
        {activeCharacter ? (
          doesCharacterMatchTags(activeCharacter) ? (
            <ChatInterface 
              character={activeCharacter}
              onReturn={handleReturnToLanding}
            />
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
            title="Welcome to LumeAI"
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
