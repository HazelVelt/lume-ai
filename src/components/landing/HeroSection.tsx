
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Stars } from 'lucide-react';

interface HeroSectionProps {
  onCreateCharacter: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCreateCharacter }) => {
  return (
    <div className="w-full py-8 bg-gradient-to-br from-background via-background/95 to-accent1/10">
      <div className="text-center px-4 w-full max-w-3xl mx-auto">
        <div className="glass-morphism p-5 rounded-xl border border-white/20 shadow-xl">
          <div className="inline-block p-2 rounded-full bg-accent1/20 mb-3">
            <Stars className="h-6 w-6 text-accent1" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gradient animate-fade-in mb-3">
            Welcome to AI Haven
          </h1>
          <p className="text-base md:text-lg text-muted-foreground animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: "0.1s" }}>
            Your personal space for creating and chatting with unique AI companions
          </p>
          <div className="mt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              onClick={onCreateCharacter}
              className="bg-accent1 hover:bg-accent1/80 text-white"
              size="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
