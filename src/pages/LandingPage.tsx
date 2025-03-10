
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import FeatureTabs from '@/components/landing/FeatureTabs';
import GettingStartedSection from '@/components/landing/GettingStartedSection';
import Header from '@/components/Header';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCreateCharacter = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header activeCharacter={null} onReturnHome={() => {}} />
      <div className="flex flex-col h-full overflow-auto scrollbar-none">
        {/* Hero Section */}
        <HeroSection onCreateCharacter={handleCreateCharacter} />
        
        <div className="w-full max-w-5xl mx-auto px-4 py-10 overflow-y-auto scrollbar-none">  
          {/* Feature Tabs */}
          <FeatureTabs />
          
          {/* Requirements Section */}
          <GettingStartedSection />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
