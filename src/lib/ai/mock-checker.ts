import { AIReport, AIRequestPayload, AIDoseIssue, AIInteractionInsight } from '@/lib/types';

interface KnownInteraction {
  drugs: string[];
  severity: 'low' | 'moderate' | 'high';
  description: string;
}

const KNOWN_INTERACTIONS: KnownInteraction[] = [
  {
    drugs: ['ibuprofen', 'metformin'],
    severity: 'moderate',
    description:
      'Combined use may reduce renal perfusion. Consider monitoring kidney function, especially in renally impaired patients.',
  },
  {
    drugs: ['aspirin', 'warfarin'],
    severity: 'high',
    description:
      'Dual anticoagulation increases bleeding risk. Ensure clear indication and monitor INR and bleeding signs closely.',
  },
  {
    drugs: ['azithromycin', 'hydroxychloroquine'],
    severity: 'moderate',
    description: 'Both agents can prolong QT interval. Baseline ECG and electrolyte monitoring are recommended.',
  },
];

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function findKnownInteractions(medications: AIRequestPayload['medications']): AIInteractionInsight[] {
  const names = medications.map((med) => normalise(med.name));
  const interactions: AIInteractionInsight[] = [];

  for (const interaction of KNOWN_INTERACTIONS) {
    if (interaction.drugs.every((drug) => names.includes(drug))) {
      interactions.push({
        drugs: interaction.drugs,
        severity: interaction.severity,
        description: interaction.description,
      });
    }
  }

  const seen = new Map<string, number>();
  medications.forEach((med) => {
    const key = normalise(med.name);
    seen.set(key, (seen.get(key) ?? 0) + 1);
  });

  for (const [drug, count] of seen.entries()) {
    if (count > 1) {
      interactions.push({
        drugs: [drug],
        severity: 'low',
        description: 'Duplicate therapy detected. Verify that duplicate entries are intentional.',
      });
    }
  }

  return interactions;
}

function findDoseFlags(medications: AIRequestPayload['medications'], patientAge: number): AIDoseIssue[] {
  const issues: AIDoseIssue[] = [];

  medications.forEach((med) => {
    const normalisedName = normalise(med.name);

    if (patientAge >= 65 && normalisedName.includes('zopiclone')) {
      issues.push({
        drug: med.name,
        issue: 'Sedative in an older adult',
        recommendation: 'Review need for zopiclone in patients ≥65 years; consider non-pharmacologic sleep hygiene first.',
      });
    }

    const numericStrength = parseFloat(med.strength);
    if (!Number.isNaN(numericStrength) && numericStrength > 1000) {
      issues.push({
        drug: med.name,
        issue: 'Unusually high stated strength',
        recommendation: 'Double-check the prescribed strength; values above 1000 mg often require divided doses.',
      });
    }
  });

  return issues;
}

export function generateMockAIReport(payload: AIRequestPayload): AIReport {
  const startedAt = performance.now?.() ?? Date.now();
  const interactions = findKnownInteractions(payload.medications);
  const doseIssues = findDoseFlags(payload.medications, payload.patientAge);

  const missingInfo: string[] = [];
  if (!payload.notes || payload.notes.trim().length === 0) {
    missingInfo.push('Clinical notes not provided. Include rationale or monitoring plan.');
  }
  if (!payload.patientConditions.length) {
    missingInfo.push('No comorbidities recorded. Confirm if the patient has notable history.');
  }

  const finishedAt = performance.now?.() ?? Date.now();

  return {
    interactions,
    doseIssues,
    missingInfo,
    meta: {
      generatedAt: new Date().toISOString(),
      model: 'gemini-2.5-flash (stubbed)',
      latencyMs: Math.max(0, Math.round((finishedAt - startedAt) * 100) / 100),
    },
  };
}
