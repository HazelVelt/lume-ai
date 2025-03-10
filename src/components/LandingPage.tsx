
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onCreateCharacter: () => void;
}

// This is now just a wrapper that redirects to the new LandingPage route
const LandingPage: React.FC<LandingPageProps> = ({ onCreateCharacter }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new LandingPage route
    navigate('/');
  }, [navigate]);
  
  // This component doesn't render anything as it immediately redirects
  return null;
};

export default LandingPage;
