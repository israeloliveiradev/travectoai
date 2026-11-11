export interface DateRangeProps {
  startDate: Date;
  endDate: Date;
}

export class DateRange {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly durationInDays: number;

  constructor(props: DateRangeProps) {
    if (props.endDate < props.startDate) {
      throw new Error('A data final não pode ser anterior à data inicial.');
    }
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    this.durationInDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  }

  static fromDays(days: number, fromDate: Date = new Date()): DateRange {
    const end = new Date(fromDate);
    end.setDate(end.getDate() + Math.max(1, days) - 1);
    return new DateRange({ startDate: fromDate, endDate: end });
  }

  format(): string {
    const s = this.startDate.toLocaleDateString('pt-BR');
    const e = this.endDate.toLocaleDateString('pt-BR');
    return `${s} a ${e} (${this.durationInDays} dias)`;
  }
}

