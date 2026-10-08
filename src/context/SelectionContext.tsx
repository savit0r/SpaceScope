import React, { createContext, useContext, useState } from 'react';
import type { CelestialBody } from '../types/planet';

interface SelectionContextValue {
  selectedPlanet: CelestialBody | null;
  selectPlanet: (planet: CelestialBody) => void;
  deselectPlanet: () => void;
  isCameraFocused: boolean;
  setIsCameraFocused: (focused: boolean) => void;
  focusPlanet: (planet: CelestialBody) => void;
  resetCamera: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialBody | null>(null);
  const [isCameraFocused, setIsCameraFocused] = useState<boolean>(false);

  const selectPlanet = (planet: CelestialBody) => {
    setSelectedPlanet(planet);
    setIsCameraFocused(true);
  };

  const deselectPlanet = () => {
    setSelectedPlanet(null);
    setIsCameraFocused(false);
  };

  const focusPlanet = (planet: CelestialBody) => {
    setSelectedPlanet(planet);
    setIsCameraFocused(true);
  };

  const resetCamera = () => {
    setSelectedPlanet(null);
    setIsCameraFocused(false);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedPlanet,
        selectPlanet,
        deselectPlanet,
        isCameraFocused,
        setIsCameraFocused,
        focusPlanet,
        resetCamera,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
