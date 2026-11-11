export type TravelStyleType =
  | 'cultural'
  | 'gastronomic'
  | 'adventure'
  | 'relax'
  | 'budget'
  | 'luxury'
  | 'family';

export type TravelPace = 'slow' | 'balanced' | 'fast';

export interface TravelStyleProps {
  type: TravelStyleType;
  pace: TravelPace;
  focusKeywords: string[];
}

export class TravelStyle {
  readonly type: TravelStyleType;
  readonly pace: TravelPace;
  readonly focusKeywords: string[];

  constructor(props: TravelStyleProps) {
    this.type = props.type;
    this.pace = props.pace;
    this.focusKeywords = props.focusKeywords;
  }

  static create(type: TravelStyleType = 'cultural', pace: TravelPace = 'balanced'): TravelStyle {
    const focusKeywordsMap: Record<TravelStyleType, string[]> = {
      cultural: ['museus', 'história', 'arquitetura', 'patrimônio', 'tradições locais'],
      gastronomic: ['restaurantes típicos', 'feiras de rua', 'degustações', 'mercados', 'vinhos/cafés'],
      adventure: ['natureza', 'trilhas', 'esportes', 'paisagens', 'atividades ao ar livre'],
      relax: ['praias', 'spas', 'parques', 'ritmo tranquilo', 'cafés charmosos'],
      budget: ['atrações gratuitas', 'transporte público', 'hostels', 'refeições econômicas'],
      luxury: ['alta gastronomia', 'experiências exclusivas', 'conforto', 'hotéis boutique'],
      family: ['parques temáticos', 'atividades interativas', 'segurança', 'acessibilidade'],
    };

    return new TravelStyle({
      type,
      pace,
      focusKeywords: focusKeywordsMap[type] || ['cultura', 'cidade'],
    });
  }
}

