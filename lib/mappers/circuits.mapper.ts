import { getMeetingsByYear } from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import type { CircuitListItem } from "@/types/circuit";

type OpenF1Meeting = Awaited<ReturnType<typeof getMeetingsByYear>>[number];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value: string) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function resolveCircuitVisual(meeting: OpenF1Meeting) {
  const values = [
    meeting.meeting_name,
    meeting.location,
    meeting.country_name,
    meeting.circuit_short_name,
  ].map(normalizeText);

  return (
    circuitVisuals.find((visual) =>
      visual.aliases.some((alias) =>
        values.some((value) => value.includes(normalizeText(alias)))
      )
    ) ?? null
  );
}

function buildFallbackId(meeting: OpenF1Meeting) {
  return slugify(meeting.circuit_short_name || meeting.location || meeting.meeting_name);
}

function buildDisplayName(meeting: OpenF1Meeting, visualName?: string) {
  if (visualName) {
    return visualName;
  }

  if (meeting.circuit_short_name?.trim()) {
    return meeting.circuit_short_name;
  }

  return meeting.meeting_name;
}

export async function getCircuitsListData(): Promise<CircuitListItem[]> {
  const currentYear = new Date().getUTCFullYear();

  const [currentMeetings, previousMeetings] = await Promise.all([
    getMeetingsByYear(currentYear),
    getMeetingsByYear(currentYear - 1),
  ]);

  const completedMeetings = [...currentMeetings, ...previousMeetings]
    .filter((meeting) => new Date(meeting.date_end).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() - new Date(a.date_end).getTime()
    );

  const latestByCircuit = new Map<string, OpenF1Meeting>();

  for (const meeting of completedMeetings) {
    const visual = resolveCircuitVisual(meeting);
    const circuitId = visual?.id ?? buildFallbackId(meeting);

    if (!latestByCircuit.has(circuitId)) {
      latestByCircuit.set(circuitId, meeting);
    }
  }

  return Array.from(latestByCircuit.entries())
    .map(([circuitId, meeting]) => {
      const visual = resolveCircuitVisual(meeting);

      return {
        id: circuitId,
        name: buildDisplayName(meeting, visual?.name),
        country: meeting.country_name,
        location: meeting.location,
        type: visual?.type,
        layoutLabel: visual?.layoutLabel,
        layoutImage: visual?.layoutImage,
        lastMeetingName: meeting.meeting_name,
        year: meeting.year,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}