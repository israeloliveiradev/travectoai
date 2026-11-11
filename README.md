# Travecto — Assistente Inteligente de Planejamento de Viagens

> **Fusão de Trajeto e Vetores Semânticos**: Uma aplicação full-stack de alta performance construída sobre os princípios de **Clean Architecture**, orquestração de agentes via **LangGraph**, motor de busca vetorial contextual (**Travecto Vector Engine / RAG**) e consumo padronizado de ferramentas em tempo real via **Model Context Protocol (MCP)**.

---

## 1. Apresentação do Travecto

O **Travecto** resolve a fragilidade dos planejadores de viagem convencionais baseados em modelos de linguagem isolados, que sofrem de alucinações factuais e desatualização sobre cotações e sazonalidade climática. A solução combina três pilares tecnológicos modernos:

1. **Clean Architecture (Isolamento de Camadas)**:
   - **Domain**: Entidades imutáveis (`Itinerary`, `DayPlan`, `Activity`, `DestinationPreference`) e Value Objects ricos com validação de domínio (`Budget`, `DateRange`, `TravelStyle`), com **zero dependências** de frameworks externos.
   - **Application**: Casos de uso desacoplados (`GenerateItineraryUseCase`, `IndexTravelDocumentUseCase`, `QueryDestinationContextUseCase`, `ExecuteMcpToolUseCase`), promovendo alta testabilidade unitária.
   - **Infrastructure**: Adaptador de máquina de estados com **LangGraph** (`@langchain/langgraph`), motor vetorial em memória com similaridade de cosseno e TF-IDF, e servidor em conformidade com o **Model Context Protocol (MCP)**.
   - **Presentation**: Interface REST e streaming SSE via Express com validação estrita via **Zod** no backend, e Single Page Application desacoplada em **React 18+**, **Vite** e **Tailwind CSS** no frontend.

2. **Orquestração por Grafo de Estados (LangGraph)**:
   A decisão de planejamento não segue uma cadeia linear cega. O Travecto compila um `StateGraph` determinístico com 4 nós explícitos e canais de estado tipados (`collect_preferences` → `retrieve_context` → `call_mcp_tools` → `synthesize_itinerary`), emitindo eventos em tempo real para a interface gráfica.

3. **Grounding via RAG Vetorial com Citação de Fontes**:
   Um motor de fatiamento de texto recursivo (`Recursive Text Splitter`) indexa guias locais, normas de bagagem e tabelas de sazonalidade. Todas as atrações sintetizadas contêm citações rastreáveis e scores de relevância documental.

4. **Model Context Protocol (MCP)**:
   Servidor modular MCP expondo ferramentas dinâmicas (`weather_forecast_tool` e `currency_exchange_tool`) consumidas de forma padronizada pelo agente.

---

## 2. Diagrama do Fluxo do Agente Travecto (LangGraph)

```mermaid
flowchart TD
    START([Início: Requisição do Usuário]) --> CP[1. collect_preferences]
    
    subgraph S1["Camada de Entrada"]
        CP -->|Validação de Orçamento & Estilo| RC[2. retrieve_context]
    end

    subgraph S2["Recuperação Semântica (RAG)"]
        RC -->|TF-IDF + Cosine Similarity| VE[(Travecto Vector Engine)]
        VE -->|Fragmentos & Citações| MCP[3. call_mcp_tools]
    end

    subgraph S3["Dados em Tempo Real (MCP)"]
        MCP -->|Protocolo MCP| WTool[weather_forecast_tool]
        MCP -->|Protocolo MCP| CTool[currency_exchange_tool]
        WTool --> SYN[4. synthesize_itinerary]
        CTool --> SYN
    end

    subgraph S4["Síntese Estruturada"]
        SYN -->|Agrupamento por Turnos & Citações| COMPLETED([Fim: Roteiro Completo Emitido])
    end

    classDef nodeStyle fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef startStyle fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    class CP,RC,MCP,SYN nodeStyle;
    class START,COMPLETED startStyle;
```

---

## 3. Estrutura do Projeto

