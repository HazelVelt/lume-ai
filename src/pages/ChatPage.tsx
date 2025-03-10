
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/chat/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import Sidebar from '@/components/Sidebar';
import EmptyStateMessage from '@/components/chat/EmptyStateMessage';
import { Character } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter, isDeleting } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

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
    setCharacterToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCharacter = () => {
    if (characterToDelete && !isDeleting) {
      deleteCharacter(characterToDelete);
      setShowDeleteDialog(false);
      setCharacterToDelete(null);
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

  // Add decorative elements to create a handcrafted look
  const decorativeElements = (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Top-left corner flourish */}
      <svg className="absolute top-5 left-5 w-24 h-24 text-accent1/5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,10 Q30,5 50,10 T90,10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10,20 Q30,15 50,20 T90,20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10,30 Q30,25 50,30 T90,30" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      
      {/* Bottom-right corner flourish */}
      <svg className="absolute bottom-5 right-5 w-24 h-24 text-accent1/5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,70 Q30,65 50,70 T90,70" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10,80 Q30,75 50,80 T90,80" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10,90 Q30,85 50,90 T90,90" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDIwQzAgOC45NTQgOC45NTQgMCAyMCAwczIwIDguOTU0IDIwIDIwLTguOTU0IDIwLTIwIDIwUzAgMzEuMDQ2IDAgMjB6IiBmaWxsPSIjZmZmZmZmMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      {decorativeElements}
      
      <Sidebar 
        onCreateCharacter={handleCreateCharacter}
        onEditCharacter={handleEditCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        onReturnHome={handleReturnToLanding}
      />

      <div className={`flex-1 h-screen overflow-hidden bg-background relative z-10 ${!isSidebarCollapsed ? 'md:ml-[320px] md:w-[calc(100%-320px)]' : ''}`}>
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
            description="Create your first AI character and embark on a journey of endless conversations. Your imagination is the only limit!"
            buttonText="Create Your First Character"
            onButtonClick={handleCreateCharacter}
          />
        ) : (
          <EmptyStateMessage
            title="Select a Character"
            description="Choose an existing character from the sidebar or create a new one to start a unique conversation."
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

      {/* Confirmation dialog for deleting characters */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Character</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this character? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCharacter} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;
