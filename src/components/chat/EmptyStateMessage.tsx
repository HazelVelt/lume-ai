
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkle, MessageCircle } from 'lucide-react';

interface EmptyStateMessageProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  clearTagsButton?: boolean;
  onClearTags?: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  clearTagsButton = false,
  onClearTags
}) => {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="relative max-w-md w-full">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 text-accent1/30">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,10 Q20,5 30,15 T50,20" stroke="currentColor" strokeWidth="2" />
            <path d="M5,20 Q15,25 25,15 T45,10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="absolute -bottom-6 -right-6 text-accent1/30">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,40 Q20,45 30,35 T50,30" stroke="currentColor" strokeWidth="2" />
            <path d="M5,30 Q15,25 25,35 T45,40" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="glass-morphism p-8 rounded-xl text-center rotate-1 border-2 border-dashed border-accent1/30 shadow-lg paper-texture">
          <div className="flex justify-center mb-4">
            {title.includes("Welcome") ? (
              <div className="relative">
                <Sparkle className="h-12 w-12 text-accent1 animate-pulse" />
                <div className="ripple-container">
                  <div className="ripple-circle"></div>
                  <div className="ripple-circle" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            ) : title.includes("No Matching") ? (
              <div className="rounded-full bg-secondary/40 p-3">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-full bg-accent1/20 p-3">
                <MessageCircle className="h-10 w-10 text-accent1" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2 sketch-underline inline-block">{title}</h2>
          
          <p className="text-muted-foreground mb-6 leading-relaxed artisanal-bubble">
            {description}
          </p>
          
          <div className="flex gap-3 justify-center">
            {clearTagsButton && onClearTags && (
              <Button 
                onClick={onClearTags}
                className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 hand-drawn-button shadow-secondary/20"
              >
                Clear Tags
              </Button>
            )}
            <Button 
              onClick={onButtonClick}
              className="bg-accent1 hover:bg-accent1/80 text-white px-4 py-2 hand-drawn-button shadow-accent1/20"
            >
              <Plus className="h-4 w-4 mr-1" />
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
