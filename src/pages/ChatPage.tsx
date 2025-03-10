
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterEditor from '@/components/CharacterEditor';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import ChatNavigation from '@/components/ChatNavigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Tag, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, activeCharacter, setActiveCharacter, deleteCharacter } = useCharacter();
  const [editingCharacter, setEditingCharacter] = useState(null);
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
  }, [id, characters]);

  // Get all unique tags from characters
  const allTags = [...new Set(characters.flatMap(char => char.tags || []))];

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
        {allTags.length > 0 && (
          <div className="px-4 py-2 border-b flex items-center overflow-x-auto scrollbar-none bg-background/70 backdrop-blur-sm">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {allTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
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
          <div className="flex items-center justify-center h-full p-4">
            <div className="glass-morphism p-8 rounded-xl text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">Select a Character</h2>
              <p className="text-muted-foreground mb-6">
                Choose an existing character from the sidebar or create a new one to start chatting.
              </p>
              <button 
                onClick={handleCreateCharacter}
                className="bg-accent1 hover:bg-accent1/80 text-white px-4 py-2 rounded-md"
              >
                Create New Character
              </button>
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

export default ChatPage;
