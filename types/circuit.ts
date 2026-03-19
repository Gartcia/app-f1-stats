export type CircuitType = "Permanente" | "Callejero";

export type Circuit = {
  id: string;
  name: string;
  country: string;
  location: string;
  lengthKm: string;
  laps: number;
  type: CircuitType;
  firstGp: number;
  lapRecord: string;
  layoutLabel: string;
};