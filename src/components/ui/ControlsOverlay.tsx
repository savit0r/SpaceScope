import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Scale,
  Clock,
  MousePointer,
  Move,
  ZoomIn,
  Search,
  Settings,
  Disc,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useSelection } from '../../context/SelectionContext';
import { useComparison } from '../../context/ComparisonContext';
import { PlanetDetailPanel } from './PlanetDetailPanel';
import { PlanetComparisonModal } from './PlanetComparisonModal';
import { SearchModal } from './SearchModal';
import { SettingsModal } from './SettingsModal';
import { simulatedDaysToDate, formatSimulatedDate } from '../../utils/timeline';

export const ControlsOverlay: React.FC = () => {
  const {
    isPlaying,
    speed,
    simulatedDays,
    scaleMode,
    showAsteroids,
    setShowAsteroids,
    togglePlay,
    setSpeed,
    setSimulatedDays,
    resetSimulation,
  } = useSimulation();

  const { selectedPlanet, resetCamera } = useSelection();
  const { toggleComparison, isOpen: isComparisonOpen } = useComparison();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const speedOptions = [1, 5, 10, 30, 60];
  const currentDate = simulatedDaysToDate(simulatedDays);

  return (
    <div className="ui-layer">
      {/* Top Header — minimal branding + utility controls (§8) */}
      <header className="header-bar">
        <div
          className="brand ui-interactive"
          onClick={resetCamera}
          title="Reset camera to system overview"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              resetCamera();
            }
          }}
        >
          <img src="/logo.svg" alt="SpaceScope Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">SpaceScope</span>
            <span className="brand-subtitle">Solar System Explorer</span>
          </div>
        </div>

        <div className="header-right-actions">
          {/* Search Button (§30) */}
          <button
            className="utility-btn ui-interactive"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search planets and missions"
            title="Search planets, moons, and missions"
          >
            <Search />
            <span>Search</span>
          </button>

          {/* Settings Button (§8, §35) */}
          <button
            className="utility-btn ui-interactive"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings and scale mode"
            title="Calibrate scale, orbits, and quality"
          >
            <Settings />
            <span>Settings</span>
          </button>

          {/* Compare toggle */}
          <button
            className={`utility-btn ui-interactive ${isComparisonOpen ? 'active' : ''}`}
            onClick={toggleComparison}
            aria-label="Toggle Planet Comparison"
            title="Compare two planets side-by-side"
          >
            <Scale />
            <span>Compare</span>
          </button>

          {/* Asteroid Belt toggle (NASA Eyes) */}
          <button
            className={`utility-btn ui-interactive ${showAsteroids ? 'active' : ''}`}
            onClick={() => setShowAsteroids(!showAsteroids)}
            aria-label="Toggle Asteroids"
            title="Toggle Asteroid Belt & Major Asteroids (NASA Eyes)"
          >
            <Disc />
            <span>Asteroids</span>
          </button>

          {/* Scale mode indicator badge (§24) */}
          <div
            className="scale-badge ui-interactive"
            onClick={() => setIsSettingsOpen(true)}
            title="Click to toggle Scale Mode in Settings"
          >
            <span className="scale-indicator" />
            <span className="scale-text">{scaleMode.toUpperCase()} SCALE</span>
          </div>

          {/* Date display */}
          <div className="date-display ui-interactive">
            <Clock />
            <span className="date-value">{formatSimulatedDate(currentDate)}</span>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <PlanetComparisonModal />

      {/* Footer — Controls left, Planet info right (§7, §23) */}
      <footer className="footer-layout">
        {/* Simulation Controls */}
        <div className="controls-panel ui-interactive">
          <div className="controls-panel-header">
            <span className="controls-panel-title">Timeline</span>
          </div>

          {/* Timeline Scrubber */}
          <div className="timeline-scrubber">
            <div className="scrubber-header">
              <span className="scrubber-label">5-Year Range</span>
              <span className="scrubber-days">+{Math.round(simulatedDays)}d</span>
            </div>
            <input
              type="range"
              min={0}
              max={1825}
              step={1}
              value={Math.round(simulatedDays)}
              onChange={(e) => setSimulatedDays(Number(e.target.value))}
              className="timeline-slider"
              aria-label="Timeline scrubber"
            />
          </div>

          {/* Play / Pause / Reset */}
          <div className="btn-group">
            <button
              className={`ctrl-btn ${isPlaying ? 'active' : ''}`}
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause /> : <Play />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              className="ctrl-btn"
              onClick={resetSimulation}
              title="Reset to Jan 1, 2026"
            >
              <RotateCcw />
              Reset
            </button>
          </div>

          {/* Speed selector */}
          <div className="speed-selector">
            <span className="speed-label">Speed</span>
            <div className="speed-pills">
              {speedOptions.map((option) => (
                <button
                  key={option}
                  className={`pill-btn ${speed === option ? 'active' : ''}`}
                  onClick={() => setSpeed(option)}
                >
                  {option}×
                </button>
              ))}
            </div>
          </div>

          {/* Camera reset */}
          <button
            className="ctrl-btn"
            style={{ width: '100%' }}
            onClick={resetCamera}
          >
            <Video />
            Reset View
          </button>

          {/* Navigation hints */}
          <div className="nav-controls">
            <span className="nav-controls-title">Navigation</span>
            <div className="controls-list">
              <div className="control-item">
                <span className="control-key">
                  <MousePointer /> Click Planet
                </span>
                <span className="control-action">Select</span>
              </div>
              <div className="control-item">
                <span className="control-key">
                  <Move /> Drag
                </span>
                <span className="control-action">Orbit</span>
              </div>
              <div className="control-item">
                <span className="control-key">
                  <ZoomIn /> Scroll
                </span>
                <span className="control-action">Zoom</span>
              </div>
            </div>
          </div>

          <div className="disclaimer">
            Educational Model — Circular Keplerian Mean Anomaly
          </div>
        </div>

        {/* Planet Information Panel (§9, §29, §42) */}
        {selectedPlanet && <PlanetDetailPanel />}
      </footer>
    </div>
  );
};
