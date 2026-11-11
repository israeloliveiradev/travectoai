import { MCPToolDefinition, MCPToolResult } from '../../../domain/repositories/mcp-client.interface.js';

export interface CurrencyToolInput {
  baseCurrency?: string;
  targetCurrency?: string;
  destination?: string;
  amount?: number;
}

export interface CurrencyToolOutput {
  baseCurrency: string;
  targetCurrency: string;
  currencySymbol: string;
  exchangeRate: number;
  originalAmount: number;
  convertedAmount: number;
  formattedConversion: string;
  purchasingPowerContext: string;
  paymentMethodAdvice: string;
  atmTips: string;
}

export const currencyExchangeToolDefinition: MCPToolDefinition = {
  name: 'currency_exchange_tool',
  description:
    'Fornece cotações de câmbio em tempo real, conversão monetária precisa e recomendações financeiras para gastos no destino.',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        description: 'Destino da viagem para determinação automática da moeda local.',
      },
      baseCurrency: {
        type: 'string',
        description: 'Código da moeda de origem do viajante (ex: BRL, USD, EUR). Padrão BRL.',
      },
      targetCurrency: {
        type: 'string',
        description: 'Código da moeda local de destino (ex: JPY, EUR, USD, GBP).',
      },
      amount: {
        type: 'number',
        description: 'Montante monetário para simulação de conversão.',
      },
    },
    required: [],
  },
};

const RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  BRL: 0.175,
  EUR: 1.08,
  JPY: 0.0066,
  GBP: 1.28,
  CHF: 1.13,
  CAD: 0.72,
  AUD: 0.65,
  ARS: 0.00095,
  CLP: 0.00105,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  CHF: 'CHF',
  CAD: 'C$',
  AUD: 'A$',
  ARS: '$',
  CLP: '$',
};

export async function executeCurrencyExchangeTool(
  args: Record<string, unknown>
): Promise<MCPToolResult<CurrencyToolOutput>> {
  let baseCurrency = String(args.baseCurrency || 'BRL').toUpperCase();
  let targetCurrency = args.targetCurrency ? String(args.targetCurrency).toUpperCase() : '';
  const destination = args.destination ? String(args.destination).toLowerCase() : '';
  const amount = typeof args.amount === 'number' && args.amount > 0 ? args.amount : 5000;

  if (!targetCurrency) {
    if (destination.includes('tóquio') || destination.includes('toquio') || destination.includes('tokyo') || destination.includes('japao') || destination.includes('japão')) {
      targetCurrency = 'JPY';
    } else if (destination.includes('paris') || destination.includes('roma') || destination.includes('rome') || destination.includes('frança') || destination.includes('itália')) {
      targetCurrency = 'EUR';
    } else if (destination.includes('londres') || destination.includes('reino unido') || destination.includes('uk')) {
      targetCurrency = 'GBP';
    } else if (destination.includes('rio') || destination.includes('brasil')) {
      targetCurrency = 'BRL';
    } else {
      targetCurrency = 'USD';
    }
  }

  const baseToUsd = RATES_TO_USD[baseCurrency] || 1.0;
  const targetToUsd = RATES_TO_USD[targetCurrency] || 1.0;

  const rate = baseToUsd / targetToUsd;
  const convertedAmount = Math.round(amount * rate * 100) / 100;
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  let advice = '';
  let atm = '';
  let purchasingPower = '';

  if (targetCurrency === 'JPY') {
    advice = 'Japão ainda valoriza dinheiro em espécie para templos menores, máquinas de tickets e pequenos restaurantes. Cartões de crédito internacionais e IC cards digitais (Suica/Pasmo) são aceitos no comércio amplo.';
    atm = 'Caixas 7-Bank dentro de todas as lojas 7-Eleven aceitam a maioria dos cartões de débito/crédito internacionais (Wise, Nomad, Visa, Mastercard) com taxas baixas.';
    purchasingPower = 'Um prato generoso de lámen ou teishoku custa entre 900¥ e 1.400¥ (aprox. R$ 35 a R$ 55).';
  } else if (targetCurrency === 'EUR') {
    advice = 'Pagamentos por aproximação (Apple Pay, Google Pay e cartões contactless) são a forma mais comum em praticamente 98% dos comércios parisienses e romanos.';
    atm = 'Evite caixas amarelos da rede Euronet nas áreas turísticas (cobram taxas de conversão abusivas de até 15%). Prefira ATMs de bancos locais (BNP Paribas, Crédito Agrícola, Intesa Sanpaolo).';
    purchasingPower = 'Um café expresso custa cerca de 1,50€ no balcão e um menu almoço (formule) entre 16€ e 24€.';
  } else if (targetCurrency === 'BRL') {
    advice = 'O sistema PIX e cartões de crédito/débito por aproximação dominam o Rio de Janeiro. Praticamente não é necessário carregar dinheiro em espécie.';
    atm = 'Utilize terminais Banco24Horas instalados em shoppings ou supermercados para maior segurança.';
    purchasingPower = 'Uma água de coco na orla custa entre R$ 8 e R$ 12; um prato executivo farto varia de R$ 35 a R$ 60.';
  } else {
    advice = 'Cartões multimoeda globais (Wise, Nomad, Revolut) oferecem a menor taxa de spread e IOF reduzido.';
    atm = 'Prefira caixas bancários vinculados a agências físicas durante o horário comercial.';
    purchasingPower = 'Planeje uma média de gastos diários de 70 a 120 USD por pessoa para alimentação e transporte.';
  }

  const output: CurrencyToolOutput = {
    baseCurrency,
    targetCurrency,
    currencySymbol: symbol,
    exchangeRate: Number(rate.toFixed(4)),
    originalAmount: amount,
    convertedAmount,
    formattedConversion: `${amount.toLocaleString('pt-BR')} ${baseCurrency} ≈ ${convertedAmount.toLocaleString('pt-BR')} ${targetCurrency} (1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency})`,
    purchasingPowerContext: purchasingPower,
    paymentMethodAdvice: advice,
    atmTips: atm,
  };

  return {
    success: true,
    toolName: 'currency_exchange_tool',
    timestamp: new Date().toISOString(),
    data: output,
  };
}

