import React from 'react';
import { CVData } from '../types';
import {
  Mic,
  MicOff,
  User,
  Briefcase,
  MapPin,
  Mail,
  Award,
  BookOpen,
  Users,
  Wrench,
  Globe,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface CVEditorProps {
  data: CVData;
  onChange: (field: keyof CVData, value: string) => void;
  onReset: () => void;
  onLoadSample: () => void;
  activeMicField: string | null;
  onToggleMic: (field: keyof CVData, currentValue: string) => void;
  speechError: string | null;
}

export const CVEditor: React.FC<CVEditorProps> = ({
  data,
  onChange,
  onReset,
  onLoadSample,
  activeMicField,
  onToggleMic,
  speechError,
}) => {
  const renderField = (
    key: keyof CVData,
    label: string,
    placeholder: string,
    type: 'input' | 'textarea' = 'input',
    icon: React.ReactNode,
    rows: number = 3
  ) => {
    const isListening = activeMicField === key;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-500">{icon}</span>
            <span>{label}</span>
          </label>
          {isListening && (
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Escuchando dictado...
            </span>
          )}
        </div>

        <div className="flex gap-1.5 items-start">
          {type === 'textarea' ? (
            <textarea
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs leading-relaxed text-slate-800 transition-colors focus:outline-hidden ${
                isListening
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                  : 'border-slate-200 focus:border-slate-400 bg-white'
              }`}
            />
          ) : (
            <input
              type="text"
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs text-slate-800 transition-colors focus:outline-hidden ${
                isListening
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                  : 'border-slate-200 focus:border-slate-400 bg-white'
              }`}
            />
          )}

          <button
            type="button"
            onClick={() => onToggleMic(key, data[key])}
            title={isListening ? 'Detener dictado' : `Dictar por voz para ${label}`}
            className={`shrink-0 p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              isListening
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-slate-700 border border-neutral-200'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline text-[10px]">Detener</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline text-[10px]">Voz</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs">
      {/* Editor toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Datos del Currículum</h3>
          <p className="text-[11px] text-slate-500">
            Escribe o usa el micrófono para dictar tus datos en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-slate-600" />
            <span>Cargar Ejemplo</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {speechError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
          {speechError}
        </div>
      )}

      {/* Grid of basic identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {renderField(
          'nombre',
          'Nombre y Apellido',
          'Ej: Noemí Vargas',
          'input',
          <User className="w-3.5 h-3.5" />
        )}
        {renderField(
          'puesto',
          'Puesto o Título Profesional',
          'Ej: Coordinadora de Operaciones y Logística',
          'input',
          <Briefcase className="w-3.5 h-3.5" />
        )}
        {renderField(
          'contacto',
          'Ubicación y Teléfono',
          'Ej: Buenos Aires, CABA · (+54) 11 4892-3401',
          'input',
          <MapPin className="w-3.5 h-3.5" />
        )}
        {renderField(
          'redes',
          'Correo y Perfil / Redes',
          'Ej: correo@ejemplo.com · linkedin.com/in/...',
          'input',
          <Mail className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Profile & Strengths */}
      {renderField(
        'fortalezas',
        'Resumen Profesional y Fortalezas',
        'Describe brevemente tu perfil, cualidades clave y qué te destaca...',
        'textarea',
        <Award className="w-3.5 h-3.5" />,
        4
      )}

      {/* Work experience */}
      {renderField(
        'experiencia',
        'Experiencia Laboral',
        'Detalla tus cargos anteriores, empresas, años y logros principales...',
        'textarea',
        <Briefcase className="w-3.5 h-3.5" />,
        5
      )}

      {/* Education */}
      {renderField(
        'educacion',
        'Educación y Formación',
        'Títulos universitarios, terciarios, diplomaturas o cursos...',
        'textarea',
        <BookOpen className="w-3.5 h-3.5" />,
        3
      )}

      {/* Skills and languages in 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {renderField(
          'habilidades',
          'Habilidades y Competencias',
          'Ej: SAP, Liderazgo de Equipos, Excel Avanzado...',
          'input',
          <Wrench className="w-3.5 h-3.5" />
        )}
        {renderField(
          'idiomas',
          'Idiomas',
          'Ej: Español (Nativo), Inglés (Intermedio laboral)',
          'input',
          <Globe className="w-3.5 h-3.5" />
        )}
      </div>

      {/* References */}
      {renderField(
        'referencias',
        'Referencias Laborales o de Contacto',
        'Ej: Ing. Martín Domínguez — Gerente de Operaciones (Tel: 11 5543-9821)',
        'textarea',
        <Users className="w-3.5 h-3.5" />,
        2
      )}
    </div>
  );
};
