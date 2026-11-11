import { z } from 'zod';

export const GenerateItinerarySchema = z.object({
  destination: z.string().min(2, 'O destino deve ter pelo menos 2 caracteres.'),
  days: z.number().int().min(1).max(30).default(3),
  budget: z.object({
    amount: z.number().positive('O valor do orçamento deve ser positivo.'),
    currency: z.string().default('BRL'),
    tier: z.enum(['backpacker', 'moderate', 'luxury']).optional(),
  }),
  style: z.object({
    type: z.enum([
      'cultural',
      'gastronomic',
      'adventure',
      'relax',
      'budget',
      'luxury',
      'family',
    ]).default('cultural'),
    pace: z.enum(['slow', 'balanced', 'fast']).default('balanced'),
  }),
  travelersCount: z.number().int().min(1).default(1),
  specialInterests: z.array(z.string()).default([]),
  departureDate: z.string().optional(),
});

export type GenerateItineraryInput = z.infer<typeof GenerateItinerarySchema>;

