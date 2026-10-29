import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  Copy, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  ChevronRight, 
  User, 
  Filter, 
  Grid, 
  SlidersHorizontal, 
  Download, 
  Zap, 
  Eye, 
  SunMedium, 
  Layers, 
  ArrowLeft 
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSession, setActiveSession] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const recentSessions = [
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
      id: 'sess-002',
      title: 'Aniversário do Pedro',
      date: '28 de out. de 2026',
      totalPhotos: 623,
      status: 'Processando',
      processed: 289,
      remaining: 334,
      estimatedTime: '12 min',
      progressPercent: 67,
      coverImg: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400'
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

  const mockGalleryPhotos = [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600',
      category: 'recommended',
      title: 'IMG_4821.JPG',
      blurScore: 'Ótima (92/100)',
      exposure: 'Equilibrada',
      flags: [],
      selected: true
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',
      category: 'duplicates',
      group: 'Grupo #1 (3 fotos)',
      title: 'IMG_4822.JPG',
      blurScore: 'Boa (88/100)',
      exposure: 'Ligeiramente Clara',
      flags: ['Semelhante à IMG_4821.JPG'],
      selected: false
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
      category: 'review',
      title: 'IMG_4830.JPG',
      blurScore: 'Foco incerto (42/100)',
      exposure: 'Possível Subexposição',
      flags: ['Risco de desfoque', 'Luminosidade baixa'],
      selected: false
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
      category: 'recommended',
      title: 'IMG_4835.JPG',
      blurScore: 'Excelente (96/100)',
      exposure: 'Equilibrada',
      flags: [],
      selected: true
    }
  ];

  const handleOpenSession = (session) => {
    setActiveSession(session);
    setCurrentView('gallery');
  };

  const filteredPhotos = mockGalleryPhotos.filter(photo => {
    if (filterCategory === 'all') return true;
    return photo.category === filterCategory;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-white">Seletor de Fotos</h1>
              <p className="text-xs text-slate-400">Seu tempo no que importa</p>
            </div>
          </div>

          {/* Navigation Links */}
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

        {/* Storage Bar Indicator */}
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
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-end shrink-0 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3 border border-slate-800 rounded-full py-1.5 px-3 bg-slate-900 cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-200">Meu Perfil</span>
          </div>
        </header>

        {/* View Routing */}
        {currentView === 'dashboard' ? (
          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Hero Header */}
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

            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-all rounded-2xl p-8 bg-slate-900/30 text-center flex flex-col items-center justify-center cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Arraste e solte suas fotos aqui</h3>
              <p className="text-sm text-slate-400 mb-4">ou clique para selecionar do seu computador</p>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                Selecionar fotos
              </button>
              <p className="text-xs text-slate-500 mt-3">Você também pode enviar uma pasta compactada (ZIP)</p>
            </div>

            {/* Recent Sessions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Sessões recentes</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Ver todas as sessões <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id} 
                    onClick={() => handleOpenSession(session)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={session.coverImg} alt={session.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-semibold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">{session.title}</h4>
                          <p className="text-xs text-slate-400">{session.date} • {session.totalPhotos} fotos</p>
                        </div>
                      </div>

                      {session.status === 'Concluída' ? (
                        <div className="grid grid-cols-4 gap-1 text-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                          <div>
                            <span className="block text-xs font-bold text-emerald-400">{session.recommended}</span>
                            <span className="text-[10px] text-slate-400">Recomend.</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-blue-400">{session.duplicates}</span>
                            <span className="text-[10px] text-slate-400">Semelh.</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-amber-400">{session.review}</span>
                            <span className="text-[10px] text-slate-400">Revisar</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-400">{session.discarded}</span>
                            <span className="text-[10px] text-slate-400">Descart.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>Processando...</span>
                            <span className="font-medium text-blue-400">{session.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${session.progressPercent}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Gallery Review View */
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">{activeSession?.title || 'Galeria de Análise'}</h2>
                  <p className="text-xs text-slate-400">Revise as seleções automáticas e ajuste as fotos finais</p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                <Download className="w-4 h-4" />
                Exportar Selecionadas
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
              <button 
                onClick={() => setFilterCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Todas (4)
              </button>
              <button 
                onClick={() => setFilterCategory('recommended')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === 'recommended' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Recomendadas (2)
              </button>
              <button 
                onClick={() => setFilterCategory('duplicates')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === 'duplicates' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Semelhantes (1)
              </button>
              <button 
                onClick={() => setFilterCategory('review')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === 'review' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Revisar (1)
              </button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-slate-950">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2">
                      <input 
                        type="checkbox" 
                        defaultChecked={photo.selected} 
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{photo.title}</span>
                      <span className="text-[10px] text-slate-400">{photo.blurScore}</span>
                    </div>

                    {photo.flags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {photo.flags.map((flag, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
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
