import type { CircuitType } from "@/types/circuit";

export type CircuitVisual = {
  id: string;
  aliases: string[];
  name?: string;
  type?: CircuitType;
  layoutLabel?: string;
  layoutImage?: string;
};

export const circuitVisuals: CircuitVisual[] = [
  {
    id: "albert-park",
    aliases: ["albert park", "melbourne"],
    name: "Albert Park Circuit",
    type: "Callejero",
    layoutLabel: "Layout Melbourne",
    layoutImage: "/circuits/albert-park.png",
  },
  {
    id: "bahrain",
    aliases: ["bahrain", "sakhir"],
    name: "Bahrain International Circuit",
    type: "Permanente",
    layoutLabel: "Layout Sakhir",
    layoutImage: "/circuits/bahrain.png",
  },
  {
    id: "jeddah",
    aliases: ["jeddah", "jeddah corniche"],
    name: "Jeddah Corniche Circuit",
    type: "Callejero",
    layoutLabel: "Layout Jeddah",
  },
  {
    id: "suzuka",
    aliases: ["suzuka"],
    name: "Suzuka Circuit",
    type: "Permanente",
    layoutLabel: "Layout Suzuka",
  },
  {
    id: "imola",
    aliases: ["imola", "emilia-romagna"],
    name: "Autodromo Enzo e Dino Ferrari",
    type: "Permanente",
    layoutLabel: "Layout Imola",
  },
  {
    id: "monaco",
    aliases: ["monaco", "monte carlo"],
    name: "Circuit de Monaco",
    type: "Callejero",
    layoutLabel: "Layout Monaco",
    layoutImage: "/circuits/monaco.png",
  },
  {
    id: "silverstone",
    aliases: ["silverstone"],
    name: "Silverstone Circuit",
    type: "Permanente",
    layoutLabel: "Layout Silverstone",
  },
  {
    id: "spa",
    aliases: ["spa", "spa-francorchamps", "stavelot"],
    name: "Circuit de Spa-Francorchamps",
    type: "Permanente",
    layoutLabel: "Layout Spa",
  },
  {
    id: "monza",
    aliases: ["monza"],
    name: "Autodromo Nazionale Monza",
    type: "Permanente",
    layoutLabel: "Layout Monza",
    layoutImage: "/circuits/monza.png",
  },
  {
    id: "interlagos",
    aliases: ["interlagos", "sao paulo"],
    name: "Autódromo José Carlos Pace",
    type: "Permanente",
    layoutLabel: "Layout Interlagos",
  },
];