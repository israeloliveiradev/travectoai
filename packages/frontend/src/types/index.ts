export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export type BudgetTier = 'backpacker' | 'moderate' | 'luxury';

export type TravelStyleType =
  | 'cultural'
  | 'gastronomic'
  | 'adventure'
  | 'relax'
  | 'budget'
  | 'luxury'
  | 'family';

export type TravelPace = 'slow' | 'balanced' | 'fast';

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  timeSlot: TimeSlot;
  estimatedCost: number;
  category: string;
  localTip?: string;
  sourceCitations: string[];
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  dayCostEstimate: number;
}

export interface WeatherInfo {
  destination: string;
  season: string;
  temperatureRange: string;
  advice: string;
  rainyProbability: string;
  bestClothing: string;
}

export interface CurrencyConversionInfo {
  baseCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  formattedConversion: string;
  practicalTip: string;
}

export interface DocumentCitation {
  source: string;
  chunkId: string;
  content: string;
  relevanceScore?: number;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  dateRange: {
    startDate: string;
    endDate: string;
    durationInDays: number;
  };
  budget: {
    amount: number;
    currency: string;
    tier: BudgetTier;
  };
  days: DayPlan[];
  weatherInfo: WeatherInfo;
  currencyConversion: CurrencyConversionInfo;
  citations: DocumentCitation[];
  totalEstimatedCost: number;
  summary: string;
  createdAt: string;
}

export interface TravelPreferenceFormValues {
  destination: string;
  days: number;
  budgetAmount: number;
  budgetCurrency: string;
  budgetTier?: BudgetTier;
  styleType: TravelStyleType;
  stylePace: TravelPace;
  travelersCount: number;
  specialInterests: string[];
  departureDate?: string;
}

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
  { preferences?: unknown }
>;

export type RetrieveContextStepEvent = BaseStepEvent<
  'retrieve_context',
  { citations?: DocumentCitation[] }
>;

export type CallMcpToolsStepEvent = BaseStepEvent<
  'call_mcp_tools',
  { weather?: unknown; currency?: unknown }
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

export interface IndexedDocument {
  id: string;
  title: string;
  destination: string;
  chunkCount: number;
  wordCount: number;
  createdAt: string;
  preview: string;
}

export interface ChunkCitation {
  chunkId: string;
  source: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; required?: boolean }>;
    required: string[];
  };
}

export interface MCPToolResult<T = unknown> {
  success: boolean;
  toolName: string;
  timestamp: string;
  data: T;
  error?: string;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  architecture: {
    style: string;
    agentOrchestrator: string;
    vectorEngine: string;
    mcpServer: string;
  };
  metrics: {
    rag: {
      indexedDocuments: number;
      totalChunks: number;
    };
    mcp: {
      registeredToolsCount: number;
      tools: string[];
    };
  };
}
