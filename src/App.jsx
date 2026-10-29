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
  X,
  CheckCircle,
  XCircle,
  Maximize2
} from 'lucide-react';

const API_BASE_URL = "https://seletor-fotos-backend.onrender.com";

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSession, setActiveSession] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('active_session_id');
    if (savedSessionId) {
      loadSessionData(savedSessionId);
    }
  }, []);

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

  const handleExportZip = () => {
    if (activeSession) {
      window.open(`${API_BASE_URL}/api/sessions/${activeSession.id}/export`, '_blank');
    }
  };

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
              onClick={() => setCurrentView('gallery')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'gallery' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Minhas sessões
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

        {/* VIEW: GALERIA COM MINIATURAS */}
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

              <button 
                onClick={handleExportZip}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" />
                Exportar Selecionadas (ZIP)
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

            {/* Grid com Miniaturas Reais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg group hover:border-slate-700 transition-all flex flex-col"
                >
                  {/* Container da Imagem Thumbnail */}
                  <div 
                    onClick={() => setSelectedPhotoModal(photo)}
                    className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    {photo.url ? (
                      <img 
                        src={`${API_BASE_URL}${photo.url}`} 
                        alt={photo.filename} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Sem imagem</div>
                    )}

                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-slate-900/80 text-white border border-slate-700">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold shadow-md ${
                      photo.recommendation === 'Recomendada' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {photo.recommendation || 'Aguardando'}
                    </span>
                  </div>

                  {/* Informações da Análise */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <span className="font-semibold text-slate-200 text-xs truncate block">{photo.filename}</span>

                    <div className="space-y-1 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL DE AMPLIAÇÃO / ZOOM DA FOTO */}
        {selectedPhotoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header do Modal */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div>
                  <h3 className="font-bold text-white text-base">{selectedPhotoModal.filename}</h3>
                  <p className="text-xs text-slate-400">
                    Nitidez: <span className="text-slate-200 font-semibold">{selectedPhotoModal.blur_score}</span> | Exposição: <span className="text-slate-200 font-semibold">{selectedPhotoModal.exposure_status}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedPhotoModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corpo da Foto Expandida */}
              <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
                <img 
                  src={`${API_BASE_URL}${selectedPhotoModal.url}`} 
                  alt={selectedPhotoModal.filename} 
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Rodapé com Etiqueta */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedPhotoModal.recommendation === 'Recomendada' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  Status do Algoritmo: {selectedPhotoModal.recommendation}
                </span>

                <button 
                  onClick={() => setSelectedPhotoModal(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
