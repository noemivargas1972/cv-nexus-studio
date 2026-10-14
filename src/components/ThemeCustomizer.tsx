import React from 'react';
import { COLOR_THEMES } from '../data/themes';
import { CVStyleConfig, TemplateLayout, FontFamilyType, PhotoShape } from '../types';
import { Palette, Layout, Type, Sparkles, Check } from 'lucide-react';

interface ThemeCustomizerProps {
  styleConfig: CVStyleConfig;
  onChangeStyle: (newConfig: CVStyleConfig) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  styleConfig,
  onChangeStyle,
}) => {
  const selectedTheme =
    COLOR_THEMES.find((t) => t.id === styleConfig.themeId) || COLOR_THEMES[0];

  const handleThemeSelect = (themeId: string) => {
    onChangeStyle({ ...styleConfig, themeId });
  };

  const handleLayoutSelect = (layout: TemplateLayout) => {
    onChangeStyle({ ...styleConfig, layout });
  };

  const handleFontSelect = (font: FontFamilyType) => {
    onChangeStyle({ ...styleConfig, font });
  };

  const handlePhotoShapeSelect = (photoShape: PhotoShape) => {
    onChangeStyle({ ...styleConfig, photoShape });
  };

  const handlePageBgSelect = (pageBgType: 'tinted' | 'white' | 'warm') => {
    onChangeStyle({ ...styleConfig, pageBgType });
  };

  return (
    <div className="space-y-5 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-800" />
          <h3 className="text-sm font-semibold text-slate-900">
            Personalización de Estilos y Colores
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          Tonos suaves y armoniosos
        </span>
      </div>

      {/* 1. Curated Soft Palettes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          1. Paleta de Color (Tonos Suaves & Elegantes)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COLOR_THEMES.map((theme) => {
            const isSelected = theme.id === styleConfig.themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeSelect(theme.id)}
                className={`relative flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  {/* Swatches */}
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: theme.accentSoft }}
                  />
                  <div
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: theme.bgPaper }}
                  />
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 ml-auto" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {theme.name}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {theme.description.split('.')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Template Layouts */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Layout className="w-3.5 h-3.5 text-slate-700" />
          <label className="block text-xs font-semibold text-slate-700">
            2. Estilo de Plantilla
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {
              id: 'clasico' as TemplateLayout,
              label: 'Clásico Limpio',
              desc: 'Encabezado con foto y líneas divisorias',
            },
            {
              id: 'ejecutivo' as TemplateLayout,
              label: 'Ejecutivo Split',
              desc: 'Columna lateral tintada para contacto',
            },
            {
              id: 'editorial' as TemplateLayout,
              label: 'Editorial',
              desc: 'Tipografía refinada con serifa',
            },
            {
              id: 'compacto' as TemplateLayout,
              label: 'Compacto Moderno',
              desc: 'Estructura ágil y concisa',
            },
          ].map((layout) => {
            const isSelected = styleConfig.layout === layout.id;
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => handleLayoutSelect(layout.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 font-medium shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-neutral-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    {layout.label}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-slate-900" />}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">
                  {layout.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography & Paper Tone Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-neutral-100">
        {/* Tipografía */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
            <Type className="w-3 h-3 text-slate-500" />
            <span>Tipografía</span>
          </label>
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-neutral-50">
            <button
              type="button"
              onClick={() => handleFontSelect('modern')}
              className={`flex-1 py-1 px-2 text-xs rounded-md transition-colors ${
                styleConfig.font === 'modern'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sans Pulcro
            </button>
            <button
              type="button"
              onClick={() => handleFontSelect('editorial')}
              className={`flex-1 py-1 px-2 text-xs rounded-md font-editorial transition-colors ${
                styleConfig.font === 'editorial'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => handleFontSelect('geometric')}
              className={`flex-1 py-1 px-2 text-xs rounded-md font-geometric transition-colors ${
                styleConfig.font === 'geometric'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Geométrico
            </button>
          </div>
        </div>

        {/* Fondo del papel */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Fondo de Hoja
          </label>
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-neutral-50">
            <button
              type="button"
              onClick={() => handlePageBgSelect('tinted')}
              className={`flex-1 py-1 px-1.5 text-xs rounded-md transition-colors ${
                styleConfig.pageBgType === 'tinted'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tono Suave
            </button>
            <button
              type="button"
              onClick={() => handlePageBgSelect('white')}
              className={`flex-1 py-1 px-1.5 text-xs rounded-md transition-colors ${
                styleConfig.pageBgType === 'white'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blanco
            </button>
            <button
              type="button"
              onClick={() => handlePageBgSelect('warm')}
              className={`flex-1 py-1 px-1.5 text-xs rounded-md transition-colors ${
                styleConfig.pageBgType === 'warm'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lino Cálido
            </button>
          </div>
        </div>

        {/* Forma de foto */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Corte de Fotografía
          </label>
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-neutral-50">
            <button
              type="button"
              onClick={() => handlePhotoShapeSelect('circle')}
              className={`flex-1 py-1 px-2 text-xs rounded-md transition-colors ${
                styleConfig.photoShape === 'circle'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circular
            </button>
            <button
              type="button"
              onClick={() => handlePhotoShapeSelect('rounded')}
              className={`flex-1 py-1 px-2 text-xs rounded-md transition-colors ${
                styleConfig.photoShape === 'rounded'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suave
            </button>
            <button
              type="button"
              onClick={() => handlePhotoShapeSelect('square')}
              className={`flex-1 py-1 px-2 text-xs rounded-md transition-colors ${
                styleConfig.photoShape === 'square'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
