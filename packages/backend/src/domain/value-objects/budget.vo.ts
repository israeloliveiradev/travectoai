export type BudgetTier = 'backpacker' | 'moderate' | 'luxury';

export interface BudgetProps {
  amount: number;
  currency: string;
  tier: BudgetTier;
}

export class Budget {
  readonly amount: number;
  readonly currency: string;
  readonly tier: BudgetTier;

  constructor(props: BudgetProps) {
    if (props.amount < 0) {
      throw new Error('O valor do orçamento não pode ser negativo.');
    }
    this.amount = props.amount;
    this.currency = props.currency.toUpperCase();
    this.tier = props.tier;
  }

  static create(amount: number, currency = 'BRL', tier?: BudgetTier): Budget {
    const determinedTier = tier || Budget.inferTier(amount, currency);
    return new Budget({ amount, currency, tier: determinedTier });
  }

  private static inferTier(amount: number, currency: string): BudgetTier {
    const normalizedAmount = currency === 'USD' ? amount * 5.5 : amount;
    if (normalizedAmount < 3000) return 'backpacker';
    if (normalizedAmount < 10000) return 'moderate';
    return 'luxury';
  }

  format(): string {
    return `${this.currency} ${this.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}

