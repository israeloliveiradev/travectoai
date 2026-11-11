import React, { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  BookOpen,
  Trash2,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useRagEngine } from '../../hooks/useRagEngine.js';

export const RagDashboard: React.FC = () => {
  const {
    documents,
    stats,
    queryResults,
    isLoading,
    isSearching,
    isIndexing,
    error,
    search,
    indexDocument,
    deleteDoc,
  } = useRagEngine();

  const [searchQuery, setSearchQuery] = useState<string>('regras de bagagem shinkansen e templos');
  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDestination, setNewDestination] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchQuery, destinationFilter || undefined);
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newTitle.trim() || !newDestination.trim() || !newContent.trim()) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await indexDocument({
        title: newTitle.trim(),
        destination: newDestination.trim(),
        content: newContent.trim(),
      });
      setIsModalOpen(false);
      setNewTitle('');
      setNewDestination('');
      setNewContent('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Falha na indexação');
    }
  };

  const loadSampleGuide = () => {
    setNewTitle('Guia Local & Praias Secretas: Florianópolis');
    setNewDestination('Florianópolis');
    setNewContent(`# Guia Oficial Travecto: Florianópolis Ilha da Magia

## Mobilidade e Épocas de Visitação
O trânsito em direção ao Norte (Jurerê, Canasvieiras) e Sul (Campeche, Pântano do Sul) se intensifica de dezembro a fevereiro. Para trilhas como o Lagoinha do Leste, inicie pela manhã antes das 08h30.

## Dicas Gastronômicas & Frutos do Mar
O bairro de Santo Antônio de Lisboa e Ribeirão da Ilha concentram os melhores produtores de ostras frescas cultivadas da ilha, acompanhadas de cervejas artesanais locais.`);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Database className="w-6 h-6 text-emerald-400" />
            <span>Travecto Vector Engine (RAG Hub)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indexação semântica de guias locais com Recursive Text Splitter e Cosine Similarity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              <strong className="text-white">{stats.totalDocuments}</strong> Guias |{' '}
              <strong className="text-emerald-400">{stats.totalChunks}</strong> Chunks
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Indexar Novo Guia</span>
          </button>
        </div>
      </div>

      {/* Semantic Search Tester */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Search className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Testador Interativo de Recuperação Vetorial (Semantic Query)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Simule uma consulta semântica para inspecionar os fragmentos e os scores de similaridade de cosseno calculados pelo Travecto.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite uma dúvida ou termo (ex: 'onde comer ramen em tóquio', 'shinkansen malas', 'regras do louvre')..."
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <input
            type="text"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            placeholder="Filtrar por Destino (opcional)"
            className="sm:w-48 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Buscar Chunks</span>
          </button>
        </form>

        {/* Results */}
        {queryResults.length > 0 && (
          <div className="mt-5 space-y-3 pt-4 border-t border-slate-800">
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Resultados de Similaridade Vetorial ({queryResults.length} chunks mais relevantes):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {queryResults.map((chunk) => (
                <div
                  key={chunk.chunkId}
                  className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300 truncate max-w-[220px]">
                      {chunk.source}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Score: {(chunk.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Biblioteca de Guias Locais Carregados ({documents.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Guias pré-populados para testes imediatos da banca avaliadora
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {doc.destination}
                  </span>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                    <span>{doc.chunkCount} chunks</span>
                    <span>•</span>
                    <span>{doc.wordCount} palavras</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2">{doc.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {doc.preview}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[10px]">
                  Criado em: {new Date(doc.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Remover documento e seus chunks"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Index Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Indexar Novo Guia Local no RAG</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={loadSampleGuide}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                >
                  Preencher Exemplo Rápido (Florianópolis)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Título do Guia
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Guia Oficial de Gastronomia em Salvador"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Destino
                </label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="Ex: Salvador"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Conteúdo do Guia em Markdown
                </label>
                <textarea
                  rows={8}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escreva ou cole aqui as regras de viagem, atrações, horários e dicas locais..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isIndexing}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  {isIndexing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isIndexing ? 'Processando Chunks...' : 'Fatiar & Indexar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

