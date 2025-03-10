
import React from 'react';
import HeroSection from './landing/HeroSection';
import FeatureTabs from './landing/FeatureTabs';
import GettingStartedSection from './landing/GettingStartedSection';

interface LandingPageProps {
  onCreateCharacter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateCharacter }) => {
  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-none">
      {/* Hero Section */}
      <HeroSection onCreateCharacter={onCreateCharacter} />
      
      <div className="w-full max-w-5xl mx-auto px-4 py-10 overflow-y-auto scrollbar-none">  
        {/* Feature Tabs */}
        <FeatureTabs />
        
        {/* Requirements Section */}
        <GettingStartedSection />
      </div>
    </div>
  );
};

export default LandingPage;