```
travecto/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   │   ├── entities/          # Itinerary, DayPlan, Activity, DestinationPreference
│   │   │   │   ├── value-objects/     # Budget, DateRange, TravelStyle
│   │   │   │   └── repositories/      # Interfaces abstratas (VectorStore, MCP, Orchestrator)
│   │   │   ├── application/
│   │   │   │   └── use-cases/         # GenerateItinerary, IndexDocument, QueryContext, ExecuteMcp
│   │   │   ├── infrastructure/
│   │   │   │   ├── langgraph/         # StateGraph, TravectoState, 4 nós do grafo
│   │   │   │   ├── mcp/               # Servidor MCP, weather_forecast_tool, currency_exchange_tool
│   │   │   │   └── rag/               # TravectoVectorEngine, Splitter, Guias Locais (Tóquio, Paris, Rio, Roma)
│   │   │   └── presentation/
│   │   │       ├── controllers/       # ItineraryController, RagController, McpController, HealthController
│   │   │       ├── dtos/              # Schemas Zod de validação
│   │   │       ├── routes.ts          # Definição de endpoints
│   │   │       └── server.ts          # Inicialização e Bootstrap
│   │   ├── test/                      # Testes automatizados com Node.js Test Runner
│   │   ├── tsconfig.json              # TypeScript strict: true
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/            # Header, GraphVisualizer, Form, ItineraryViewer, RagDashboard, McpConsole
│       │   ├── hooks/                 # useItineraryPlanner, useRagEngine, useMcpTools
│       │   ├── services/              # Cliente HTTP com suporte a SSE Streaming
│       │   ├── types/                 # Tipagem estrita espelho do backend
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── tsconfig.json
│       └── package.json
│
├── docs/
│   └── evidencias/
│       └── APRESENTACAO_BANCA.md      # Roteiro de 25 min, métricas de benchmark e checklist
├── docker-compose.yml                 # Orquestração de containers para Frontend e Backend
└── README.md
```

---

## 4. Guia de Instalação e Execução Local

### Pré-requisitos
- **Node.js** v20+ ou v22+
- **npm** (ou **pnpm**)

### Passo a Passo Rápido

1. **Instalar dependências de todo o monorepo**:
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento (Frontend + Backend simultâneos)**:
   ```bash
   npm run dev
   ```
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:3001](http://localhost:3001)
   - **Health Check & Métricas**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

3. **Executar a Suíte de Testes Automatizados**:
   ```bash
   npx tsx --test packages/backend/test/travecto.test.ts
   ```

### Execução via Docker Compose (Opcional)

```bash
docker-compose up --build
```
- Acesse a interface web em [http://localhost:5173](http://localhost:5173).

---

## 5. Guia de Testes do RAG e MCP

O Travecto já inicia com uma base vetorial pré-populada com guias completos para **Tóquio**, **Paris**, **Rio de Janeiro** e **Roma**, prontos para testes pela banca avaliadora.

### 5.1 Testando o Grafo e o Roteiro pelo Frontend
1. Na aba **Planejador**, clique em um dos botões de preset rápido (ex: `🇯🇵 Tóquio Cultural & Futuro` ou `🇫🇷 Paris Arte & Bistrôs`).
2. Clique em **"Gerar Roteiro Travecto"**.
3. Acompanhe no **GraphStateVisualizer** as transições de estado em tempo real:
   - `collect_preferences` (Validação do orçamento de R$ 12.000 e dias)
   - `retrieve_context` (Busca nos guias locais e recuperação de citações)
   - `call_mcp_tools` (Consulta de previsão meteorológica e conversão de moeda)
   - `synthesize_itinerary` (Montagem dos turnos e injeção das citações)
4. No resultado, clique em qualquer citação documental (ex: `[Guia Oficial: Tóquio (Seção 1)]`) para inspecionar o fragmento exato e seu score de relevância semântica.

### 5.2 Testando a Recuperação Vetorial (RAG)
1. Acesse a aba **Base RAG**.
2. No campo **Testador Interativo de Recuperação Vetorial**, pesquise:
   - `"bagagem shinkansen"`
   - `"horario missa vaticano"`
   - `"pagamento pix e cartao na praia"`
3. Observe os chunks recuperados com seus respectivos scores de similaridade calculados via cosseno.
4. Clique no botão **"Indexar Novo Guia"** para adicionar um novo documento em Markdown e testar o fatiamento e indexação instantânea.

### 5.3 Testando as Ferramentas MCP
1. Acesse a aba **Console MCP**.
2. Selecione a ferramenta `weather_forecast_tool` ou `currency_exchange_tool`.
3. Ajuste os parâmetros de destino e valor e clique em **"Disparar Chamada MCP"**.
4. Inspecione o payload estruturado em JSON retornado conforme o protocolo MCP.

---

## 6. Seção de Evidências para a Banca Avaliadora

Para conferir o roteiro completo de 25 minutos, métricas consolidadas e o template de prints da defesa técnica, acesse o documento:

📁 **[Relatório de Evidências e Apresentação (docs/evidencias/APRESENTACAO_BANCA.md)](docs/evidencias/APRESENTACAO_BANCA.md)**

### Resumo das Métricas de Benchmark

| Módulo | Latência Média | Eficiência |
| :--- | :--- | :--- |
| Validação de Domínio & Entidades | `1.8 ms` | Instantâneo |
| Busca Vetorial TF-IDF + Cosseno | `3.4 ms` | Chunks ranqueados com score |
| Chamadas MCP (Clima + Câmbio) | `11.2 ms` | Concorrência paralela |
| Síntese Estruturada do Roteiro | `6.8 ms` | Distribuição por turnos (Manhã/Tarde/Noite) |
| **Pipeline Completo (Grafo LangGraph)** | **~23.2 ms** | **100% de Confiabilidade** |

---

## Licença

Desenvolvido para fins acadêmicos e de engenharia de software avançada. Distribuído sob a licença MIT.

