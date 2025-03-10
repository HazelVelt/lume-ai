
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Wand2, Users, Bot, Heart, Sparkles, Palette, Star, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import SettingsPanel from '@/components/SettingsPanel';
import { useTheme } from '@/contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useTheme();
  
  const handleCreateCharacter = () => {
    navigate('/chat');
  };

  // Determine gradient class based on theme
  const getGradientClass = () => {
    switch (theme) {
      case 'dark': return 'landing-gradient-dark';
      case 'purple': return 'landing-gradient-purple';
      case 'ocean': return 'landing-gradient-ocean';
      case 'sunset': return 'landing-gradient-sunset';
      case 'emerald': return 'landing-gradient-emerald';
      case 'cherry': return 'landing-gradient-cherry';
      case 'midnight': return 'landing-gradient-midnight';
      default: return 'landing-gradient-light';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-background paper-texture ${getGradientClass()}`}>
      <Header 
        activeCharacter={null} 
        onReturnHome={() => {}} 
        onSettingsOpen={() => setIsSettingsOpen(true)} 
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto handcrafted-card p-6 md:p-10 border-2 border-dashed border-primary/30 shadow-accent1/20 transform rotate-0 mb-8">
          <div className="w-20 h-20 mx-auto bg-accent1/20 rounded-full flex items-center justify-center mb-4 border-2 border-accent1/40 rotate-3">
            <Bot className="h-10 w-10 text-accent1 animate-pulse-soft" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 sketch-underline">
            <span className="bg-gradient-to-r from-accent1 to-primary bg-clip-text text-transparent wavy-decoration">
              Your AI Companions
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 handcrafted-border border-accent1/10 p-4 rotate-1 bg-background/50">
            Create, customize, and chat with unique AI characters that respond based on their personality traits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleCreateCharacter}
              size="lg"
              className="hand-drawn-button shadow-accent1/40 bg-accent1 hover:bg-accent1/90 transform hover:-rotate-1 dark:text-black"
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse-soft" />
              Start Chatting
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-12">
          <FeatureCard 
            icon={<Wand2 className="h-6 w-6 text-accent1" />}
            title="Customizable Characters"
            description="Adjust personality traits, appearance, and backstory to create the perfect companion"
            rotation={-1}
          />
          <FeatureCard 
            icon={<MessageSquare className="h-6 w-6 text-accent1" />}
            title="Natural Conversations"
            description="Enjoy fluid, context-aware chats powered by advanced language models"
            rotation={1}
          />
          <FeatureCard 
            icon={<Heart className="h-6 w-6 text-accent1" />}
            title="Personal & Private"
            description="All characters and conversations stay on your device for complete privacy"
            rotation={-0.5}
          />
        </div>
        
        {/* Getting Started */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="handcrafted-card p-6 border-2 border-dashed border-primary/20 shadow-accent1/10 rotate-0.5">
            <h2 className="text-2xl font-bold mb-4 text-center sketch-underline inline-block">
              <Star className="inline-block mr-2 h-5 w-5 text-accent1" />
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-border/40 rounded-lg bg-background/60 rotate-[-0.5deg]">
                <h3 className="font-medium mb-2 wavy-decoration inline-block">Requirements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 animate-pulse-soft">✦</div>
                    <span>
                      <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                        Ollama
                      </a> 
                      {" "}running locally for text generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 animate-pulse-soft">✦</div>
                    <span>
                      <a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                        Stability AI
                      </a> 
                      {" "}API key for image generation (optional)
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border border-border/40 rounded-lg bg-background/60 rotate-[0.5deg]">
                <h3 className="font-medium mb-2 wavy-decoration inline-block">Quick Start</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 font-bold animate-pulse-soft">1.</div>
                    <span>Create your first character using the sidebar</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 font-bold animate-pulse-soft">2.</div>
                    <span>Customize their personality traits and appearance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 font-bold animate-pulse-soft">3.</div>
                    <span>Start chatting with your new AI companion</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-accent1 mr-2 font-bold animate-pulse-soft">4.</div>
                    <span>Use the settings panel to configure your preferences</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground handcrafted-border border-t-2 border-dashed border-primary/10 mt-8">
        <p className="sketch-underline inline-block">
          <Palette className="inline-block mr-2 h-4 w-4 text-accent1" />
          LumeAI - Your Personal AI Companion Space
        </p>
      </footer>
      
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  rotation = 0
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  rotation?: number 
}) => (
  <div 
    className="handcrafted-card p-5 border-2 border-dashed border-primary/20 hover:border-accent1/30 transition-all shadow-accent1/10"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <div className="w-12 h-12 bg-accent1/10 rounded-full flex items-center justify-center mb-4 border border-accent1/30">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 sketch-underline inline-block">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default LandingPage;
