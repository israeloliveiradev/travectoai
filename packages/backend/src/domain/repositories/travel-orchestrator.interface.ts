import { DestinationPreference } from '../entities/destination-preference.entity.js';
import { DocumentCitation, Itinerary } from '../entities/itinerary.entity.js';
import { WeatherToolOutput } from '../../infrastructure/mcp/tools/weather-forecast.tool.js';
import { CurrencyToolOutput } from '../../infrastructure/mcp/tools/currency-exchange.tool.js';

export type OrchestrationStepName =
  | 'collect_preferences'
  | 'retrieve_context'
  | 'call_mcp_tools'
  | 'synthesize_itinerary'
  | 'completed';

export type StepStatus = 'started' | 'in_progress' | 'completed' | 'failed';

interface BaseStepEvent<S extends OrchestrationStepName, D = unknown> {
  step: S;
  status: StepStatus;
  message: string;
  timestamp: string;
  data?: D;
}

export type CollectPreferencesStepEvent = BaseStepEvent<
  'collect_preferences',
  { preferences?: DestinationPreference }
>;

export type RetrieveContextStepEvent = BaseStepEvent<
  'retrieve_context',
  { citations?: DocumentCitation[] }
>;

export type CallMcpToolsStepEvent = BaseStepEvent<
  'call_mcp_tools',
  { weather?: WeatherToolOutput | null; currency?: CurrencyToolOutput | null }
>;

export type SynthesizeItineraryStepEvent = BaseStepEvent<
  'synthesize_itinerary',
  { itinerary?: Itinerary }
>;

export type CompletedStepEvent = BaseStepEvent<
  'completed',
  { itineraryId?: string }
>;

export type OrchestrationStepEvent =
  | CollectPreferencesStepEvent
  | RetrieveContextStepEvent
  | CallMcpToolsStepEvent
  | SynthesizeItineraryStepEvent
  | CompletedStepEvent;

export type StepCallback = (event: OrchestrationStepEvent) => void;

export interface ITravelOrchestrator {
  orchestrate(
    preferences: DestinationPreference,
    onStep?: StepCallback
  ): Promise<Itinerary>;
}
