import React, { useState, useRef } from 'react';
import { SAMPLE_CV, EMPTY_CV } from './data/samples';
import { COLOR_THEMES } from './data/themes';
import { CVData, CVStyleConfig } from './types';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { CVEditor } from './components/CVEditor';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { PhotoManager } from './components/PhotoManager';
import { CVPaper } from './components/CVPaper';
import { ExportToolbar } from './components/ExportToolbar';
import { formatWhatsAppText } from './utils/exportUtils';
import {
  FileText,
  Palette,
  Camera,
  Eye,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export default function App() {
  const [cvData, setCvData] = useState<CVData>(SAMPLE_CV);
  const [styleConfig, setStyleConfig] = useState<CVStyleConfig>({
    themeId: 'nordic-indigo',
    layout: 'clasico',
    font: 'modern',
    photoShape: 'circle',
    showPhoto: true,
    fontSize: 'normal',
    pageBgType: 'tinted',
  });

  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [activeEditorTab, setActiveEditorTab] = useState<'todo' | 'estilos' | 'foto'>('todo');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const exportTargetRef = useRef<HTMLDivElement | null>(null);
  const getExportElement = () =>
    exportTargetRef.current || document.getElementById('cv-paper-preview');

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => {
      setGlobalToast(null);
    }, 4000);
  };

  const {
    activeField: activeMicField,
    errorMessage: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const handleFieldChange = (field: keyof CVData, value: string) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleMic = (field: keyof CVData, currentValue: string) => {
    startListening(field, currentValue, (newText) => {
      handleFieldChange(field, newText);
    });
  };

  const handleLoadSample = () => {
    setCvData(SAMPLE_CV);
    stopListening();
    showToast('Ejemplo profesional cargado.');
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas vaciar todos los campos para comenzar desde cero?')) {
      setCvData(EMPTY_CV);
      stopListening();
      showToast('Campos vaciados.');
    }
  };

  const handlePhotoChange = (url: string) => {
    setCvData((prev) => ({ ...prev, fotoUrl: url }));
  };

  const handleToggleShowPhoto = (show: boolean) => {
    setStyleConfig((prev) => ({ ...prev, showPhoto: show }));
  };

  const selectedTheme =
    COLOR_THEMES.find((t) => t.id === styleConfig.themeId) || COLOR_THEMES[0];

  const headerWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    formatWhatsAppText(cvData)
  )}`;

  return (
    <div className="min-h-screen bg-neutral-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast Feedback */}
      {globalToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs py-2.5 px-4 rounded-xl shadow-xl border border-slate-700 animate-fade-in flex items-center gap-2 max-w-sm">
          <span>{globalToast}</span>
        </div>
      )}

      {/* 1. TOP BAR */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-2xs"
            style={{ backgroundColor: selectedTheme.accent }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
              CV Studio
            </span>
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap block">
              Voz · Foto · Estilos Suaves · A4
            </span>
          </div>
        </div>

        {/* Middle Navigation / Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-slate-600">
          <span>Dictado por Voz</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Captura de Cámara</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
              style={{ backgroundColor: selectedTheme.accent }}
            />
            <span className="text-slate-700 font-semibold">{selectedTheme.name}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <span>Ejemplo</span>
          </button>
          <a
            href={headerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir WhatsApp directamente"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="no-print lg:hidden p-2.5 bg-white border-b border-neutral-200 sticky top-[53px] z-30">
        <div className="flex rounded-lg bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'editor'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editar & Estilos</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Previa CV</span>
          </button>
        </div>
      </div>

      {/* Quick Mobile Compact Export Bar (Always accessible on mobile) */}
      <div className="no-print lg:hidden px-3 pt-3">
        <ExportToolbar data={cvData} getExportElement={getExportElement} />
      </div>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =========================================
              LEFT COLUMN: Editor con Barra Lateral Deslizadora Visible
              ========================================= */}
          <aside
            className={`no-print lg:col-span-5 xl:col-span-5 lg:sticky lg:top-16 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:pr-2 space-y-4 custom-sidebar-scroll ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Quick Section Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-neutral-200 text-xs shadow-2xs sticky top-0 z-10">
              <button
                type="button"
                onClick={() => setActiveEditorTab('todo')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeEditorTab === 'todo'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-neutral-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formulario</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('estilos')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeEditorTab === 'estilos'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-neutral-50'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Colores</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('foto')}
                className={`py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeEditorTab === 'foto'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-neutral-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto</span>
              </button>
            </div>

            {/* Theme & Style Customizer */}
            {(activeEditorTab === 'todo' || activeEditorTab === 'estilos') && (
              <ThemeCustomizer
                styleConfig={styleConfig}
                onChangeStyle={setStyleConfig}
              />
            )}

            {/* Photo Manager (Webcam & Upload) */}
            {(activeEditorTab === 'todo' || activeEditorTab === 'foto') && (
              <PhotoManager
                fotoUrl={cvData.fotoUrl}
                onPhotoChange={handlePhotoChange}
                showPhoto={styleConfig.showPhoto}
                onToggleShowPhoto={handleToggleShowPhoto}
              />
            )}

            {/* Content Form Editor */}
            {activeEditorTab === 'todo' && (
              <CVEditor
                data={cvData}
                onChange={handleFieldChange}
                onReset={handleReset}
                onLoadSample={handleLoadSample}
                activeMicField={activeMicField}
                onToggleMic={handleToggleMic}
                speechError={speechError}
              />
            )}
          </aside>

          {/* =========================================
              RIGHT COLUMN: Live CV Sheet & Export
              ========================================= */}
          <div
            className={`lg:col-span-7 xl:col-span-7 space-y-4 ${
              mobileTab === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Desktop Export Toolbar: Multi-formato & WhatsApp directo */}
            <div className="no-print hidden lg:block">
              <ExportToolbar data={cvData} getExportElement={getExportElement} />
            </div>

            {/* Preview Sheet Container */}
            <div className="bg-neutral-200/60 p-3 sm:p-6 rounded-2xl border border-neutral-300/80 shadow-inner flex flex-col items-center">
              {/* Zoom Controls con Barra Deslizadora Visible */}
              <div className="no-print w-full flex items-center justify-between pb-3 mb-2 border-b border-neutral-300 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">Hoja A4</span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    · Previsualización exacta en tiempo real
                  </span>
                </div>

                {/* Barra Deslizadora de Zoom */}
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1 border border-neutral-300 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
                    Zoom:
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.05).toFixed(2))))}
                    title="Reducir zoom"
                    className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-neutral-100"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  {/* Barra lateral / control deslizador interactivo */}
                  <input
                    type="range"
                    min="0.4"
                    max="1.2"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-20 sm:w-28 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    title="Barra deslizadora de zoom"
                  />

                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.2, Number((z + 0.05).toFixed(2))))}
                    title="Aumentar zoom"
                    className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-neutral-100"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1 tabular-nums font-semibold text-slate-700">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(0.85)}
                    title="Restablecer tamaño normal"
                    className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-neutral-100 ml-0.5 border-l border-neutral-200 pl-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scaled Preview Paper */}
              <div
                className="w-full flex justify-center overflow-x-auto py-2 transition-transform duration-150 custom-sidebar-scroll"
                style={{
                  transformOrigin: 'top center',
                }}
              >
                <div
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top center',
                    marginBottom: `${-(1 - zoomLevel) * 750}px`,
                  }}
                  className="transition-all duration-150"
                >
                  <div id="cvHoja" ref={exportTargetRef} className="bg-transparent">
                    <CVPaper
                      id="cv-paper-preview"
                      data={cvData}
                      styleConfig={styleConfig}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="no-print py-3 px-6 border-t border-neutral-200 bg-white text-center text-xs text-slate-500 mt-auto">
        <p>
          Creador de Currículum Profesional con Reconocimiento de Voz y Captura de Foto · Formato A4
        </p>
      </footer>
    </div>
  );
}
