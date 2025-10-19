'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useCaseStore } from '@/components/providers/case-store-provider';
import {
  AIReport,
  CaseRecord,
  MedicationEntry,
  CaseStatus,
} from '@/lib/types';

interface CaseFormState {
  studentName: string;
  studentBatch: string;
  patientCode: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  ward: string;
  admissionDate: string;
  admissionNumber: string;
  chiefComplaints: string;
  history: string;
  comorbidities: string;
  diagnoses: string;
  medications: MedicationEntry[];
  analysisPotentialIssues: string;
  analysisRationale: string;
  analysisInterventions: string;
  followOutcome: string;
  followRemarks: string;
}

const createBlankMedication = (): MedicationEntry => ({
  name: '',
  strength: '',
  dose: '',
  route: '',
  frequency: '',
  duration: '',
});

const initialState: CaseFormState = {
  studentName: '',
  studentBatch: '',
  patientCode: '',
  age: '',
  gender: 'male',
  ward: '',
  admissionDate: '',
  admissionNumber: '',
  chiefComplaints: '',
  history: '',
  comorbidities: '',
  diagnoses: '',
  medications: [createBlankMedication()],
  analysisPotentialIssues: '',
  analysisRationale: '',
  analysisInterventions: '',
  followOutcome: '',
  followRemarks: '',
};

const statusAfterSubmit: CaseStatus = 'submitted';

