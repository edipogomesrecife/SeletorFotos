import React, { useState, useRef } from 'react';
import {
Camera, Upload, Folder, CheckCircle2, AlertTriangle,
Copy, ChevronRight, Eye, RefreshCw,
Download, Settings, HardDrive, User, Check, X, Sliders, Info,
Sparkles, Layers, ShieldCheck, Sun, Grid
} from 'lucide-react';
const API_BASE_URL = 'http://localhost:8000/api';
export default function App() {
const [currentView, setCurrentView] = useState('dashboard');
const [selectedSessionId, setSelectedSessionId] = useState(null);
const [sessions, setSessions] = useState([
{
id: 'sess_01',
title: 'Aniversário da Clara',
date: '25 de out. de 2026',
totalFiles: 482,
processedFiles: 482,
status: 'completed',
coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400',
stats: { recommended: 312, similar: 98, review: 54, discarded: 18 }
},
{
id: 'sess_02',
title: 'Aniversário do Pedro',
date: '28 de out. de 2026',
totalFiles: 623,
processedFiles: 417,
status: 'processing',
progress: 67,
estimatedTime: '12 min',
coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
stats: { analyzed: 289, remaining: 334 }
},
{
id: 'sess_03',
title: 'Formatura Infantil',
date: '18 de out. de 2026',
totalFiles: 756,
processedFiles: 756,
status: 'completed',
coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400',
stats: { recommended: 521, similar: 142, review: 73, discarded: 20 }
}
]);
const [activePhotoFilter, setActivePhotoFilter] = useState('all');
const [selectedPhotoForModal, setSelectedPhotoForModal] = useState(null);
const [compareMode, setCompareMode] = useState(false);
const [photos, setPhotos] = useState([
{
id: 'p1',
filename: 'IMG_4012.JPG',
url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
status: 'recommended',
blurScore: 142.5,
isBlurry: false,
exposure: 'balanced',
duplicateGroupId: 'group_A',
isGroupRepresentative: true,
decision: 'approved',
flags: []
},
{
id: 'p2',
filename: 'IMG_4013.JPG',
url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
status: 'similar',
blurScore: 138.2,
isBlurry: false,
exposure: 'balanced',
duplicateGroupId: 'group_A',
isGroupRepresentative: false,
decision: 'pending',
flags: ['Semelhante a IMG_4012']
},
{
id: 'p3',
filename: 'IMG_4014.JPG',
url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
status: 'review',
blurScore: 45.1,
isBlurry: true,
exposure: 'balanced',
duplicateGroupId: null,
isGroupRepresentative: false,
decision: 'pending',
flags: ['Alerta de Desfoque (Métrica: 45.1)']
},
{
id: 'p4',
filename: 'IMG_4015.JPG',
url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
status: 'review',
blurScore: 120.0,
isBlurry: false,
exposure: 'overexposed',
duplicateGroupId: null,
isGroupRepresentative: false,
decision: 'pending',
flags: ['Possível Superexposição (Altas luzes 18%)']
}
]);
const fileInputRef = useRef(null);
const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const handleFileUpload = async (files) => {
if (!files || files.length === 0) return;
setIsUploading(true);
setUploadProgress(10);
    try {
      const sessionRes = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Novo Lote (${files.length} fotos)` })
      }).catch(() => null);

      let newSessionId = `sess_${Date.now()}`;
      if (sessionRes && sessionRes.ok) {
        const data = await sessionRes.json();
        newSessionId = data.id;
      }

      for (let i = 20; i <= 100; i += 20) {
        await new Promise((res) => setTimeout(res, 200));
        setUploadProgress(i);
      }

      const newSession = {
        id: newSessionId,
        title: `Lote ${sessions.length + 1}`,
        date: 'Hoje',
        totalFiles: files.length,
        processedFiles: 0,
        status: 'processing',
        progress: 5,
        estimatedTime: 'Calculando...',
        coverImage: URL.createObjectURL(files[0]),
        stats: { analyzed: 0, remaining: files.length }
      };

      setSessions([newSession, ...sessions]);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      console.error('Erro no upload:', err);
      setIsUploading(false);
    }
};
const handleDecision = (photoId, decision) => {
setPhotos((prev) =>
prev.map((p) => (p.id === photoId ? { ...p, decision } : p))
);
    fetch(`${API_BASE_URL}/photos/${photoId}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision })
    }).catch(() => {});
};
const filteredPhotos = photos.filter((p) => {
if (activePhotoFilter === 'all') return true;
if (activePhotoFilter === 'recommended') return p.status === 'recommended';
if (activePhotoFilter === 'similar') return p.status === 'similar';
if (activePhotoFilter === 'review') return p.status === 'review';
if (activePhotoFilter === 'discarded') return p.decision === 'discarded';
return true;
});
return (
<div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
{/* SIDEBAR NAVIGATION /}
<aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
<div className="space-y-6">
{/ Logo Brand */}
<div className="flex items-center gap-3 px-2 py-1">
<div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
<Camera className="w-5 h-5 text-white" />
</div>
<div>
<h1 className="font-bold text-sm tracking-tight text-white leading-none">
Seletor de Fotos
</h1>
<p className="text-[10px] text-slate-400 mt-1">Seu tempo no que importa</p>
</div>
</div>
          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              Início
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all"
            >
              <Upload className="w-4 h-4" />
              Nova análise
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all"
            >
              <Layers className="w-4 h-4" />
              Minhas sessões
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all">
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </nav>
        </div>

        {/* Storage Bar Indicator */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" /> Armazenamento
            </span>
            <span>12,8 GB / 100 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[12.8%]" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            {currentView === 'session' && (
              <>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Sessões
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">Aniversário da Clara</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all border border-slate-700">
              <User className="w-3.5 h-3.5" /> Meu Perfil
            </button>
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <main className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  Selecione suas melhores fotos <br />
                  <span className="text-blue-500">de forma mais rápida</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Envie suas fotos, deixe a análise automática fazer o trabalho pesado e revise os resultados com praticidade.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Detecta fotos semelhantes
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                    Identifica fotos desfocadas
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
                    <Sun className="w-3.5 h-3.5 text-orange-400" />
                    Analisa a exposição
                  </div>
                </div>
              </div>

              {/* Decorative Overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800')" }} />
            </div>

            {/* DRAG & DROP UPLOAD BOX */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/40 hover:bg-slate-900/60 transition-all rounded-3xl p-10 text-center cursor-pointer group relative overflow-hidden"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,.zip"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              {isUploading ? (
                <div className="space-y-4 max-w-xs mx-auto">
                  <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                  <p className="text-sm font-medium text-slate-300">Enviando e registrando imagens...</p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Arraste e solte suas fotos aqui</p>
                    <p className="text-xs text-slate-400 mt-1">ou clique para selecionar do computador</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all inline-flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Selecionar fotos
                  </button>
                  <p className="text-[11px] text-slate-500">Você também pode enviar uma pasta compactada (ZIP)</p>
                </div>
              )}

              {/* Upload specs footer */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-left">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Formatos aceitos</p>
                    <p className="text-[10px] text-slate-500">JPEG, JPG (recomendado)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Quantidade</p>
                    <p className="text-[10px] text-slate-500">Até 1.000 fotos por sessão</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Tamanho total</p>
                    <p className="text-[10px] text-slate-500">Máximo de 5 GB por sessão</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Seus arquivos são privados</p>
                    <p className="text-[10px] text-slate-500">Usados apenas para sua análise</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT SESSIONS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Sessões recentes</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Ver todas as sessões <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => {
                      setSelectedSessionId(sess.id);
                      setCurrentView('session');
                    }}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={sess.coverImage}
                        alt={sess.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        {sess.status === 'completed' ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Concluída
                          </span>
                        ) : (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processando
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {sess.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {sess.date} • {sess.totalFiles} fotos
                        </p>
                      </div>

                      {sess.status === 'processing' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Progresso</span>
                            <span className="font-semibold text-white">{sess.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: `${sess.progress}%` }} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-400">
                            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                              <p className="font-bold text-white text-xs">{sess.stats.analyzed}</p>
                              <p>Analisadas</p>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                              <p className="font-bold text-white text-xs">{sess.stats.remaining}</p>
                              <p>Restantes</p>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                              <p className="font-bold text-white text-xs">{sess.estimatedTime}</p>
                              <p>Tempo est.</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] border-t border-slate-800/80 pt-3">
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                            <p className="font-bold text-emerald-400 text-xs">{sess.stats.recommended}</p>
                            <p className="text-slate-400 mt-0.5">Recomend.</p>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                            <p className="font-bold text-blue-400 text-xs">{sess.stats.similar}</p>
                            <p className="text-slate-400 mt-0.5">Semelh.</p>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                            <p className="font-bold text-amber-400 text-xs">{sess.stats.review}</p>
                            <p className="text-slate-400 mt-0.5">Revisar</p>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                            <p className="font-bold text-rose-400 text-xs">{sess.stats.discarded}</p>
                            <p className="text-slate-400 mt-0.5">Descart.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* GALLERY / SESSION REVIEW VIEW */}
        {currentView === 'session' && (
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* GALLERY TOOLBAR & FILTERS */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePhotoFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePhotoFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todas ({photos.length})
                </button>
                <button
                  onClick={() => setActivePhotoFilter('recommended')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activePhotoFilter === 'recommended'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Recomendadas (1)
                </button>
                <button
                  onClick={() => setActivePhotoFilter('similar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activePhotoFilter === 'similar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-blue-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" /> Semelhantes (1)
                </button>
                <button
                  onClick={() => setActivePhotoFilter('review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activePhotoFilter === 'review'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Revisar (2)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    compareMode
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {compareMode ? 'Sair do Modo Comparação' : 'Comparar Lado a Lado'}
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-1.5 rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Exportar Selecionadas (ZIP)
                </button>
              </div>
            </div>

            {/* GALLERY GRID AREA */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`bg-slate-950 border rounded-2xl overflow-hidden group flex flex-col justify-between transition-all ${
                      photo.decision === 'approved'
                        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                        : photo.decision === 'discarded'
                        ? 'border-rose-500/30 opacity-60'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* PHOTO THUMBNAIL CONTAINER */}
                    <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* BADGES OVERLAY */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {photo.status === 'recommended' && (
                          <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur flex items-center gap-1">
                            <Check className="w-3 h-3" /> Recomendada
                          </span>
                        )}
                        {photo.status === 'similar' && (
                          <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Semelhante
                          </span>
                        )}
                        {photo.isBlurry && (
                          <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Desfocada
                          </span>
                        )}
                      </div>

                      {/* EYE ZOOM BUTTON */}
                      <button
                        onClick={() => setSelectedPhotoForModal(photo)}
                        className="absolute bottom-2 right-2 p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* PHOTO METRICS & DETAILS */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-white truncate">{photo.filename}</p>
                        {photo.flags.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {photo.flags.map((flag, idx) => (
                              <p key={idx} className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
                                <Info className="w-3 h-3 shrink-0" /> {flag}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* DECISION BUTTONS */}
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3">
                        <button
                          onClick={() => handleDecision(photo.id, 'approved')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            photo.decision === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleDecision(photo.id, 'discarded')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            photo.decision === 'discarded'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> Descartar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* INSPECTION / DETAIL MODAL */}
      {selectedPhotoForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px]">
              <img
                src={selectedPhotoForModal.url}
                alt={selectedPhotoForModal.filename}
                className="max-h-[80vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedPhotoForModal(null)}
                className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-full border border-slate-700 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">{selectedPhotoForModal.filename}</h3>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">Pontuação de Nitidez</span>
                    <p className="font-bold text-white text-sm">
                      {selectedPhotoForModal.blurScore}{' '}
                      <span className="text-[10px] font-normal text-slate-400">(Variância Laplaciana)</span>
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">Diagnóstico de Exposição</span>
                    <p className="font-bold text-white text-sm capitalize">{selectedPhotoForModal.exposure}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-6">
                <button
                  onClick={() => {
                    handleDecision(selectedPhotoForModal.id, 'approved');
                    setSelectedPhotoForModal(null);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Manter / Aprovar Foto
                </button>
                <button
                  onClick={() => {
                    handleDecision(selectedPhotoForModal.id, 'discarded');
                    setSelectedPhotoForModal(null);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  Marcar para Descarte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
);
}
