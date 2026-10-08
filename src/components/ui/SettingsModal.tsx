import React, { useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import type { ScaleMode, QualityMode } from '../../types/simulation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings Modal Component
 * 
 * Instrument calibration panel per design.md §8, §23, §24, §35:
 * - Scale Mode: Real vs Visual scale
 * - Orbit Lines toggle
 * - Visual Quality presets
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    scaleMode,
    setScaleMode,
    showOrbits,
    setShowOrbits,
    showAsteroids,
    setShowAsteroids,
    quality,
    setQuality,
  } = useSimulation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="settings-backdrop ui-interactive" onClick={onClose}>
      <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">Instrument Settings</h2>
            <p className="modal-subtitle">Simulation scale, rendering & display options</p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close settings"
            title="Close"
          >
            <X />
          </button>
        </div>

        <div className="settings-content">
          {/* Section: Distance Scaling (§24) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span className="setting-name">Scale Mode</span>
              <span className="setting-badge">{scaleMode.toUpperCase()}</span>
            </div>
            <p className="setting-desc">
              {scaleMode === 'visual'
                ? 'Visual Scale compresses interplanetary voids so all 8 planets remain visible together.'
                : 'Real Scale positions planets at scientifically proportional Astronomical Units (AU).'}
            </p>
            <div className="toggle-segment">
              <button
                className={`segment-btn ${scaleMode === 'visual' ? 'active' : ''}`}
                onClick={() => setScaleMode('visual' as ScaleMode)}
              >
                Visual (Compressed)
              </button>
              <button
                className={`segment-btn ${scaleMode === 'real' ? 'active' : ''}`}
                onClick={() => setScaleMode('real' as ScaleMode)}
              >
                Real Scale (AU)
              </button>
            </div>
          </div>

          {/* Section: Orbit Paths (§18, §23) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span className="setting-name">Orbital Trajectories</span>
              <button
                className={`toggle-switch-btn ${showOrbits ? 'active' : ''}`}
                onClick={() => setShowOrbits(!showOrbits)}
                aria-label="Toggle orbital lines"
              >
                {showOrbits ? <Eye /> : <EyeOff />}
                {showOrbits ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <p className="setting-desc">
              Thin Keplerian orbital guide rings for each planetary body.
            </p>
          </div>

          {/* Section: Asteroid Belt (NASA Eyes on Asteroids) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span className="setting-name">Asteroid Belt & NEOs</span>
              <button
                className={`toggle-switch-btn ${showAsteroids ? 'active' : ''}`}
                onClick={() => setShowAsteroids(!showAsteroids)}
                aria-label="Toggle asteroid belt"
              >
                {showAsteroids ? <Eye /> : <EyeOff />}
                {showAsteroids ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <p className="setting-desc">
              1,800 Keplerian main belt bodies and major asteroids (Ceres, Vesta, Psyche, Bennu).
            </p>
          </div>

          {/* Section: Render Quality (§35) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span className="setting-name">Render Quality</span>
              <span className="setting-badge">{quality.toUpperCase()}</span>
            </div>
            <p className="setting-desc">
              Adaptive WebGL shader antialiasing and procedural texture resolution.
            </p>
            <div className="quality-pill-row">
              {(['auto', 'high', 'medium', 'low'] as QualityMode[]).map((q) => (
                <button
                  key={q}
                  className={`pill-btn ${quality === q ? 'active' : ''}`}
                  onClick={() => setQuality(q)}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
