export type SessionTone =
  | "race"
  | "qualifying"
  | "sprint"
  | "shootout"
  | "practice"
  | "muted";

export function getSessionTone(sessionType: string): SessionTone {
  switch (sessionType.trim().toLowerCase()) {
    case "race":
      return "race";
    case "qualifying":
      return "qualifying";
    case "sprint":
      return "sprint";
    case "sprint shootout":
    case "sprint qualifying":
      return "shootout";
    case "fp1":
    case "fp2":
    case "fp3":
    case "practice 1":
    case "practice 2":
    case "practice 3":
      return "practice";
    default:
      return "muted";
  }
}