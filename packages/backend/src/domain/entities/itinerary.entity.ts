import { Budget } from '../value-objects/budget.vo.js';
import { DateRange } from '../value-objects/date-range.vo.js';
import { DayPlan } from './day-plan.entity.js';

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

export interface ItineraryProps {
  id: string;
  title: string;
  destination: string;
  dateRange: DateRange;
  budget: Budget;
  days: DayPlan[];
  weatherInfo: WeatherInfo;
  currencyConversion: CurrencyConversionInfo;
  citations: DocumentCitation[];
  totalEstimatedCost: number;
  summary: string;
  createdAt?: Date;
}

export class Itinerary {
  readonly id: string;
  readonly title: string;
  readonly destination: string;
  readonly dateRange: DateRange;
  readonly budget: Budget;
  readonly days: DayPlan[];
  readonly weatherInfo: WeatherInfo;
  readonly currencyConversion: CurrencyConversionInfo;
  readonly citations: DocumentCitation[];
  readonly totalEstimatedCost: number;
  readonly summary: string;
  readonly createdAt: Date;

  constructor(props: ItineraryProps) {
    this.id = props.id;
    this.title = props.title;
    this.destination = props.destination;
    this.dateRange = props.dateRange;
    this.budget = props.budget;
    this.days = props.days;
    this.weatherInfo = props.weatherInfo;
    this.currencyConversion = props.currencyConversion;
    this.citations = props.citations;
    this.totalEstimatedCost = props.totalEstimatedCost;
    this.summary = props.summary;
    this.createdAt = props.createdAt || new Date();
  }
}

