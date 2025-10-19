import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMockAIReport } from '@/lib/ai/mock-checker';
import { AIRequestPayload } from '@/lib/types';

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  strength: z.string().min(1, 'Medication strength is required'),
  dose: z.string().min(1, 'Dose information is required'),
  route: z.string().min(1, 'Route is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const requestSchema = z.object({
  patientAge: z.number().int().min(0).max(120),
  patientConditions: z.array(z.string().min(1)).default([]),
  medications: z.array(medicationSchema).min(1),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const parsedBody = requestSchema.safeParse(await request.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: 'Invalid payload',
        details: parsedBody.error.issues,
      },
      { status: 400 }
    );
  }

  const payload: AIRequestPayload = {
    patientAge: parsedBody.data.patientAge,
    patientConditions: parsedBody.data.patientConditions,
    medications: parsedBody.data.medications,
    notes: parsedBody.data.notes,
  };

  // TODO: If integrating real Gemini, call SDK using apiKey here; fallback to mock
  const report = generateMockAIReport(payload);

  return NextResponse.json(report);
}
