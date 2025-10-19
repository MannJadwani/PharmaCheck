export type CaseStatus = 'draft' | 'submitted' | 'approved' | 'needs_revision';

export type FacultyDecision = 'approved' | 'needs_revision';

export interface PatientBasics {
  patientCode: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  ward: string;
  admissionDate: string; // ISO date string
  admissionNumber: string;
}

export interface MedicationEntry {
  name: string;
  strength: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
}

export interface CaseAnalysis {
  potentialIssues: string;
  rationale: string;
  interventions: string;
}

export interface FollowUpNotes {
  outcome: string;
  remarks: string;
}

export interface AIInteractionInsight {
  drugs: string[];
  severity: 'low' | 'moderate' | 'high';
  description: string;
}

export interface AIDoseIssue {
  drug: string;
  issue: string;
  recommendation: string;
}

export interface AIReport {
  interactions: AIInteractionInsight[];
  doseIssues: AIDoseIssue[];
  missingInfo: string[];
  meta: {
    generatedAt: string;
    model: string;
    latencyMs?: number;
  };
}

export interface FacultyFeedback {
  reviewer: string;
  decision: FacultyDecision;
  notes: string;
  reviewedAt: string;
}

export interface CaseRecord {
  id: string;
  studentName: string;
  studentBatch: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  patient: PatientBasics;
  chiefComplaints: string;
  history: string;
  diagnoses: string[];
  medications: MedicationEntry[];
  analysis: CaseAnalysis;
  followUp: FollowUpNotes;
  aiReport: AIReport;
  facultyFeedback?: FacultyFeedback;
}

export interface CaseSubmissionPayload {
  studentName: string;
  studentBatch: string;
  patient: PatientBasics;
  chiefComplaints: string;
  history: string;
  diagnoses: string[];
  medications: MedicationEntry[];
  analysis: CaseAnalysis;
  followUp: FollowUpNotes;
}

export interface AIRequestPayload {
  patientAge: number;
  patientConditions: string[];
  medications: MedicationEntry[];
  notes?: string;
}
