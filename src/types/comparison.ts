export interface ComparisonState {
  planetAId: string;
  planetBId: string;
  isOpen: boolean;
  setPlanetAId: (id: string) => void;
  setPlanetBId: (id: string) => void;
  openComparison: (planetAId?: string, planetBId?: string) => void;
  closeComparison: () => void;
  toggleComparison: () => void;
}
