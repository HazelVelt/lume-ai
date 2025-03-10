
import React from 'react';
import { Bot } from 'lucide-react';

const GettingStartedSection: React.FC = () => {
  return (
    <div className="mt-8 glass-morphism p-6 rounded-lg animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Bot className="mr-2 h-5 w-5 text-accent1" />
        Getting Started
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Requirements</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="min-w-5 text-accent1 mr-2">•</div>
              <span>
                <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                  Ollama
                </a> 
                {" "}running locally for text generation
              </span>
            </li>
            <li className="flex items-start">
              <div className="min-w-5 text-accent1 mr-2">•</div>
              <span>
                <a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:underline">
                  Stability AI
                </a> 
                {" "}API key for image generation (optional)
              </span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Quick Start</h4>
          <ol className="space-y-2 text-sm list-decimal pl-5">
            <li>Create your first character using the sidebar</li>
            <li>Customize their personality traits and appearance</li>
            <li>Start chatting with your new AI companion</li>
            <li>Use the settings panel to configure your LLM preferences</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedSection;
