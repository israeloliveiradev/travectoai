import { DestinationPreference } from '../../domain/entities/destination-preference.entity.js';
import { Itinerary } from '../../domain/entities/itinerary.entity.js';
import {
  ITravelOrchestrator,
  StepCallback,
} from '../../domain/repositories/travel-orchestrator.interface.js';

export interface GenerateItineraryCommand {
  preferences: DestinationPreference;
  onStep?: StepCallback;
}

export class GenerateItineraryUseCase {
  constructor(private readonly orchestrator: ITravelOrchestrator) {}

  async execute(command: GenerateItineraryCommand): Promise<Itinerary> {
    return this.orchestrator.orchestrate(command.preferences, command.onStep);
  }
}

