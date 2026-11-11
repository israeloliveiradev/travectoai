import { Request, Response } from 'express';
import { GenerateItineraryUseCase } from '../../application/use-cases/generate-itinerary.use-case.js';
import { DestinationPreference } from '../../domain/entities/destination-preference.entity.js';
import { Budget } from '../../domain/value-objects/budget.vo.js';
import { TravelStyle } from '../../domain/value-objects/travel-style.vo.js';
import { GenerateItinerarySchema } from '../dtos/generate-itinerary.dto.js';

export class ItineraryController {
  constructor(private readonly generateUseCase: GenerateItineraryUseCase) {}

  async generate(req: Request, res: Response): Promise<void> {
    try {
      const parsed = GenerateItinerarySchema.parse(req.body);

      const budget = Budget.create(
        parsed.budget.amount,
        parsed.budget.currency,
        parsed.budget.tier
      );

      const style = TravelStyle.create(parsed.style.type, parsed.style.pace);

      const departureDate = parsed.departureDate
        ? new Date(parsed.departureDate)
        : new Date();

      const preferences = new DestinationPreference({
        destination: parsed.destination,
        days: parsed.days,
        budget,
        style,
        travelersCount: parsed.travelersCount,
        specialInterests: parsed.specialInterests,
        departureDate,
      });

      const itinerary = await this.generateUseCase.execute({ preferences });

      res.status(200).json({
        success: true,
        data: itinerary,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro interno do servidor';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async stream(req: Request, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const parsed = GenerateItinerarySchema.parse(req.body);

      const budget = Budget.create(
        parsed.budget.amount,
        parsed.budget.currency,
        parsed.budget.tier
      );

      const style = TravelStyle.create(parsed.style.type, parsed.style.pace);

      const departureDate = parsed.departureDate
        ? new Date(parsed.departureDate)
        : new Date();

      const preferences = new DestinationPreference({
        destination: parsed.destination,
        days: parsed.days,
        budget,
        style,
        travelersCount: parsed.travelersCount,
        specialInterests: parsed.specialInterests,
        departureDate,
      });

      sendEvent('status', {
        step: 'init',
        message: 'Iniciando pipeline de geração do Travecto...',
      });

      const itinerary = await this.generateUseCase.execute({
        preferences,
        onStep: (event) => {
          sendEvent('node_step', event);
        },
      });

      sendEvent('completed', {
        itinerary,
        message: 'Planejamento de viagem concluído!',
      });

      res.end();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro na orquestração';
      sendEvent('error', { error: message });
      res.end();
    }
  }
}