function generateId(): string {
  try {
    if (typeof globalThis !== 'undefined') {
      const anyGlobal = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
      if (anyGlobal.crypto?.randomUUID) {
        return anyGlobal.crypto.randomUUID();
      }
    }
  } catch {}
  const randomHex = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `${Date.now().toString(36)}-${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
}

function createEmptyAIReport(): AIReport {
  return {
    interactions: [],
    doseIssues: [],
    missingInfo: [],
    meta: {
      generatedAt: new Date().toISOString(),
      model: 'ai-disabled',
      latencyMs: 0,
    },
  };
}

function parseList(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CaseForm() {
  const { addCase } = useCaseStore();
  const [formState, setFormState] = useState<CaseFormState>(initialState);
  const [latestReport, setLatestReport] = useState<AIReport | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [geminiKey, setGeminiKey] = useState('');

  // Persist Gemini API key locally
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('pharmacheck.geminiApiKey');
      if (saved) setGeminiKey(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem('pharmacheck.geminiApiKey', geminiKey);
    } catch {}
  }, [geminiKey]);

  const steps = [
    { key: 'context', title: 'Student & Case Context' },
    { key: 'basics', title: 'Patient Basics' },
    { key: 'narrative', title: 'Clinical Narrative' },
    { key: 'meds', title: 'Medications' },
    { key: 'analysis', title: 'Student Analysis' },
    { key: 'follow', title: 'Follow Up & Submit' },
  ] as const;

  const parsedMedications = useMemo(
    () => formState.medications.filter((med) => med.name.trim().length > 0),
    [formState.medications]
  );

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationEntry,
    value: string
  ) => {
    setFormState((prev) => {
      const copy = [...prev.medications];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, medications: copy };
    });
  };

  const addMedicationRow = () => {
    setFormState((prev) => ({
      ...prev,
      medications: [...prev.medications, createBlankMedication()],
    }));
  };

  const removeMedicationRow = (index: number) => {
    setFormState((prev) => {
      if (prev.medications.length === 1) {
        return prev;
      }
      return {
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = (): string[] => {
    const issues: string[] = [];
    if (!formState.studentName.trim()) {
      issues.push('Student name is required.');
    }
    if (!formState.studentBatch.trim()) {
      issues.push('Student batch is required.');
    }
    if (!formState.patientCode.trim()) {
      issues.push('Patient code is required.');
    }
    if (!formState.chiefComplaints.trim()) {
      issues.push('Chief complaints are required.');
    }
    if (!formState.history.trim()) {
      issues.push('History section cannot be empty.');
    }
    if (!formState.admissionDate.trim()) {
      issues.push('Admission date is required.');
    }

    const age = Number.parseInt(formState.age, 10);
    if (Number.isNaN(age) || age < 0) {
      issues.push('Patient age must be a valid number.');
    }

    if (parsedMedications.length === 0) {
      issues.push('At least one medication entry is required.');
    }

    parsedMedications.forEach((med, index) => {
      if (!med.dose.trim()) {
        issues.push(`Dose is missing for medication #${index + 1}.`);
      }
      if (!med.frequency.trim()) {
        issues.push(`Frequency is missing for medication #${index + 1}.`);
      }
    });

    return issues;
  };

  const validateStep = (stepIndex: number): string[] => {
    const issues: string[] = [];
    switch (stepIndex) {
      case 0: {
        if (!formState.studentName.trim()) issues.push('Student name is required.');
        if (!formState.studentBatch.trim()) issues.push('Student batch is required.');
        if (!formState.patientCode.trim()) issues.push('Patient code is required.');
        return issues;
      }
      case 1: {
        const age = Number.parseInt(formState.age, 10);
        if (Number.isNaN(age) || age < 0) issues.push('Patient age must be a valid number.');
        if (!formState.admissionDate.trim()) issues.push('Admission date is required.');
        return issues;
      }
      case 2: {
        if (!formState.chiefComplaints.trim()) issues.push('Chief complaints are required.');
        if (!formState.history.trim()) issues.push('History section cannot be empty.');
        return issues;
      }
      case 3: {
        if (parsedMedications.length === 0) issues.push('At least one medication entry is required.');
        parsedMedications.forEach((med, index) => {
          if (!med.dose.trim()) issues.push(`Dose is missing for medication #${index + 1}.`);
          if (!med.frequency.trim()) issues.push(`Frequency is missing for medication #${index + 1}.`);
        });
        return issues;
      }
      case 4: {
        // Analysis fields are optional in MVP; no blocking validation here
        return issues;
      }
      case 5: {
        // Follow-up optional in MVP
        return issues;
      }
      default:
        return issues;
    }
  };

  const handleNext = () => {
    const issues = validateStep(currentStep);
    if (issues.length > 0) {
      setFormErrors(issues);
      return;
    }
    setFormErrors([]);
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => {
    setFormErrors([]);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    const issues = validateForm();
    if (issues.length > 0) {
      setFormErrors(issues);
      setIsSubmitting(false);
      return;
    }

    if (!geminiKey) {
      setFormErrors(['Enter your Gemini API key to run AI check, or Save without AI.']);
      setIsSubmitting(false);
      return;
    }

    const age = Number.parseInt(formState.age, 10);
    const diagnoses = parseList(formState.diagnoses);
    const comorbidities = parseList(formState.comorbidities);

    try {
      const response = await fetch('/api/ai/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gemini-api-key': geminiKey },
        body: JSON.stringify({
          patientAge: age,
          patientConditions: comorbidities,
          medications: parsedMedications,
          notes: formState.analysisRationale,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error ?? 'AI check failed');
      }

      const aiReport = (await response.json()) as AIReport;

      const timestamp = new Date().toISOString();
      const newCase: CaseRecord = {
        id: generateId(),
        studentName: formState.studentName.trim(),
        studentBatch: formState.studentBatch.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
        status: statusAfterSubmit,
        patient: {
          patientCode: formState.patientCode.trim(),
          age,
          gender: formState.gender,
          ward: formState.ward.trim(),
          admissionDate: formState.admissionDate,
          admissionNumber: formState.admissionNumber.trim(),
        },
        chiefComplaints: formState.chiefComplaints.trim(),
        history: formState.history.trim(),
        diagnoses,
        medications: parsedMedications,
        analysis: {
          potentialIssues: formState.analysisPotentialIssues.trim(),
          rationale: formState.analysisRationale.trim(),
          interventions: formState.analysisInterventions.trim(),
        },
        followUp: {
          outcome: formState.followOutcome.trim(),
          remarks: formState.followRemarks.trim(),
        },
        aiReport,
      };

      addCase(newCase);
      setLatestReport(aiReport);
      setFormErrors([]);
      setSuccessMessage('Case saved locally and AI feedback recorded.');
      setFormState(initialState);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to run AI check. Please try again.';
      setFormErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveWithoutAI = () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setFormErrors([]);

    const age = Number.parseInt(formState.age, 10);
    const diagnoses = parseList(formState.diagnoses);
    const comorbidities = parseList(formState.comorbidities);

    const timestamp = new Date().toISOString();
    const newCase: CaseRecord = {
      id: generateId(),
      studentName: formState.studentName.trim(),
      studentBatch: formState.studentBatch.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      status: statusAfterSubmit,
      patient: {
        patientCode: formState.patientCode.trim(),
        age: Number.isNaN(age) ? 0 : age,
        gender: formState.gender,
        ward: formState.ward.trim(),
        admissionDate: formState.admissionDate,
        admissionNumber: formState.admissionNumber.trim(),
      },
      chiefComplaints: formState.chiefComplaints.trim(),
      history: formState.history.trim(),
      diagnoses,
      medications: parsedMedications,
      analysis: {
        potentialIssues: formState.analysisPotentialIssues.trim(),
        rationale: formState.analysisRationale.trim(),
        interventions: formState.analysisInterventions.trim(),
      },
      followUp: {
        outcome: formState.followOutcome.trim(),
        remarks: formState.followRemarks.trim(),
      },
      aiReport: createEmptyAIReport(),
    };

    addCase(newCase);
    setLatestReport(null);
    setSuccessMessage('Case saved locally.');
    setFormState(initialState);
    setIsSubmitting(false);
  };

  return (
    <section className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Log a Patient Case</h1>
        <p className="text-sm text-gray-500">
          Capture patient details, prescriptions, and receive instant AI feedback. All data is stored locally in your browser for this MVP.
        </p>
      </header>

      {/* AI Settings */}
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Gemini API Key</p>
            <p className="text-xs text-gray-500">Required to enable AI safety checks on save.</p>
          </div>
          <input
            type="password"
            placeholder="Enter your Gemini API key"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            className="w-full max-w-md rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Stepper */}
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {steps.map((step, index) => (
          <li
            key={step.key}
            className={`flex items-center justify-center rounded-md border px-2 py-2 text-xs sm:text-[11px] ${
              index === currentStep
                ? 'border-black bg-black text-white'
                : index < currentStep
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            {index + 1}. {step.title}
          </li>
        ))}
      </ol>

      {formErrors.length > 0 && (
        <div className="rounded-md border border-red-400 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Please review the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {formErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="rounded-md border border-green-400 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {currentStep === 0 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Student & Case Context</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span>Student Name</span>
              <input
                type="text"
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.studentName}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, studentName: event.target.value }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Batch / Rotation</span>
              <input
                type="text"
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.studentBatch}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, studentBatch: event.target.value }))
                }
                required
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span>Patient Code (anonymised)</span>
              <input
                type="text"
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.patientCode}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, patientCode: event.target.value }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Ward / Unit</span>
              <input
                type="text"
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.ward}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, ward: event.target.value }))
                }
              />
            </label>
          </div>
        </section>
        )}

        {currentStep === 1 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Patient Basics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              <span>Age</span>
              <input
                type="number"
                min={0}
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.age}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, age: event.target.value }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Gender</span>
              <select
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.gender}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, gender: event.target.value as CaseFormState['gender'] }))
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Admission Date</span>
              <input
                type="date"
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.admissionDate}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, admissionDate: event.target.value }))
                }
                required
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm md:max-w-sm">
            <span>Admission Number</span>
            <input
              type="text"
              className="rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.admissionNumber}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, admissionNumber: event.target.value }))
              }
            />
          </label>
        </section>
        )}

        {currentStep === 2 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Clinical Narrative</h2>
          <label className="flex flex-col gap-2 text-sm">
            <span>Chief Complaints</span>
            <textarea
              className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.chiefComplaints}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, chiefComplaints: event.target.value }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>History & Observations</span>
            <textarea
              className="h-28 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.history}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, history: event.target.value }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Comorbidities / Conditions (comma or newline separated)</span>
            <textarea
              className="h-20 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.comorbidities}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, comorbidities: event.target.value }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Diagnosis (comma or newline separated)</span>
            <textarea
              className="h-20 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.diagnoses}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, diagnoses: event.target.value }))
              }
            />
          </label>
        </section>
        )}

        {currentStep === 3 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Prescribed Medications</h2>
            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={addMedicationRow}
            >
              Add Medication
            </button>
          </div>
          <div className="space-y-4">
            {formState.medications.map((medication, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-md border border-gray-200 p-4 md:grid-cols-6"
              >
                <label className="flex flex-col gap-2 text-xs md:text-sm md:col-span-2">
                  <span>Drug Name</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    value={medication.name}
                    onChange={(event) =>
                      handleMedicationChange(index, 'name', event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs md:text-sm">
                  <span>Strength</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    value={medication.strength}
                    onChange={(event) =>
                      handleMedicationChange(index, 'strength', event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs md:text-sm">
                  <span>Dose</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    value={medication.dose}
                    onChange={(event) =>
                      handleMedicationChange(index, 'dose', event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs md:text-sm">
                  <span>Route</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    value={medication.route}
                    onChange={(event) =>
                      handleMedicationChange(index, 'route', event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs md:text-sm">
                  <span>Frequency</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    value={medication.frequency}
                    onChange={(event) =>
                      handleMedicationChange(index, 'frequency', event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs md:text-sm">
                  <span>Duration</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2"
                      value={medication.duration}
                      onChange={(event) =>
                        handleMedicationChange(index, 'duration', event.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium hover:bg-gray-100"
                      onClick={() => removeMedicationRow(index)}
                      disabled={formState.medications.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>
        )}

        {currentStep === 4 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Student Analysis</h2>
          <label className="flex flex-col gap-2 text-sm">
            <span>Potential Issues Detected</span>
            <textarea
              className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.analysisPotentialIssues}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  analysisPotentialIssues: event.target.value,
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Rationality of Therapy</span>
            <textarea
              className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.analysisRationale}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  analysisRationale: event.target.value,
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Suggested Interventions</span>
            <textarea
              className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={formState.analysisInterventions}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  analysisInterventions: event.target.value,
                }))
              }
            />
          </label>
        </section>
        )}

        {currentStep === 5 && (
        <section className="grid gap-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Follow Up</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span>Outcome Summary</span>
              <textarea
                className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.followOutcome}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, followOutcome: event.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Remarks / Monitoring</span>
              <textarea
                className="h-24 rounded-md border border-gray-200 bg-white px-3 py-2"
                value={formState.followRemarks}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, followRemarks: event.target.value }))
                }
              />
            </label>
          </div>
        </section>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-md border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-gray-100"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
            >
              Next
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveWithoutAI}
                className="rounded-md border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save without AI'}
              </button>
              <button
                type="submit"
                className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || !geminiKey}
                title={geminiKey ? '' : 'Enter Gemini API key to enable AI'}
              >
                {isSubmitting ? 'Saving...' : 'Run AI Check & Save'}
              </button>
            </div>
          )}
        </div>
      </form>

      {latestReport && (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <header>
            <h2 className="text-xl font-semibold">AI Feedback</h2>
            <p className="text-xs text-gray-500">
              Generated {new Date(latestReport.meta.generatedAt).toLocaleString()} · {latestReport.meta.model}
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Interactions
              </h3>
              {latestReport.interactions.length === 0 ? (
                <p className="text-sm text-gray-500">No interactions flagged.</p>
              ) : (
                <ul className="space-y-3">
                  {latestReport.interactions.map((interaction, index) => (
                    <li key={`${interaction.drugs.join('-')}-${index}`} className="rounded-md border border-gray-200 bg-white p-3 text-sm">
                      <p className="font-medium capitalize">{interaction.drugs.join(' + ')}</p>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Severity: {interaction.severity}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed">{interaction.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Dose Issues
                </h3>
                {latestReport.doseIssues.length === 0 ? (
                  <p className="text-sm text-gray-500">No dose issues detected.</p>
                ) : (
                  <ul className="space-y-3">
                    {latestReport.doseIssues.map((issue, index) => (
                      <li key={`${issue.drug}-${index}`} className="rounded-md border border-gray-200 bg-white p-3 text-sm">
                        <p className="font-medium">{issue.drug}</p>
                        <p className="mt-1 text-sm leading-relaxed">{issue.issue}</p>
                        <p className="text-xs text-gray-500">Recommendation: {issue.recommendation}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Missing Information
                </h3>
                {latestReport.missingInfo.length === 0 ? (
                  <p className="text-sm text-gray-500">All critical data points captured.</p>
                ) : (
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {latestReport.missingInfo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
