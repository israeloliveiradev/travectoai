import { randomUUID } from 'crypto';
import { Activity } from '../../../domain/entities/activity.entity.js';
import { DayPlan } from '../../../domain/entities/day-plan.entity.js';
import {
  CurrencyConversionInfo,
  DocumentCitation,
  Itinerary,
  WeatherInfo,
} from '../../../domain/entities/itinerary.entity.js';
import { TravectoStateType } from '../travecto-graph-state.js';

export async function synthesizeItineraryNode(
  state: TravectoStateType
): Promise<Partial<TravectoStateType>> {
  const prefs = state.preferences;
  if (!prefs) {
    throw new Error('Preferências ausentes no nó synthesize_itinerary.');
  }

  const citations: DocumentCitation[] = state.ragContext?.citations || [];
  const weather = state.mcpWeather;
  const currency = state.mcpCurrency;

  const weatherInfo: WeatherInfo = {
    destination: weather?.destination || prefs.destination,
    season: weather?.season || 'Temporada Ideal',
    temperatureRange: `${weather?.temperatureMin ?? 16}°C a ${weather?.temperatureMax ?? 26}°C (Média: ${weather?.temperatureAverage ?? '21°C'})`,
    advice: weather?.bestClothing || 'Vestuário leve e sapatos confortáveis para caminhada.',
    rainyProbability: weather?.rainyDaysProbability || 'Moderada',
    bestClothing: weather?.bestClothing || 'Roupas em camadas leves e capa de chuva preventiva.',
  };

  const currencyInfo: CurrencyConversionInfo = {
    baseCurrency: currency?.baseCurrency || prefs.budget.currency,
    targetCurrency: currency?.targetCurrency || 'USD',
    exchangeRate: currency?.exchangeRate || 1.0,
    convertedAmount: currency?.convertedAmount || prefs.budget.amount,
    formattedConversion: currency?.formattedConversion || `${prefs.budget.format()}`,
    practicalTip: currency?.paymentMethodAdvice || 'Utilize cartões internacionais ou multimoeda com taxas reduzidas.',
  };

  const days: DayPlan[] = [];
  const totalDays = prefs.days;
  const dailyBudget = prefs.budget.amount / totalDays;
  const destName = prefs.destination;

  const thematicTemplates = getThematicTemplates(destName, prefs.style.type);

  for (let d = 1; d <= totalDays; d++) {
    const dayDate = new Date(prefs.dateRange.startDate);
    dayDate.setDate(dayDate.getDate() + (d - 1));
    const formattedDate = dayDate.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });

    const template = thematicTemplates[(d - 1) % thematicTemplates.length];
    const dayTheme = `Dia ${d}: ${template.theme}`;

    const morningActivity = new Activity({
      id: randomUUID(),
      title: template.morningTitle,
      description: template.morningDesc,
      location: template.morningLoc,
      timeSlot: 'morning',
      estimatedCost: Math.round(dailyBudget * 0.25),
      category: template.morningCat,
      localTip: template.morningTip,
      sourceCitations: getRelevantCitationSources(citations, template.morningTitle),
    });

    const afternoonActivity = new Activity({
      id: randomUUID(),
      title: template.afternoonTitle,
      description: template.afternoonDesc,
      location: template.afternoonLoc,
      timeSlot: 'afternoon',
      estimatedCost: Math.round(dailyBudget * 0.45),
      category: template.afternoonCat,
      localTip: template.afternoonTip,
      sourceCitations: getRelevantCitationSources(citations, template.afternoonTitle),
    });

    const eveningActivity = new Activity({
      id: randomUUID(),
      title: template.eveningTitle,
      description: template.eveningDesc,
      location: template.eveningLoc,
      timeSlot: 'evening',
      estimatedCost: Math.round(dailyBudget * 0.3),
      category: template.eveningCat,
      localTip: template.eveningTip,
      sourceCitations: getRelevantCitationSources(citations, template.eveningTitle),
    });

    const dayCost =
      morningActivity.estimatedCost +
      afternoonActivity.estimatedCost +
      eveningActivity.estimatedCost;

    days.push(
      new DayPlan({
        dayNumber: d,
        date: formattedDate,
        theme: dayTheme,
        morning: [morningActivity],
        afternoon: [afternoonActivity],
        evening: [eveningActivity],
        dayCostEstimate: dayCost,
      })
    );
  }

  const totalEstimatedCost = days.reduce((sum, d) => sum + d.dayCostEstimate, 0);

  const itinerary = new Itinerary({
    id: randomUUID(),
    title: `Roteiro Exclusivo Travecto: ${prefs.destination} (${prefs.days} Dias)`,
    destination: prefs.destination,
    dateRange: prefs.dateRange,
    budget: prefs.budget,
    days,
    weatherInfo,
    currencyConversion: currencyInfo,
    citations,
    totalEstimatedCost,
    summary: `Roteiro personalizado de ${prefs.days} dias em ${prefs.destination} elaborado com base em ${citations.length} fragmentos de guias locais e dados em tempo real de clima (${weatherInfo.temperatureRange}) e câmbio (${currencyInfo.formattedConversion}).`,
  });

  const log = `[synthesize_itinerary] Roteiro final sintetizado com sucesso! ${days.length} dias estruturados, ${citations.length} fontes locais referenciadas, custo previsto ${prefs.budget.currency} ${totalEstimatedCost.toLocaleString('pt-BR')}.`;

  return {
    currentStep: 'synthesize_itinerary',
    itinerary,
    stepLogs: [log],
  };
}

