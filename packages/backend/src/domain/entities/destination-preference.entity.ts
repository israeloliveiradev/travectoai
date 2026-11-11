import { Budget } from '../value-objects/budget.vo.js';
import { DateRange } from '../value-objects/date-range.vo.js';
import { TravelStyle } from '../value-objects/travel-style.vo.js';

export interface DestinationPreferenceProps {
  destination: string;
  days: number;
  budget: Budget;
  style: TravelStyle;
  travelersCount: number;
  specialInterests: string[];
  departureDate?: Date;
}

export class DestinationPreference {
  readonly destination: string;
  readonly days: number;
  readonly budget: Budget;
  readonly style: TravelStyle;
  readonly travelersCount: number;
  readonly specialInterests: string[];
  readonly dateRange: DateRange;

  constructor(props: DestinationPreferenceProps) {
    if (!props.destination || props.destination.trim().length === 0) {
      throw new Error('O destino de viagem é obrigatório.');
    }
    if (props.days < 1 || props.days > 30) {
      throw new Error('O número de dias deve estar entre 1 e 30.');
    }
    if (props.travelersCount < 1) {
      throw new Error('O número de viajantes deve ser pelo menos 1.');
    }

    this.destination = props.destination.trim();
    this.days = props.days;
    this.budget = props.budget;
    this.style = props.style;
    this.travelersCount = props.travelersCount;
    this.specialInterests = props.specialInterests;
    this.dateRange = DateRange.fromDays(this.days, props.departureDate || new Date());
  }
}

