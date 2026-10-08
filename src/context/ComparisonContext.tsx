import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ComparisonState } from '../types/comparison';

const ComparisonContext = createContext<ComparisonState | null>(null);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planetAId, setPlanetAId] = useState<string>('earth');
  const [planetBId, setPlanetBId] = useState<string>('mars');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openComparison = (aId?: string, bId?: string) => {
    if (aId) setPlanetAId(aId);
    if (bId) setPlanetBId(bId);
    setIsOpen(true);
  };

  const closeComparison = () => {
    setIsOpen(false);
  };

  const toggleComparison = () => {
    setIsOpen((prev) => !prev);
  };

  // Keyboard accessibility: Close comparison modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeComparison();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <ComparisonContext.Provider
      value={{
        planetAId,
        planetBId,
        isOpen,
        setPlanetAId,
        setPlanetBId,
        openComparison,
        closeComparison,
        toggleComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonState => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
