import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Grid, 
  SlidersHorizontal, 
  Download, 
  Zap, 
  Eye, 
  SunMedium, 
  Layers, 
  ArrowLeft, 
  User, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

const API_BASE_URL = "https://seletor-fotos-backend.onrender.com";

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSession, setActiveSession] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // 1. Função para criar nova sessão e fazer upload de fotos reais
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadStatus('Criando sessão...');

      // Criar Sessão no Backend
      const sessionRes = await fetch(`${API_BASE_URL}/api/sessions?title=Análise%20de%20Fotos`, {
        method: 'POST'
      });
      const sessionData = await sessionRes.json();
      const sessionId = sessionData.session_id;

      setUploadStatus(`Enviando ${files.length} foto(s)...`);

      // Preparar formulário de envio de arquivos
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Enviar arquivos para a API
      const uploadRes = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        setUploadStatus('Upload concluído! Carregando sessão...');
        // Abrir a sessão criada
        await loadSessionData(sessionId);
      } else {
        alert('Falha ao enviar fotografias.');
      }
    } catch (error) {
      console.error('Erro durante upload:', error);
      alert('Erro de conexão com a API.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  // 2. Buscar os dados atualizados de uma sessão do backend
  const loadSessionData = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
        setCurrentView('gallery');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da sessão:', error);
    }
  };

  const recentSessionsMock = [
    {
      id: 'sess-001',
      title: 'Aniversário da Clara',
      date: '25 de out. de 2026',
      totalPhotos: 482,
      status: 'Concluída',
      recommended: 312,
      duplicates: 98,
      review: 54,
      discarded: 18,
      coverImg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'sess-003',
      title: 'Formatura Infantil',
      date: '18 de out. de 2026',
      totalPhotos: 756,
      status: 'Concluída',
      recommended: 521,
      duplicates: 142,
      review: 73,
      discarded: 20,
      coverImg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-white">Seletor de Fotos</h1>
              <p className="text-xs text-slate-400">Seu tempo no que importa</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              Início
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors">
              <Upload className="w-4 h-4" />
              Nova análise
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors">
              <Layers className="w-4 h-4" />
              Minhas sessões
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Configurações
            </button>
          </nav>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Armazenamento</span>
            <span className="font-medium text-slate-200">12,8 GB / 100 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-[12.8%]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-end shrink-0 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3 border border-slate-800 rounded-full py-1.5 px-3 bg-slate-900 cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-200">Meu Perfil</span>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-8 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                  Selecione suas melhores fotos <span className="text-blue-400">de forma mais rápida</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Envie suas fotos, deixe a análise automática fazer o trabalho pesado e revise os resultados com praticidade.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Detecta fotos semelhantes
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    <Eye className="w-3.5 h-3.5 text-blue-400" /> Identifica fotos desfocadas
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    <SunMedium className="w-3.5 h-3.5 text-yellow-400" /> Analisa a exposição
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Area Real */}
            <div className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-all rounded-2xl p-8 bg-slate-900/30 text-center flex flex-col items-center justify-center cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">
                {isUploading ? uploadStatus : "Arraste e solte suas fotos aqui"}
              </h3>
              <p className="text-sm text-slate-400 mb-4">ou clique para selecionar do seu computador</p>
              
              <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20 cursor-pointer">
                <span>{isUploading ? "Processando..." : "Selecionar fotos"}</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/jpg" 
                  onChange={handleFileUpload} 
                  disabled={isUploading} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Recent Sessions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Sessões recentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recentSessionsMock.map((session) => (
                  <div key={session.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={session.coverImg} alt={session.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-semibold text-slate-100 text-sm">{session.title}</h4>
                        <p className="text-xs text-slate-400">{session.date} • {session.totalPhotos} fotos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Gallery Review View com dados da API */
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">{activeSession?.title || 'Sessão de Análise'}</h2>
                  <p className="text-xs text-slate-400">
                    Status: <span className="text-blue-400 font-semibold">{activeSession?.status}</span> ({activeSession?.processed_photos} / {activeSession?.total_photos} processadas)
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                <Download className="w-4 h-4" />
                Exportar Selecionadas
              </button>
            </div>

            {/* Photo Grid do Backend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {activeSession?.photos?.map((photo) => (
                <div key={photo.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">{photo.filename}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      photo.recommendation === 'Recomendada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {photo.recommendation}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <p>Nitidez: <span className="text-slate-200 font-medium">{photo.blur_score}</span></p>
                    <p>Exposição: <span className="text-slate-200 font-medium">{photo.exposure_status}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
