export interface DefaultGuide {
  title: string;
  destination: string;
  content: string;
  metadata: Record<string, unknown>;
}

export const DEFAULT_TRAVEL_GUIDES: DefaultGuide[] = [
  {
    title: 'Guia Local & Manual Prático: Tóquio (Japão)',
    destination: 'Tóquio',
    metadata: {
      country: 'Japão',
      continent: 'Ásia',
      category: 'Metrópole & Tradição',
      currency: 'JPY',
    },
    content: `# Guia Oficial Travecto: Tóquio Essencial & Secreto

## Políticas de Bagagem e Transporte Público no Japão
Para trens-bala (Shinkansen), bagagens cujas dimensões totais (comprimento + largura + altura) somem entre 160 cm e 250 cm exigem reserva antecipada do assento com espaço de bagagem sobressalente (*Tokaido/Sanyo/Kyushu Shinkansen*). Malas acima de 250 cm não são permitidas. Nos metrôs de Tóquio (Tokyo Metro e Toei), evite malas volumosas durante o horário de pico matinal (07:30 às 09:00). O uso de cartões IC digitais (Suica ou Pasmo no Apple Wallet/Google Wallet) agiliza transições sem filas.

## Tabela Sazonal e Época de Florada e Clima
- **Primavera (Fim de Março a Maio)**: Época do Hanami (florada das cerejeiras, Sakura) em parques como Shinjuku Gyoen, Ueno e Rio Meguro. Temperaturas amenas (14°C a 20°C).
- **Verão (Junho a Agosto)**: Quente e úmido (28°C a 35°C), com temporada de chuvas (Tsuyu) em junho. Roupas leves de secagem rápida e toalhinhas de mão são essenciais.
- **Outono (Outubro a Novembro)**: Excelente visibilidade (Koyo - folhas vermelhas de bordo) no Jardim Rikugien e Meiji Jingu. Temperaturas confortáveis (15°C a 21°C).
- **Inverno (Dezembro a Fevereiro)**: Frio seco e céu azul cristalino (5°C a 12°C), ideal para avistar o Monte Fuji de observatórios como Shibuya Sky e Tokyo Skytree.

## Atrações Imperdíveis e Roteiros por Turno
- **Manhã Cultural em Asakusa**: Templo Senso-ji, o mais antigo de Tóquio, com a rua comercial Nakamise-dori. Visite antes das 09:00 para evitar aglomerações e saborear melopan fresquinho.
- **Tarde Tecnológica em Akihabara ou Shibuya**: Cruzamento de Shibuya, estátua de Hachiko e Shibuya Sky ao entardecer para vista 360°. Para eletrônicos e cultura pop, Mandarake e Yodobashi Camera em Akihabara.
- **Noite Gastronômica em Shinjuku**: Omoide Yokocho (Beco da Memória) para espetinhos de yakitori artesanais, seguido por Golden Gai, composto por mais de 200 bares microscópicos com ambientação cinematográfica.

## Dicas Locais de Etiqueta e Economia
Não caminhe comendo nas ruas — coma em frente à loja ou máquina automática. Gorjetas não são aceitas em nenhum estabelecimento no Japão; o atendimento excelente é considerado o padrão básico de hospitalidade (omotenashi). Para refeições rápidas e de altíssima qualidade por menos de 1.000 ienes, explore os *konbinis* (7-Eleven, Lawson e FamilyMart) e lojas de soba em estações.`,
  },
  {
    title: 'Guia Local & Manual Cultural: Paris (França)',
    destination: 'Paris',
    metadata: {
      country: 'França',
      continent: 'Europa',
      category: 'Arte & Gastronomia',
      currency: 'EUR',
    },
    content: `# Guia Oficial Travecto: Paris Cultural e Histórica

## Normas de Segurança, Ingressos e Bagagem nos Monumentos
A maioria dos grandes museus parisienses (Musée du Louvre, Musée d'Orsay e Centre Pompidou) exige agendamento prévio com horário marcado pela internet, mesmo para portadores do Paris Museum Pass. No Louvre e na Torre Eiffel, mochilas e malas com dimensões superiores a 55 x 35 x 20 cm são proibidas nas áreas de visitação e os guarda-volumes não aceitam malas grandes. Mantenha bolsas sempre fechadas e à frente do corpo em linhas movimentadas do metrô (linhas 1, 4 e RER B).

## Clima, Sazonalidade e Terraços
- **Primavera (Abril a Junho)**: Dias longos, jardins floridos (Jardim de Luxemburgo e Tuileries) e temperaturas médias entre 12°C e 22°C. Perfeito para caminhar às margens do Sena.
- **Verão (Julho a Agosto)**: Meses mais quentes (22°C a 32°C). Muitos bistrôs familiares fecham durante agosto para as férias anuais de verão.
- **Outono (Setembro a Novembro)**: Clima fresco e romântico com tons outonais nos bulevares. Temperaturas entre 10°C e 18°C.
- **Inverno (Dezembro a Fevereiro)**: Frio (3°C a 8°C), iluminado pelas luzes de Natal na Champs-Élysées e mercados de inverno.

## Roteiro Bairro a Bairro & Dicas Secretas
- **Manhã Histórica na Île de la Cité & Le Marais**: Contemple a Sainte-Chapelle com seus vitrais góticos impressionantes, passeie pela Place des Vosges e explore as padarias judaicas na Rue des Rosiers para experimentar o melhor falafel no L'As du Fallafel.
- **Tarde Boêmia em Montmartre**: Fuja das escadarias principais da Basílica de Sacré-Cœur e caminhe pela Rue de l'Abreuvoir e Praça Dalida. Visite o Museu de Montmartre e seus vinhedos históricos (Vigne de Montmartre).
- **Noite ao Longo do Sena**: Piquenique elegante com queijos brie, baguete artesanal e vinho no Pont des Arts ou na Square du Vert-Galant durante o acendimento das luzes douradas da Torre Eiffel no início de cada hora.

## Etiqueta Gastronômica e Café Culture
Sempre cumprimente o atendente ao entrar em qualquer loja com um claro "Bonjour, Madame/Monsieur". A taxa de serviço já está legalmente incluída na conta (service compris), mas deixar moedas de 1€ a 2€ é bem visto se o serviço foi atencioso. A água da torneira em restaurantes é potável e gratuita: peça uma "carafe d'eau".`,
  },
  {
    title: 'Guia Local & Manual de Experiências: Rio de Janeiro (Brasil)',
    destination: 'Rio de Janeiro',
    metadata: {
      country: 'Brasil',
      continent: 'América do Sul',
      category: 'Natureza & Praias',
      currency: 'BRL',
    },
    content: `# Guia Oficial Travecto: Rio de Janeiro Autêntico

## Mobilidade, Segurança e Pagamentos Locais
O MetrôRio e o VLT Carioca cobrem os principais pontos turísticos da Zona Sul e Centro com conforto e ar-condicionado. Para subidas a mirantes (como Mirante Dona Marta ou Cristo Redentor), utilize vans oficiais autorizadas ou táxis/aplicativos cadastrados. O pagamento instantâneo via PIX ou cartões por aproximação é aceito universalmente, inclusive por ambulantes e quiosques na praia, minimizando a necessidade de portar dinheiro em espécie.

## Sazonalidade e Épocas de Visitação
- **Verão (Dezembro a Março)**: Dias radiantes de sol forte e calor intenso (30°C a 40°C), ritmo de Carnaval e praias vibrantes. Protetor solar e hidratação constante com água de coco são vitais.
- **Outono e Inverno (Maio a Outubro)**: Céu limpo, menor incidência de chuvas e temperaturas amenas e agradáveis (20°C a 27°C). É a época perfeita para trilhas ecológicas no Parque Nacional da Tijuca e Morro Dois Irmãos.
- **Primavera (Outubro e Novembro)**: Florescimento da Mata Atlântica e clima intermediário.

## Roteiro Equilibrado: Mar, Cultura e Floresta
- **Manhã de Cartão Postal & Trilha Leve**: Chegue cedo ao Cristo Redentor pelo Trem do Corcovado no primeiro horário (08:00) para vista panorâmica sem névoa. Em seguida, caminhe pelos jardins do Parque Lage com parada para café da manhã sob o palacete histórico.
- **Tarde Cultural em Santa Teresa**: Suba no tradicional Bondinho de Santa Teresa sobre os Arcos da Lapa, almoce no Largo dos Guimarães com feijoada ou moqueca artesanal e aprecie a vista do Parque das Ruínas.
- **Fim de Tarde e Noite em Ipanema e Lapa**: Aplauda o pôr do sol na Pedra do Arpoador em Ipanema. À noite, curta samba de raiz tradicional no Beco do Rato ou Circo Voador na Lapa.

## Dicas Locais e Bagagem em Praias
Nas praias de Copacabana, Ipanema e Leblon, alugue cadeira e guarda-sol nos quiosques numerados (postos). Nunca deixe pertences desacompanhados na areia ao entrar no mar. Nas trilhas da Pedra da Gávea ou Parque da Tijuca, leve mochila leve com repelente biodegradável, capa de chuva compacta e pelo menos 1,5L de água.`,
  },
  {
    title: 'Guia Local & Roteiro Arqueológico: Roma (Itália)',
    destination: 'Roma',
    metadata: {
      country: 'Itália',
      continent: 'Europa',
      category: 'História Antiga & Gastronomia',
      currency: 'EUR',
    },
    content: `# Guia Oficial Travecto: Roma Cidade Eterna

## Normas Arqueológicas, Código de Vestimenta e Bagagem
O Coliseu, Fórum Romano e Palatino proíbem a entrada de mochilas de acampamento, malas de viagem e objetos cortantes ou garrafas de vidro. Para a Basílica de São Pedro e Museus do Vaticano, o código de vestimenta (dress code) é estritamente fiscalizado: ombros e joelhos devem estar cobertos para homens e mulheres (tenha sempre um lenço leve na bolsa).

## Clima e Fontes Públicas Gratuitas (Nasoni)
- **Primavera (Abril a Junho)**: A melhor época para explorar Roma a pé, com temperaturas médias entre 16°C e 24°C e flores perfumando os terraços do Monte Aventino.
- **Verão (Julho a Agosto)**: Muito quente e seco (32°C a 38°C). A cidade conta com mais de 2.500 fontes públicas históricas com água pura e gelada potável conhecidas como *Nasoni*. Tenha sempre uma garrafinha reutilizável!
- **Outono (Setembro a Novembro)**: Aconchegante, época de colheita e trufas, com temperaturas entre 14°C e 22°C.
- **Inverno (Dezembro a Fevereiro)**: Frio moderado (7°C a 14°C) e menos turistas, ótimo para fotografar monumentos vazios.

## Roteiro Dia a Dia: Do Império ao Renascimento
- **Manhã Imperial**: Coliseu com acesso à arena dos gladiadores, seguido por caminhada pela Via dei Fori Imperiali e subida ao Campidoglio desenhado por Michelangelo.
- **Tarde Renascentista e Barroca**: Panteão com seu domo de óculo aberto, Piazza Navona com a Fonte dos Quatro Rios de Bernini e Fontana di Trevi (jogue uma moeda com a mão direita sobre o ombro esquerdo).
- **Noite Boêmia em Trastevere**: Perca-se nas ruelas de paralelepípedo cobertas de hera e jante em uma trattoria autêntica saboreando pratos tradicionais como Tonnarelli Cacio e Pepe, Carbonara clássica ou Amatriciana, acompanhados de vinho da casa (*vino della casa*).

## Dicas de Economia e Transporte
O centro histórico de Roma é um museu a céu aberto perfeitamente caminhável. Evite táxis não oficiais (pegue apenas carros brancos com letreiro oficial e taxímetro ligado). O café no balcão (*al banco*) custa geralmente entre 1,10€ e 1,50€, enquanto sentar em mesas externas em praças turísticas pode triplicar o valor devido à taxa de serviço de mesa (*coperto*).`,
  },
];

