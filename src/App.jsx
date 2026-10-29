import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

const API_BASE_URL = "https://seletor-fotos-backend.onrender.com";

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'gallery', 'sessions', 'settings'
  const [activeSession, setActiveSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [blurThreshold, setBlurThreshold] = useState(60);

  const fileInputRef = useRef(null);

  // Restaurar sessão ao atualizar a página (F5)
  useEffect(() => {
    const savedSessionId = localStorage.getItem('active_session_id');
    if (savedSessionId) {
      loadSessionData(savedSessionId);
    }
  }, []);

  // Buscar dados da sessão com Polling Automático
  const loadSessionData = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
        setCurrentView('gallery');
        localStorage.setItem('active_session_id', sessionId);

        if (data.status === 'Processando' || data.processed_photos < data.total_photos) {
          setTimeout(() => loadSessionData(sessionId), 3000);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    }
  };

  // Upload de fotos
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadStatus('Criando sessão...');

      const sessionRes = await fetch(`${API_BASE_URL}/api/sessions?title=Análise%20de%20Fotos`, {
        method: 'POST'
      });
      const sessionData = await sessionRes.json();
      const sessionId = sessionData.session_id;

      setUploadStatus(`Enviando ${files.length} foto(s)...`);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const uploadRes = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        setUploadStatus('Upload concluído! Analisando...');
        loadSessionData(sessionId);
      } else {
        alert('Falha no envio.');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro de conexão com a API.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleBackToDashboard = () => {
    localStorage.removeItem('active_session_id');
    setActiveSession(null);
    setCurrentView('dashboard');
  };

  // Filtragem na galeria
  const filteredPhotos = activeSession?.photos?.filter(photo => {
    if (filterCategory === 'recommended') return photo.recommendation === 'Recomendada';
    if (filterCategory === 'review') return photo.recommendation === 'Revisar';
    return true;
  }) || [];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6 cursor-pointer" onClick={handleBackToDashboard}>
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
              onClick={handleBackToDashboard}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              Início
            </button>

            <button 
              onClick={handleBoxClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Nova análise
            </button>

            <button 
              onClick={() => setCurrentView('sessions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'sessions' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Minhas sessões
            </button>

            <button 
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'settings' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
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

        {/* Input oculto compartilhado */}
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/jpeg,image/jpg" 
          onChange={handleFileUpload} 
          disabled={isUploading} 
          className="hidden" 
        />

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
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

            {/* Caixa de Upload clicável */}
            <div 
              onClick={handleBoxClick}
              className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-all rounded-2xl p-12 bg-slate-900/30 text-center flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">
                {isUploading ? uploadStatus : "Arraste e solte suas fotos aqui"}
              </h3>
              <p className="text-sm text-slate-400 mb-6">ou clique em qualquer lugar nesta área para selecionar do computador</p>
              
              <button 
                type="button"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                {isUploading ? "Processando..." : "Selecionar fotos"}
              </button>
            </div>
          </div>
        )}

        {/* VIEW: GALERIA */}
        {currentView === 'gallery' && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToDashboard}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">{activeSession?.title || 'Sessão de Análise'}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    Status: <span className="text-blue-400 font-semibold">{activeSession?.status}</span> 
                    ({activeSession?.processed_photos} / {activeSession?.total_photos} processadas)
                    {activeSession?.status === 'Processando' && (
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                    )}
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                <Download className="w-4 h-4" />
                Exportar Selecionadas
              </button>
            </div>

            {/* Abas de Filtro */}
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Todas ({activeSession?.photos?.length || 0})
              </button>
              <button 
                onClick={() => setFilterCategory('recommended')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterCategory === 'recommended' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Recomendadas
              </button>
              <button 
                onClick={() => setFilterCategory('review')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterCategory === 'review' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Revisar
              </button>
            </div>

            {/* Grid de Fotos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">{photo.filename}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      photo.recommendation === 'Recomendada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {photo.recommendation || 'Aguardando'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <p className="flex justify-between">
                      <span>Nitidez:</span> 
                      <span className="text-slate-200 font-medium">{photo.blur_score ?? 'Calculando...'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Exposição:</span> 
                      <span className="text-slate-200 font-medium">{photo.exposure_status ?? 'Calculando...'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SESSÕES */}
        {currentView === 'sessions' && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-white">Minhas Sessões</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-4">
              <FolderOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Sua sessão atual está salva e em andamento no sistema.</p>
              {activeSession && (
                <button 
                  onClick={() => setCurrentView('gallery')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
                >
                  Abrir Sessão Atual
                </button>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CONFIGURAÇÕES */}
        {currentView === 'settings' && (
          <div className="p-8 space-y-6 max-w-4xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Configurações de Análise</h2>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-200 mb-1">Limiar de Nitidez (Variância do Laplaciano)</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Valores acima deste número serão marcados como "Recomendada". Valores abaixo serão "Revisar".
                </p>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    value={blurThreshold} 
                    onChange={(e) => setBlurThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-blue-400 w-12 text-right">{blurThreshold}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
