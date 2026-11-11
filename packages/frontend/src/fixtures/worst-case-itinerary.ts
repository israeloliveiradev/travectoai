import { Itinerary } from '../types/index.js';

export const WORST_CASE_ITINERARY: Itinerary = {
  id: 'worst-case-uuid-99999999-ffff-eeee-dddd-ccccbbbbaaaa',
  title: 'Roteiro Exclusivo Travecto: Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch & 斯瓦尔巴群岛 (Svalbard) [15 Dias com Orçamento Hiperdimensionado]',
  destination: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, Anglesey, País de Gales (Reino Unido) & Longyearbyen (Svalbard)',
  dateRange: {
    startDate: '2026-12-01T00:00:00.000Z',
    endDate: '2026-12-15T00:00:00.000Z',
    durationInDays: 15,
  },
  budget: {
    amount: 1489750.50,
    currency: 'BRL',
    tier: 'luxury',
  },
  weatherInfo: {
    destination: 'Longyearbyen, Svalbard & Anglesey, País de Gales',
    season: 'Noite Polar Ártica / Inverno Glacial Extremo (-32°C a -14°C) com Rajadas Árticas',
    temperatureRange: '-38°C a -8°C (Sensação térmica média de -44°C com ventos de até 95 km/h)',
    advice: 'Indispensável uso de quatro camadas térmicas técnicas com isolamento Primaloft/Pluma de Ganso 800-fill, balaclava de lã merino, óculos de nevasca polar e calçados certificados para gelo.',
    rainyProbability: 'Nevasca contínua (precipitação de neve pó e congelamento instantâneo)',
    bestClothing: 'Traje expedition-grade ártico integral com grampões (crampons) e sinalizador satelital Garmin inReach.',
  },
  currencyConversion: {
    baseCurrency: 'BRL',
    targetCurrency: 'NOK',
    exchangeRate: 1.8423,
    convertedAmount: 2744567.35,
    formattedConversion: '1.489.750,50 BRL ≈ 2.744.567,35 NOK (1 BRL = 1,8423 NOK)',
    practicalTip: 'A moeda norueguesa (NOK) é 100% digital em Longyearbyen; pagamentos em dinheiro vivo são ativamente recusados na quase totalidade dos comércios e postos polares. Cartões sem anuidade com spread zero recomendados.',
  },
  citations: [
    {
      source: 'Tratado de Spitsbergen & Manual de Sobrevivência Polar em Svalbard (Artigo 9, Parágrafo 3º)',
      chunkId: 'svalbard-polar-chk-001',
      content: 'É terminantemente proibido deixar o perímetro urbano seguro de Longyearbyen sem portar armamento de calibre mínimo .30-06 Springfield ou flare gun devidamente inspecionada pela Polícia Governatorial de Svalbard (Sysselmesteren) para defesa dissuasória contra Ursus maritimus.',
      relevanceScore: 0.9842,
    },
    {
      source: 'Regulamento Ferroviário da Estação de Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (Transport for Wales Rail Limited)',
      chunkId: 'wales-rail-chk-999',
      content: 'Os passageiros que realizam transbordo na estação da Ilha de Anglesey devem validar seus bilhetes antes de cruzar a ponte pênsil sobre o Estreito de Menai. A pronúncia correta da estação é foneticamente descrita no painel da plataforma 1.',
      relevanceScore: 0.8915,
    },
  ],
  totalEstimatedCost: 1489750,
  summary: 'Roteiro de teste sob estresse máximo de dados (Worst Case): destino com 72 caracteres contínuos sem quebra de espaço, 15 dias de itinerário polar, orçamento milionário formatado com separador de milhar e centavos, e citações de regulamentos de segurança extrema com múltiplos parágrafos.',
  createdAt: '2026-11-11T20:00:00.000Z',
  days: [
    {
      dayNumber: 1,
      date: 'ter., 01/12',
      theme: 'Dia 1: Chegada à Cidade de Nome Mais Longo da Europa e Travessia Marítima',
      dayCostEstimate: 99316,
      morning: [
        {
          id: 'worst-case-act-1',
          title: 'Desembarque e Fotografia no Marco da Estação de Trem de Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
          description: 'Caminhada pela plataforma histórica contemplando a placa de 60 metros de comprimento, seguida de compra do passaporte comemorativo autenticado pelo chefe de estação britânico.',
          location: 'Plataforma 1 da Estação Ferroviária de Llanfairpwllgwyngyll, Anglesey, LL61 5UJ, Reino Unido',
          timeSlot: 'morning',
          estimatedCost: 24829,
          category: 'Patrimônio Ferroviário Britânico',
          localTip: 'Não tente pronunciar o nome completo sem praticar a sílaba aspirada galesa "LL". Tenha sempre uma capa à prova d’água para as chuvas torrenciais do Mar da Irlanda.',
          sourceCitations: ['Regulamento Ferroviário da Estação de Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (Transport for Wales Rail Limited)'],
        },
      ],
      afternoon: [
        {
          id: 'worst-case-act-2',
          title: 'Expedição Náutica pelo Estreito de Menai até o Farol de South Stack (Ynys Lawd)',
          description: 'Navegação em mar aberto em embarcação polar com vista para os penhascos de nidificação de papagaios-do-mar e colônias de focas-cinzentas sob ventos de 50 nós.',
          location: 'Anglesey Coastal Path & Farol de South Stack, Holyhead, LL65 1YH',
          timeSlot: 'afternoon',
          estimatedCost: 44692,
          category: 'Aventura Marítima Extrema',
          localTip: 'Fixe cordões de segurança em câmeras fotográficas para evitar perdas causadas pelo vento forte nos mirantes.',
          sourceCitations: ['Regulamento Ferroviário da Estação de Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (Transport for Wales Rail Limited)'],
        },
      ],
      evening: [
        {
          id: 'worst-case-act-3',
          title: 'Jantar Galês Gastronômico com Cordeiro Salt Marsh e Cerveja Artesanal de Conwy',
          description: 'Refeição de degustação em estalagem medieval do século XIV à beira da lareira rústica com sobremesa Bara Brith acompanhada de queijo Caerphilly maturado.',
          location: 'The Old Bull’s Head Inn, Beaumaris, Anglesey, LL58 8AP',
          timeSlot: 'evening',
          estimatedCost: 29795,
          category: 'Alta Gastronomia Medieval',
          localTip: 'Reserve com antecedência para sentar-se na ala da lareira histórica.',
          sourceCitations: ['Regulamento Ferroviário da Estação de Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch (Transport for Wales Rail Limited)'],
        },
      ],
    },
  ],
};

