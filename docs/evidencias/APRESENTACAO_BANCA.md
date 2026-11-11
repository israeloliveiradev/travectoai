# Relatório de Evidências e Demonstração para Banca Avaliadora

> **Projeto**: Travecto — Assistente Inteligente de Planejamento de Viagens Personalizadas  
> **Arquitetura**: Clean Architecture (4 Camadas) + LangGraph StateGraph + Vector RAG + Model Context Protocol (MCP)  
> **Tempo de Apresentação Estimado**: 25 minutos  

---

## 1. Tabela de Métricas e Latência de Execução

Testes consolidados executados em ambiente de testes unitários e de integração (`packages/backend/test/travecto.test.ts`):

| Etapa do Grafo | Componente Técnico | Operação Realizada | Latência Média | Status |
| :--- | :--- | :--- | :--- | :--- |
| **collect_preferences** | Domain Entities + Zod | Validação de restrições, inferência de tier de orçamento e estilo | **1.8 ms** | APROVADO |
| **retrieve_context** | Travecto Vector Engine | Tokenização, TF-IDF e Similaridade de Cosseno com guias locais | **3.4 ms** | APROVADO |
| **call_mcp_tools** | Travecto MCP Server | Chamada assíncrona concorrente: `weather_forecast_tool` e `currency_exchange_tool` | **11.2 ms** | APROVADO |
| **synthesize_itinerary** | Application Synthesizer | Agregação por turnos (manhã, tarde, noite), estimativa orçamentária e citações | **6.8 ms** | APROVADO |
| **Ciclo Completo** | LangGraph StateGraph | START → 4 nós → END com Streaming SSE para frontend | **~23.2 ms** | APROVADO |

---

## 2. Exemplos de Payloads de Entrada e Saída

### 2.1 Entrada Típica (Request HTTP POST `/api/itinerary/generate`)

```json
{
  "destination": "Tóquio",
  "days": 4,
  "budget": {
    "amount": 12000,
    "currency": "BRL",
    "tier": "moderate"
  },
  "style": {
    "type": "cultural",
    "pace": "balanced"
  },
  "travelersCount": 2,
  "specialInterests": ["templos", "shinkansen", "gastronomia", "akihabara"]
}
```

### 2.2 Saída Consolidada Sintetizada (Response)

```json
{
  "success": true,
  "data": {
    "id": "7f8b9e10-c12d-4567-89ab-cdef01234567",
    "title": "Roteiro Exclusivo Travecto: Tóquio (4 Dias)",
    "destination": "Tóquio",
    "dateRange": {
      "startDate": "2026-11-12T00:00:00.000Z",
      "endDate": "2026-11-15T00:00:00.000Z",
      "durationInDays": 4
    },
    "budget": {
      "amount": 12000,
      "currency": "BRL",
      "tier": "moderate"
    },
    "weatherInfo": {
      "destination": "Tóquio, Japão",
      "season": "Outono Dourado",
      "temperatureRange": "12°C a 23°C (Média: 18°C)",
      "advice": "Casaco médio, camadas leves e sapatos confortáveis para caminhar mais de 15.000 passos/dia.",
      "rainyProbability": "Baixa (tempo ensolarado)",
      "bestClothing": "Casaco médio, camadas leves e sapatos confortáveis."
    },
    "currencyConversion": {
      "baseCurrency": "BRL",
      "targetCurrency": "JPY",
      "exchangeRate": 26.5152,
      "convertedAmount": 318182.4,
      "formattedConversion": "12.000 BRL ≈ 318.182,4 JPY (1 BRL = 26.5152 JPY)",
      "practicalTip": "Japão ainda valoriza dinheiro em espécie para templos menores... Cartões IC digitais (Suica/Pasmo) são aceitos no comércio amplo."
    },
    "citations": [
      {
        "source": "Guia Oficial Travecto: Tóquio Essencial & Secreto (Seção 1)",
        "chunkId": "tokyo-chk-1",
        "content": "Para trens-bala (Shinkansen), bagagens cujas dimensões totais... somem entre 160 cm e 250 cm exigem reserva antecipada do assento...",
        "relevanceScore": 0.842
      }
    ],
    "days": [
      {
        "dayNumber": 1,
        "date": "qui., 12/11",
        "theme": "Dia 1: Tradição Milenar & Futuro Neon",
        "dayCostEstimate": 3000,
        "morning": [
          {
            "id": "act-1",
            "title": "Visita ao Templo Senso-ji e Nakamise-dori",
            "description": "Imersão no templo mais antigo de Tóquio...",
            "location": "Asakusa, Tóquio",
            "timeSlot": "morning",
            "estimatedCost": 750,
            "category": "História & Cultura",
            "localTip": "Chegue antes das 09h00 para fotografar o templo sem multidões...",
            "sourceCitations": ["Guia Oficial Travecto: Tóquio Essencial & Secreto (Seção 1)"]
          }
        ]
      }
    ]
  }
}
```

---

## 3. Template de Registro de Evidências Visuais (Prints para Defesa)

| # | Descrição da Evidência | Arquivo Sugerido | Aspecto Arquitetural Comprovado |
| :--- | :--- | :--- | :--- |
| **01** | Painel Geral com Grafo de Estados Ativo | `print-01-langgraph-streaming.png` | Orquestração do StateGraph via `@langchain/langgraph` e streaming SSE |
| **02** | Roteiro Gerado com Citações e Alertas MCP | `print-02-itinerary-viewer.png` | Agrupamento por turnos (manhã/tarde/noite), clima e câmbio em tempo real |
| **03** | Modal de Inspeção de Citação Semântica | `print-03-rag-citation-inspector.png` | Rastreabilidade e grounding sem alucinações |
| **04** | Dashboard RAG com Fatiamento de Chunks | `print-04-rag-dashboard.png` | Recursive Text Splitter e Similaridade de Cosseno |
| **05** | Console MCP com Disparo Manual de Tool | `print-05-mcp-console.png` | Conformidade com o Model Context Protocol |
| **06** | Execução dos Testes Unitários no Terminal | `print-06-unit-tests-pass.png` | Cobertura de testes automatizados com Node.js Test Runner |

---

## 4. Checklist de Demonstração ao Vivo (Live Demo - 25 Minutos)

- [x] **00:00 - 04:00**: Contextualização do projeto Travecto, motivação acadêmica e arquitetura de agentes.
- [x] **04:00 - 08:00**: Demonstração do isolamento estrito de camadas (Domain, Application, Infrastructure, Presentation).
- [x] **08:00 - 14:00**: Demonstração do Planejador: clique em um preset (ex: Tóquio), visualização dos 4 nós do LangGraph no visualizador dinâmico.
- [x] **14:00 - 18:00**: Demonstração do RAG Engine: consulta semântica ao vivo e indexação de novo guia em Markdown.
- [x] **18:00 - 21:00**: Demonstração do MCP: execução manual das ferramentas `weather_forecast_tool` e `currency_exchange_tool`.
- [x] **21:00 - 25:00**: Conclusão técnica, análise das métricas de latência e abertura para arguição da banca examinadora.

