import { Annotation } from '@langchain/langgraph';
import { DestinationPreference } from '../../domain/entities/destination-preference.entity.js';
import { DocumentCitation, Itinerary } from '../../domain/entities/itinerary.entity.js';
import { WeatherToolOutput } from '../mcp/tools/weather-forecast.tool.js';
import { CurrencyToolOutput } from '../mcp/tools/currency-exchange.tool.js';

export interface RAGContextPayload {
  summary: string;
  citations: DocumentCitation[];
}

export const TravectoGraphAnnotation = Annotation.Root({
  preferences: Annotation<DestinationPreference | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  ragContext: Annotation<RAGContextPayload | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  mcpWeather: Annotation<WeatherToolOutput | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  mcpCurrency: Annotation<CurrencyToolOutput | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  itinerary: Annotation<Itinerary | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  currentStep: Annotation<string>({
    reducer: (_, next) => next,
    default: () => 'idle',
  }),
  stepLogs: Annotation<string[]>({
    reducer: (curr, next) => (next ? [...curr, ...next] : curr),
    default: () => [],
  }),
  error: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

export type TravectoStateType = typeof TravectoGraphAnnotation.State;

