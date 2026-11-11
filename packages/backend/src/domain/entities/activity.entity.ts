export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface TransitOption {
  walking?: {
    durationMin: number;
    distanceMeters: number;
  };
  metro?: {
    lineName: string;
    lineColor: string;
    durationMin: number;
  };
  rideshare?: {
    provider: string;
    durationMin: number;
    priceRangeLocal: string;
    priceRangeBase: string;
  };
}

export interface ActivityProps {
  id: string;
  title: string;
  description: string;
  location: string;
  timeSlot: TimeSlot;
  estimatedCost: number;
  category: string;
  localTip?: string;
  sourceCitations?: string[];
  coordinates?: { lat: number; lng: number };
  imageUrl?: string;
  suggestedDuration?: string;
  transitToNext?: TransitOption;
}

export class Activity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly timeSlot: TimeSlot;
  readonly estimatedCost: number;
  readonly category: string;
  readonly localTip?: string;
  readonly sourceCitations: string[];
  readonly coordinates?: { lat: number; lng: number };
  readonly imageUrl?: string;
  readonly suggestedDuration?: string;
  readonly transitToNext?: TransitOption;

  constructor(props: ActivityProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.location = props.location;
    this.timeSlot = props.timeSlot;
    this.estimatedCost = props.estimatedCost;
    this.category = props.category;
    this.localTip = props.localTip;
    this.sourceCitations = props.sourceCitations || [];
    this.coordinates = props.coordinates;
    this.imageUrl = props.imageUrl;
    this.suggestedDuration = props.suggestedDuration;
    this.transitToNext = props.transitToNext;
  }
}
