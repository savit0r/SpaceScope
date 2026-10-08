import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { ALL_CELESTIAL_BODIES } from '../../data/planets';
import { useSelection } from '../../context/SelectionContext';
import type { CelestialBody } from '../../types/planet';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Search Navigation Component
 * 
 * Spacecraft navigation system search per design.md §30:
 * - Placeholder: "Search planets, moons, missions..."
 * - Structured categories (Planets, Asteroids, Missions)
 * - Keyboard navigation (Esc to close)
 * - Direct selection and camera travel
 */
export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectPlanet } = useSelection();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

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

  const trimmed = query.trim().toLowerCase();

  // Matched celestial bodies (Planets & Asteroids)
  const matchingBodies = ALL_CELESTIAL_BODIES.filter((p) => {
    if (!trimmed) return true;
    return (
      p.name.toLowerCase().includes(trimmed) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(trimmed)) ||
      p.type.toLowerCase().includes(trimmed)
    );
  });

  // Matched missions
  const matchingMissions: Array<{ missionName: string; planet: CelestialBody; agency: string; year: string }> = [];
  if (trimmed) {
    ALL_CELESTIAL_BODIES.forEach((planet) => {
      planet.missions?.forEach((m) => {
        if (
          m.name.toLowerCase().includes(trimmed) ||
          m.agency.toLowerCase().includes(trimmed) ||
          m.type.toLowerCase().includes(trimmed)
        ) {
          matchingMissions.push({
            missionName: m.name,
            planet,
            agency: m.agency,
            year: m.year,
          });
        }
      });
    });
  }

  const handleSelectPlanet = (planet: CelestialBody) => {
    selectPlanet(planet);
    onClose();
  };

  return (
    <div className="search-backdrop ui-interactive" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-input-wrapper">
          <SearchIcon className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search planets, moons, missions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search solar system objects"
          />
          {query ? (
            <button
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear query"
            >
              <X />
            </button>
          ) : (
            <span className="search-kbd-hint">ESC to close</span>
          )}
        </div>

        {/* Search Results */}
        <div className="search-results-list">
          {matchingBodies.length > 0 && (
            <div className="search-category">
              <span className="search-category-title">Celestial Bodies</span>
              <div className="search-items">
                {matchingBodies.map((planet) => (
                  <button
                    key={planet.id}
                    className="search-result-item"
                    onClick={() => handleSelectPlanet(planet)}
                  >
                    <span
                      className="search-item-dot"
                      style={{ backgroundColor: planet.visualProperties.color }}
                    />
                    <div className="search-item-info">
                      <span className="search-item-name">{planet.name}</span>
                      <span className="search-item-sub">
                        {planet.subtitle || planet.type.toUpperCase()}
                      </span>
                    </div>
                    <ArrowRight className="search-item-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingMissions.length > 0 && (
            <div className="search-category">
              <span className="search-category-title">Spacecraft Missions</span>
              <div className="search-items">
                {matchingMissions.map((item, idx) => (
                  <button
                    key={`${item.missionName}-${idx}`}
                    className="search-result-item"
                    onClick={() => handleSelectPlanet(item.planet)}
                  >
                    <div className="search-item-info">
                      <span className="search-item-name">{item.missionName}</span>
                      <span className="search-item-sub">
                        {item.agency} • {item.year} • Target: {item.planet.name}
                      </span>
                    </div>
                    <ArrowRight className="search-item-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingBodies.length === 0 && matchingMissions.length === 0 && (
            <div className="search-empty-state">
              No matching celestial bodies or spacecraft missions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
