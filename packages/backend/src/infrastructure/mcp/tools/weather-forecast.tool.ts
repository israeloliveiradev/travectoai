import { MCPToolDefinition, MCPToolResult } from '../../../domain/repositories/mcp-client.interface.js';

export interface WeatherToolInput {
  destination: string;
  month?: number;
  durationDays?: number;
}

export interface WeatherToolOutput {
  destination: string;
  season: string;
  temperatureAverage: string;
  temperatureMin: number;
  temperatureMax: number;
  rainyDaysProbability: string;
  climateSummary: string;
  bestClothing: string;
  seasonalAlert?: string;
  uvIndex: string;
}

export const weatherForecastToolDefinition: MCPToolDefinition = {
  name: 'weather_forecast_tool',
  description:
    'Fornece previsão do tempo, sazonalidade climática, amplitude térmica e recomendações de vestuário para o destino informado.',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        description: 'Nome da cidade ou país de destino (ex: Tóquio, Paris, Rio de Janeiro, Roma).',
        required: true,
      },
      month: {
        type: 'number',
        description: 'Mês da viagem (1 a 12). Padrão é o mês atual.',
      },
      durationDays: {
        type: 'number',
        description: 'Quantidade de dias de permanência.',
      },
    },
    required: ['destination'],
  },
};

