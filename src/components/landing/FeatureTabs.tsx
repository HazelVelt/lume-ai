
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Pencil, Settings } from 'lucide-react';
import FeatureTab from './FeatureTab';

const FeatureTabs: React.FC = () => {
  const chatFeatures = [
    {
      icon: MessageCircle,
      text: 'Chat with characters that respond based on their unique personality traits'
    },
    {
      icon: MessageCircle,
      text: 'Persistent conversations are saved locally for your privacy'
    },
    {
      icon: MessageCircle,
      text: 'Uses your local language model for complete privacy and ownership'
    }
  ];

  const customizationFeatures = [
    {
      icon: Pencil,
      text: 'Adjust personality traits like humor, intelligence, creativity, and more'
    },
    {
      icon: Pencil,
      text: 'Generate custom character images with Stability AI integration'
    },
    {
      icon: Pencil,
      text: 'Create detailed backstories to shape your character\'s responses'
    }
  ];

  const managementFeatures = [
    {
      icon: Settings,
      text: 'Switch between different LLM providers and models'
    },
    {
      icon: Settings,
      text: 'Dark and light theme support'
    },
    {
      icon: Settings,
      text: 'Organize and manage all your AI characters'
    }
  ];

  const chatVisual = (
    <div className="glass-morphism p-4 rounded-lg max-w-md">
      <div className="chat-bubble flex items-start mb-3">
        <div className="bg-secondary p-3 rounded-lg mr-5 ml-auto">
          <p className="text-sm">Hello, how are you today?</p>
        </div>
      </div>
      <div className="chat-bubble flex items-start">
        <div className="bg-accent1/20 p-3 rounded-lg ml-0">
          <p className="text-sm">I'm feeling creative and witty today! What would you like to chat about?</p>
        </div>
      </div>
    </div>
  );

  const customizationVisual = (
    <div className="relative">
      <div className="glass-morphism rounded-lg p-4 max-w-md">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Creativity</h4>
          <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div className="bg-accent1 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Intelligence</h4>
          <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div className="bg-accent1 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Humor</h4>
          <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div className="bg-accent1 h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const managementVisual = (
    <div className="glass-morphism p-4 rounded-lg max-w-md flex flex-col gap-2">
      <div className="flex justify-between items-center p-2 rounded bg-secondary/20">
        <span className="font-medium">Language Model</span>
        <span className="text-sm">Ollama / Mistral</span>
      </div>
      <div className="flex justify-between items-center p-2 rounded bg-secondary/20">
        <span className="font-medium">Image Generation</span>
        <span className="text-sm">Stability AI</span>
      </div>
      <div className="flex justify-between items-center p-2 rounded bg-secondary/20">
        <span className="font-medium">Theme</span>
        <span className="text-sm">System Default</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="chat" className="data-[state=active]:bg-accent1/20">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chatting
          </TabsTrigger>
          <TabsTrigger value="customize" className="data-[state=active]:bg-accent1/20">
            <Pencil className="mr-2 h-4 w-4" />
            Customization
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-accent1/20">
            <Settings className="mr-2 h-4 w-4" />
            Management
          </TabsTrigger>
        </TabsList>
        
        <FeatureTab 
          value="chat" 
          title="Engaging Conversations" 
          features={chatFeatures} 
          visual={chatVisual} 
        />
        
        <FeatureTab 
          value="customize" 
          title="Deep Customization" 
          features={customizationFeatures} 
          visual={customizationVisual} 
        />
        
        <FeatureTab 
          value="manage" 
          title="Easy Management" 
          features={managementFeatures} 
          visual={managementVisual} 
        />
      </Tabs>
    </div>
  );
};

export default FeatureTabs;
