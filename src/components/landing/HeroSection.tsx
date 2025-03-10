
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Stars } from 'lucide-react';

interface HeroSectionProps {
  onCreateCharacter: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCreateCharacter }) => {
  return (
    <div className="w-full py-10 bg-gradient-to-br from-background via-background/95 to-accent1/10">
      <div className="text-center px-4 w-full max-w-4xl mx-auto">
        <div className="glass-morphism p-6 rounded-xl border border-white/20 shadow-xl">
          <div className="inline-block p-3 rounded-full bg-accent1/20 mb-4">
            <Stars className="h-8 w-8 text-accent1" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gradient animate-fade-in mb-4">
            Welcome to AI Haven
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: "0.1s" }}>
            Your personal space for creating and chatting with unique AI companions
          </p>
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              onClick={onCreateCharacter}
              className="bg-accent1 hover:bg-accent1/80 text-white"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