export async function executeWeatherForecastTool(
  args: Record<string, unknown>
): Promise<MCPToolResult<WeatherToolOutput>> {
  const destination = String(args.destination || 'Destino Global');
  const targetMonth = typeof args.month === 'number' ? args.month : new Date().getMonth() + 1;
  const duration = typeof args.durationDays === 'number' ? args.durationDays : 5;

  const destLower = destination.toLowerCase();

  let output: WeatherToolOutput;

  if (destLower.includes('tóquio') || destLower.includes('toquio') || destLower.includes('tokyo') || destLower.includes('japao') || destLower.includes('japão')) {
    const isSpring = targetMonth >= 3 && targetMonth <= 5;
    const isSummer = targetMonth >= 6 && targetMonth <= 8;
    const isAutumn = targetMonth >= 9 && targetMonth <= 11;

    output = {
      destination: 'Tóquio, Japão',
      season: isSpring ? 'Primavera (Sakura)' : isSummer ? 'Verão Úmido' : isAutumn ? 'Outono Dourado' : 'Inverno Frio e Seco',
      temperatureAverage: isSpring ? '16°C' : isSummer ? '29°C' : isAutumn ? '18°C' : '8°C',
      temperatureMin: isSpring ? 11 : isSummer ? 24 : isAutumn ? 12 : 3,
      temperatureMax: isSpring ? 21 : isSummer ? 34 : isAutumn ? 23 : 13,
      rainyDaysProbability: isSummer ? 'Alta (temporada de chuvas / tufões)' : isSpring ? 'Moderada (chuvas rápidas de primavera)' : 'Baixa (tempo ensolarado)',
      climateSummary: `Clima ${isSpring ? 'muito agradável com brisas suaves e pétalas de cerejeira' : isSummer ? 'quente e abafado com noites tropicais' : isAutumn ? 'fresco e límpido' : 'frio cristalino com excelente visibilidade do Monte Fuji'}.`,
      bestClothing: isSpring || isAutumn
        ? 'Casaco médio, camadas leves e sapatos confortáveis para caminhar mais de 15.000 passos/dia.'
        : isSummer
        ? 'Roupas ultraleves de algodão/linho, guarda-chuva com proteção UV e toalhinha de mão.'
        : 'Casaco térmico ou sobretudo de lã, cachecol e luvas para passeios noturnos.',
      seasonalAlert: isSummer ? 'Atenção à hidratação em julho e agosto; utilize as máquinas de venda automática em cada esquina.' : undefined,
      uvIndex: isSummer ? '8 (Muito Alto)' : '4 (Moderado)',
    };
  } else if (destLower.includes('paris') || destLower.includes('frança') || destLower.includes('franca')) {
    const isSummer = targetMonth >= 6 && targetMonth <= 8;
    const isWinter = targetMonth === 12 || targetMonth <= 2;

    output = {
      destination: 'Paris, França',
      season: isSummer ? 'Verão Europeu' : isWinter ? 'Inverno Parisiense' : 'Meia-estação',
      temperatureAverage: isSummer ? '24°C' : isWinter ? '5°C' : '15°C',
      temperatureMin: isSummer ? 16 : isWinter ? 2 : 9,
      temperatureMax: isSummer ? 31 : isWinter ? 9 : 20,
      rainyDaysProbability: 'Moderada (chuviscos intermitentes típicos parisienses)',
      climateSummary: 'Clima temperado oceânico. Dias ensolarados intercalados com céus cinzentos e chuvisco passageiro.',
      bestClothing: isSummer
        ? 'Vestuário casual elegante, óculos escuros e casaco leve para as noites ventiladas na beira do Sena.'
        : 'Sobretudo impermeável, bota confortável para calçadas de paralelepípedo e guarda-chuva compacto.',
      seasonalAlert: isSummer ? 'Agosto registra fechamento de pequenos comércios e bistrôs para férias coletivas.' : undefined,
      uvIndex: isSummer ? '6 (Alto)' : '2 (Baixo)',
    };
  } else if (destLower.includes('rio') || destLower.includes('janeiro') || destLower.includes('brasil')) {
    const isSummer = targetMonth >= 12 || targetMonth <= 3;

    output = {
      destination: 'Rio de Janeiro, Brasil',
      season: isSummer ? 'Alto Verão Tropical' : 'Inverno Agradável / Meia-estação',
      temperatureAverage: isSummer ? '32°C' : '23°C',
      temperatureMin: isSummer ? 23 : 18,
      temperatureMax: isSummer ? 39 : 28,
      rainyDaysProbability: isSummer ? 'Média (pancadas de chuva de fim de tarde)' : 'Baixa (estação mais seca e estável)',
      climateSummary: 'Clima tropical litorâneo quente com brisa marinha constante e alta incidência solar.',
      bestClothing: 'Roupas frescas, shorts, chinelos/tênis respiráveis, roupas de banho e boné/óculos escuros.',
      seasonalAlert: isSummer ? 'Sensação térmica pode superar 42°C em janeiro e fevereiro. Evite trilhas expostas entre 11h e 14h.' : undefined,
      uvIndex: '10+ (Extremo)',
    };
  } else if (destLower.includes('roma') || destLower.includes('rome') || destLower.includes('itália') || destLower.includes('italia')) {
    const isSummer = targetMonth >= 6 && targetMonth <= 8;

    output = {
      destination: 'Roma, Itália',
      season: isSummer ? 'Verão Mediterrâneo' : 'Clima Temperado Mediterrâneo',
      temperatureAverage: isSummer ? '31°C' : '16°C',
      temperatureMin: isSummer ? 20 : 8,
      temperatureMax: isSummer ? 36 : 22,
      rainyDaysProbability: isSummer ? 'Rara (tempo predominantemente seco e límpido)' : 'Moderada',
      climateSummary: 'Sol abundante e tempo seco durante quase todo o período.',
      bestClothing: 'Tecidos naturais de linho, chapéu e garrafa d’água reutilizável para abastecer nos nasoni históricos.',
      seasonalAlert: isSummer ? 'Proteja-se do sol forte ao caminhar pelas ruínas abertas do Fórum Romano.' : undefined,
      uvIndex: isSummer ? '8 (Muito Alto)' : '4 (Moderado)',
    };
  } else {
    output = {
      destination,
      season: 'Temporada Recomendada',
      temperatureAverage: '21°C',
      temperatureMin: 15,
      temperatureMax: 26,
      rainyDaysProbability: 'Baixa a Moderada',
      climateSummary: `Condições meteorológicas estáveis em ${destination} com boa visibilidade para passeios ao ar livre durante os ${duration} dias previstos.`,
      bestClothing: 'Vestuário em camadas inteligentes (estilo cebola), calçados amaciados para caminhada e capa de chuva leve preventiva.',
      uvIndex: '5 (Moderado)',
    };
  }

  return {
    success: true,
    toolName: 'weather_forecast_tool',
    timestamp: new Date().toISOString(),
    data: output,
  };
}

