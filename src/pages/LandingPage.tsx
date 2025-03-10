
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Wand2, Users, Bot, Heart } from 'lucide-react';
import Header from '@/components/Header';
import SettingsPanel from '@/components/SettingsPanel';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleCreateCharacter = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background/95 to-accent/5">
      <Header 
        activeCharacter={null} 
        onReturnHome={() => {}} 
        onSettingsOpen={() => setIsSettingsOpen(true)} 
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto glass-morphism p-6 md:p-10 rounded-xl border border-white/20 shadow-xl text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent1/30 to-accent1/10 rounded-full flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-accent1" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent1 to-primary bg-clip-text text-transparent">
              Your AI Companions
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Create, customize, and chat with unique AI characters that respond based on their personality traits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleCreateCharacter}
              size="lg"
              className="bg-accent1 hover:bg-accent1/80 text-white"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-12">
          <FeatureCard 
            icon={<Wand2 className="h-6 w-6 text-accent1" />}
            title="Customizable Characters"
            description="Adjust personality traits, appearance, and backstory to create the perfect companion"
          />
          <FeatureCard 
            icon={<MessageSquare className="h-6 w-6 text-accent1" />}
            title="Natural Conversations"
            description="Enjoy fluid, context-aware chats powered by advanced language models"
          />
          <FeatureCard 
            icon={<Heart className="h-6 w-6 text-accent1" />}
            title="Personal & Private"
            description="All characters and conversations stay on your device for complete privacy"
          />
        </div>
        
        {/* Getting Started */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="glass-morphism p-6 rounded-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-center">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2">•</div>
                    <span>
                      <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                        Ollama
                      </a> 
                      {" "}running locally for text generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2">•</div>
                    <span>
                      <a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                        Stability AI
                      </a> 
                      {" "}API key for image generation (optional)
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Quick Start</h3>
                <ol className="space-y-2 text-sm list-decimal pl-5">
                  <li>Create your first character using the sidebar</li>
                  <li>Customize their personality traits and appearance</li>
                  <li>Start chatting with your new AI companion</li>
                  <li>Use the settings panel to configure your preferences</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>AI Haven - Your Personal AI Companion Space</p>
      </footer>
      
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-morphism p-5 rounded-lg border border-white/10 hover:border-accent1/20 transition-all">
    <div className="w-12 h-12 bg-accent1/10 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default LandingPage;
