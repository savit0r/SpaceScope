import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { SelectionProvider } from './context/SelectionContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { SceneContainer } from './components/scene/SceneContainer';
import { ControlsOverlay } from './components/ui/ControlsOverlay';

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <SelectionProvider>
        <ComparisonProvider>
          <main>
            <SceneContainer />
            <ControlsOverlay />
          </main>
        </ComparisonProvider>
      </SelectionProvider>
    </SimulationProvider>
  );
};

export default App;
