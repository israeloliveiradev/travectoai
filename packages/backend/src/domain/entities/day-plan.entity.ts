import { Activity } from './activity.entity.js';

export interface DayPlanProps {
  dayNumber: number;
  date: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  dayCostEstimate: number;
}

export class DayPlan {
  readonly dayNumber: number;
  readonly date: string;
  readonly theme: string;
  readonly morning: Activity[];
  readonly afternoon: Activity[];
  readonly evening: Activity[];
  readonly dayCostEstimate: number;

  constructor(props: DayPlanProps) {
    this.dayNumber = props.dayNumber;
    this.date = props.date;
    this.theme = props.theme;
    this.morning = props.morning;
    this.afternoon = props.afternoon;
    this.evening = props.evening;
    this.dayCostEstimate = props.dayCostEstimate;
  }

  getAllActivities(): Activity[] {
    return [...this.morning, ...this.afternoon, ...this.evening];
  }
}