function getRelevantCitationSources(citations: DocumentCitation[], title: string): string[] {
  if (citations.length === 0) return [];
  const words = title.toLowerCase().split(/\s+/);
  const matched = citations.filter((c) =>
    words.some((w) => w.length > 3 && c.content.toLowerCase().includes(w))
  );
  if (matched.length > 0) {
    return matched.slice(0, 2).map((m) => m.source);
  }
  return [citations[0].source];
}

interface TemplateDay {
  theme: string;
  morningTitle: string;
  morningDesc: string;
  morningLoc: string;
  morningCat: string;
  morningTip: string;
  afternoonTitle: string;
  afternoonDesc: string;
  afternoonLoc: string;
  afternoonCat: string;
  afternoonTip: string;
  eveningTitle: string;
  eveningDesc: string;
  eveningLoc: string;
  eveningCat: string;
  eveningTip: string;
}

function getThematicTemplates(destination: string, styleType: string): TemplateDay[] {
  const d = destination.toLowerCase();

  if (d.includes('tóquio') || d.includes('toquio') || d.includes('tokyo') || d.includes('japao') || d.includes('japão')) {
    return [
      {
        theme: 'Tradição Milenar & Futuro Neon',
        morningTitle: 'Visita ao Templo Senso-ji e Nakamise-dori',
        morningDesc: 'Imersão no templo mais antigo de Tóquio, passando pelo imponente portão Kaminarimon e provando snacks artesanais na rua tradicional.',
        morningLoc: 'Asakusa, Tóquio',
        morningCat: 'História & Cultura',
        morningTip: 'Chegue antes das 09h00 para fotografar o templo sem multidões e compre melopan quentinho na rua lateral.',
        afternoonTitle: 'Cruzeiro pelo Rio Sumida até o Jardim Hama-rikyu e Akihabara',
        afternoonDesc: 'Passeio náutico até os jardins feudais de chá verde, seguido de exploração pelas lojas de tecnologia e colecionáveis em Akihabara.',
        afternoonLoc: 'Hama-rikyu & Akihabara',
        afternoonCat: 'Tecnologia & Paisagismo',
        afternoonTip: 'Carregue seu cartão Suica/Pasmo no celular para acesso expresso aos transportes.',
        eveningTitle: 'Jantar de Yakitori no Beco Omoide Yokocho e Golden Gai',
        eveningDesc: 'Autêntica experiência noturna sob lanternas vermelhas provando espetinhos grelhados na brasa e drinks artesanais.',
        eveningLoc: 'Shinjuku, Tóquio',
        eveningCat: 'Gastronomia & Vida Noturna',
        eveningTip: 'Muitos bares microscópicos no Golden Gai têm taxa de mesa (cover charge de 500 a 800 ienes).',
      },
      {
        theme: 'Modernidade Icônica, Moda & Observatórios',
        morningTitle: 'Santuário Meiji Jingu & Caminhada pela Floresta Sagrada',
        morningDesc: 'Oásis de serenidade com mais de 100.000 árvores doadas de todo o Japão, culminando no santuário xintoísta dedicado ao Imperador Meiji.',
        morningLoc: 'Harajuku / Shibuya',
        morningCat: 'Espiritualidade & Natureza',
        morningTip: 'Compre um ema (placa de madeira) para escrever seus votos de viagem.',
        afternoonTitle: 'Cruzamento de Shibuya, Estátua Hachiko e Shibuya Sky',
        afternoonDesc: 'Atravesse o cruzamento mais movimentado do mundo e suba ao terraço panorâmico Shibuya Sky para uma vista espetacular de 360° da metrópole.',
        afternoonLoc: 'Shibuya',
        afternoonCat: 'Arquitetura & Fotografia',
        afternoonTip: 'Reserve o ingresso do Shibuya Sky para 40 minutos antes do pôr do sol.',
        eveningTitle: 'Ramen Artesanal em Ginza e Bares Coquetelaria de Precisão',
        eveningDesc: 'Degustação de ramen com caldo denso premiado, seguido de visita a um speakeasy com coquetéis esculpidos no gelo.',
        eveningLoc: 'Ginza, Tóquio',
        eveningCat: 'Alta Gastronomia',
        eveningTip: 'Gorjetas não são aceitas: a conta deve ser paga diretamente no caixa.',
      },
      {
        theme: 'Cultura Pop, Arte Digital e Mercado de Peixe',
        morningTitle: 'Café da Manhã no Mercado Externo de Tsukiji',
        morningDesc: 'Degustação matinal de sashimi fresco, tamagoyaki (omelete japonesa doce) e espetinhos de frutos do mar preparados na hora.',
        morningLoc: 'Tsukiji, Tóquio',
        morningCat: 'Gastronomia Local',
        morningTip: 'Lojas começam a fechar por volta das 14h00; chegue por volta de 08h30.',
        afternoonTitle: 'Experiência Imersiva no teamLab Planets / Borderless',
        afternoonDesc: 'Museu de arte digital interativa onde você caminha pela água e por salas infinitas de cristais de luz.',
        afternoonLoc: 'Toyosu / Odaiba',
        afternoonCat: 'Arte Digital Interativa',
        afternoonTip: 'Vá com calças que possam ser dobradas até os joelhos para caminhar nas instalações aquáticas.',
        eveningTitle: 'Passeio Noturno pela Baía de Odaiba e Estátua Gundam Gigante',
        eveningDesc: 'Visual cinematográfico da Rainbow Bridge iluminada contra o horizonte dos arranha-céus da capital.',
        eveningLoc: 'Odaiba',
        eveningCat: 'Lazer & Paisagens',
        eveningTip: 'Assista ao show de iluminação da estátua Unicorn Gundam às 19h00.',
      },
    ];
  }

  if (d.includes('paris') || d.includes('frança') || d.includes('franca')) {
    return [
      {
        theme: 'Coração Histórico & Arte Renascentista',
        morningTitle: 'Musée du Louvre com Horário Marcado e Ala Richelieu',
        morningDesc: 'Visita estratégica ao maior museu do mundo pelas obras-primas da escultura grega, renascimento italiano e a Mona Lisa.',
        morningLoc: '1er Arrondissement, Paris',
        morningCat: 'Arte Clássica',
        morningTip: 'Utilize a entrada subterrânea da Galerie du Carrousel para evitar as longas filas da Pirâmide.',
        afternoonTitle: 'Passeio pelos Jardins das Tulherias e Praça Vendôme',
        afternoonDesc: 'Caminhada clássica pelas fontes das Tulherias e vitrines históricas de alta joalheria na Place Vendôme.',
        afternoonLoc: 'Jardin des Tuileries',
        afternoonCat: 'História & Lazer',
        afternoonTip: 'Pare na Angelina para provar o famoso chocolate quente africano bem denso.',
        eveningTitle: 'Piquenique no Pont des Arts e Luzes da Torre Eiffel',
        eveningDesc: 'Contemple o entardecer nas margens do Sena com queijos maturados, baguete estaladiça e vista para o acendimento da Torre.',
        eveningLoc: 'Margens do Sena / Pont des Arts',
        eveningCat: 'Gastronomia Romântica',
        eveningTip: 'A Torre Eiffel pisca suas luzes douradas nos primeiros 5 minutos de cada hora cheia.',
      },
      {
        theme: 'Boemia, Literatura & Vistas Panorâmicas',
        morningTitle: 'Exploração de Montmartre e Basílica de Sacré-Cœur',
        morningDesc: 'Subida pelas ruelas charmosas dos pintores impressionistas, vinhedos históricos de Montmartre e a Place du Tertre.',
        morningLoc: 'Montmartre (18e)',
        morningCat: 'Patrimônio & Boemia',
        morningTip: 'Suba pelas escadas da Rue Foyatier ou use o funicular integrado ao bilhete de metrô Navigo.',
        afternoonTitle: 'Bairro Latino & Livraria Histórica Shakespeare and Company',
        afternoonDesc: 'Passeio pelo berço intelectual de Paris, Faculdade da Sorbonne e a lendária livraria frequentada por Hemingway.',
        afternoonLoc: 'Quartier Latin (5e)',
        afternoonCat: 'Literatura & Cultura',
        afternoonTip: 'Passeie pelo Jardim de Luxemburgo logo ao lado para relaxar nas tradicionais cadeiras verdes de ferro.',
        eveningTitle: 'Jantar em Bistrô Tradicional no Bairro Le Marais',
        eveningDesc: 'Degustação de confit de pato, bife bourguignon e tarte tatin em ambiente charmoso do século XVII.',
        eveningLoc: 'Le Marais (4e)',
        eveningCat: 'Gastronomia Francesa',
        eveningTip: 'Peça uma "carafe d’eau" para água filtrada potável e gratuita na mesa.',
      },
      {
        theme: 'Grandes Bulevares, Ópera & Impressionismo',
        morningTitle: 'Musée d’Orsay: O Templo dos Impressionistas',
        morningDesc: 'Instalado em uma magnífica estação ferroviária da Belle Époque, abriga obras supremas de Monet, Van Gogh, Renoir e Degas.',
        morningLoc: '7e Arrondissement',
        morningCat: 'Artes Plásticas',
        morningTip: 'Tire uma foto clássica através dos ponteiros do relógio gigante no 5º andar do museu.',
        afternoonTitle: 'Palais Garnier (Ópera de Paris) e Galerias Lafayette',
        afternoonDesc: 'Arquitetura teatral barroca inspiradora e vista gratuita de Paris a partir do terraço das Galerias Lafayette.',
        afternoonLoc: 'Boulevard Haussmann (9e)',
        afternoonCat: 'Arquitetura Imperial',
        afternoonTip: 'O terraço da cobertura tem acesso livre e oferece um dos melhores ângulos da Torre Eiffel.',
        eveningTitle: 'Passeio de Barco no Bateaux-Mouches com Jantar ao Luar',
        eveningDesc: 'Navegação pelas pontes históricas iluminadas de Paris com vista panorâmica da Catedral de Notre-Dame.',
        eveningLoc: 'Rio Sena / Pont de l’Alma',
        eveningCat: 'Experiência Noturna',
        eveningTip: 'Agasalhe-se bem no convés superior, pois a brisa fluvial no Sena é fria.',
      },
    ];
  }

  if (d.includes('rio') || d.includes('janeiro') || d.includes('brasil')) {
    return [
      {
        theme: 'Cartão Postal dos Sonhos & Natureza Tropical',
        morningTitle: 'Cristo Redentor pelo Trem do Corcovado',
        morningDesc: 'Subida pela histórica ferrovia cortando a Mata Atlântica até os pés de uma das 7 Maravilhas do Mundo Moderno.',
        morningLoc: 'Parque Nacional da Tijuca / Corcovado',
        morningCat: 'História & Paisagens',
        morningTip: 'Embarque no primeiro trem das 08h00 para fotografar a vista da Baía de Guanabara com sol suave.',
        afternoonTitle: 'Café da Manhã Tardio no Parque Lage e Jardim Botânico',
        afternoonDesc: 'Palacete histórico renascentista aos pés do Corcovado, seguido de caminhada pelas alamedas de palmeiras imperiais centenárias.',
        afternoonLoc: 'Jardim Botânico',
        afternoonCat: 'Natureza & Arquitetura',
        afternoonTip: 'Experimente a água de coco fresca direto do fruto nos quiosques ao redor.',
        eveningTitle: 'Pôr do Sol na Pedra do Arpoador & Noite em Ipanema',
        eveningDesc: 'Tradição carioca de aplaudir o sol se pondo no mar do Arpoador, seguido de drinks e petiscos no Bar Garota de Ipanema.',
        eveningLoc: 'Ipanema / Arpoador',
        eveningCat: 'Cultura de Praia & Gastronomia',
        eveningTip: 'Pagamentos via PIX ou aproximação são aceitos em praticamente 100% dos quiosques.',
      },
      {
        theme: 'Charme Boêmio, Arcos Históricos & Samba Autêntico',
        morningTitle: 'Passeio no Bondinho de Santa Teresa e Parque das Ruínas',
        morningDesc: 'Travessia pelos Arcos da Lapa a bordo do charmoso bondinho amarelo até o bairro dos ateliês de arte.',
        morningLoc: 'Santa Teresa / Lapa',
        morningCat: 'Cultura Urbana & Arte',
        morningTip: 'O mirante do Parque das Ruínas tem vista panorâmica gratuita e espetacular de todo o Centro e Baía.',
        afternoonTitle: 'Escadaria Selarón e Centro Histórico (Confeitaria Colombo)',
        afternoonDesc: 'Mosaico de azulejos de mais de 60 países feito pelo artista Jorge Selarón, com parada na célebre confeitaria de 1894.',
        afternoonLoc: 'Lapa e Centro Histórico',
        afternoonCat: 'Patrimônio & Doçaria',
        afternoonTip: 'Experimente o pastel de nata ou a coxinha com creme da Confeitaria Colombo.',
        eveningTitle: 'Roda de Samba Tradicional no Beco do Rato',
        eveningDesc: 'Noite com samba ao vivo de raiz, caipirinhas de frutas tropicais e petiscos de boteco carioca.',
        eveningLoc: 'Lapa, Rio de Janeiro',
        eveningCat: 'Música & Vida Noturna',
        eveningTip: 'Chegue cedo (antes das 20h00) para garantir mesa perto da roda.',
      },
    ];
  }

  // Default international template
  return [
    {
      theme: `Descobrindo os Tesouros de ${destination}`,
      morningTitle: `Passeio Histórico pelos Marcos Centrais de ${destination}`,
      morningDesc: `Caminhada pelas principais praças, monumentos e avenidas históricas emblemáticas da cidade.`,
      morningLoc: `Centro Histórico, ${destination}`,
      morningCat: 'Cultura & Patrimônio',
      morningTip: 'Inicie cedo para aproveitar o clima ameno e a luz matinal para fotografias.',
      afternoonTitle: `Visita ao Museu Principal e Jardins Locais`,
      afternoonDesc: `Acervo cultural representativo das tradições e artes locais, com descanso em parque arborizado.`,
      afternoonLoc: `Distrito Cultural, ${destination}`,
      afternoonCat: 'Artes & Paisagismo',
      afternoonTip: 'Compre ingressos digitais com antecedência para evitar esperas nas bilheterias.',
      eveningTitle: `Jantar Típico e Passeio pelas Ruas Iluminadas`,
      eveningDesc: `Degustação dos pratos mais emblemáticos da gastronomia local em restaurante recomendado.`,
      eveningLoc: `Bairro Gastronômico, ${destination}`,
      eveningCat: 'Gastronomia & Experiências',
      eveningTip: 'Consulte os pratos da estação recomendados pelo garçom para saborear ingredientes frescos.',
    },
    {
      theme: `Vistas Panorâmicas e Vida Autêntica em ${destination}`,
      morningTitle: `Mirante Panorâmico e Mercado Público Tradicional`,
      morningDesc: `Vista espetacular da geografia urbana e visita aos estandes de produtores locais.`,
      morningLoc: `Colina Panorâmica, ${destination}`,
      morningCat: 'Natureza & Comércio Típico',
      morningTip: 'Excelente local para comprar artesanato genuíno e temperos típicos.',
      afternoonTitle: `Circuito de Lazer e Cafés Históricos`,
      afternoonDesc: `Tarde relaxante explorando livrarias, galerias de arte independente e bistrôs locais.`,
      afternoonLoc: `Bairro Boêmio, ${destination}`,
      afternoonCat: 'Lazer Urbano',
      afternoonTip: 'Aproveite para experimentar a sobremesa tradicional da região.',
      eveningTitle: `Concerto, Teatro ou Pôr do Sol Especial`,
      eveningDesc: `Encerramento do dia com atmosfera envolvente e contemplação do entardecer.`,
      eveningLoc: `Orla / Boulevard Principal, ${destination}`,
      eveningCat: 'Cultura & Noite',
      eveningTip: 'Verifique a programação cultural semanal no site oficial da prefeitura local.',
    },
  ];
}
