import React from 'react';
import { CVData, CVStyleConfig, ColorTheme } from '../types';
import { COLOR_THEMES } from '../data/themes';
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Globe,
  Sparkles,
} from 'lucide-react';

interface CVPaperProps {
  data: CVData;
  styleConfig: CVStyleConfig;
  id?: string;
  className?: string;
}

export const CVPaper: React.FC<CVPaperProps> = ({
  data,
  styleConfig,
  id = 'cv-paper-preview',
  className = '',
}) => {
  const theme: ColorTheme =
    COLOR_THEMES.find((t) => t.id === styleConfig.themeId) || COLOR_THEMES[0];

  const getFontFamilyClass = () => {
    switch (styleConfig.font) {
      case 'editorial':
        return 'font-editorial';
      case 'geometric':
        return 'font-geometric';
      case 'modern':
      default:
        return 'font-modern';
    }
  };

  const getPhotoShapeClass = () => {
    switch (styleConfig.photoShape) {
      case 'circle':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-xl';
      case 'square':
      default:
        return 'rounded-xs';
    }
  };

  const getPageBg = () => {
    switch (styleConfig.pageBgType) {
      case 'white':
        return '#ffffff';
      case 'warm':
        return '#faf8f5';
      case 'tinted':
      default:
        return theme.bgPaper;
    }
  };

  const renderFormattedParagraphs = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => {
      const lines = paragraph.split('\n');
      return (
        <div key={idx} className="mb-3 last:mb-0">
          {lines.map((line, lineIdx) => {
            const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
            const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line;
            return (
              <div
                key={lineIdx}
                className={`text-[12px] leading-relaxed ${
                  isBullet ? 'flex items-start gap-1.5 pl-1.5' : ''
                }`}
                style={{ color: theme.textBody }}
              >
                {isBullet && (
                  <span
                    className="font-bold shrink-0 mt-0.5 select-none"
                    style={{ color: theme.accent }}
                  >
                    •
                  </span>
                )}
                <span className={isBullet ? 'flex-1' : ''}>{cleanLine}</span>
              </div>
            );
          })}
        </div>
      );
    });
  };

  const skillsList = data.habilidades
    ? data.habilidades
        .split(/[,•\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // ==========================================
  // 1. TEMPLATE: EJECUTIVO SPLIT (2 COLUMNS)
  // ==========================================
  if (styleConfig.layout === 'ejecutivo') {
    return (
      <div
        id={id}
        className={`w-full min-h-[297mm] max-w-[210mm] mx-auto text-left shadow-md flex flex-col sm:flex-row transition-colors duration-200 ${getFontFamilyClass()} ${className}`}
        style={{
          backgroundColor: getPageBg(),
          color: theme.textBody,
        }}
      >
        {/* Left Column (Sidebar) */}
        <aside
          className="w-full sm:w-[32%] p-6 sm:p-7 shrink-0 border-b sm:border-b-0 sm:border-r"
          style={{
            backgroundColor: theme.sidebarBg || theme.accentSoft,
            borderColor: theme.borderSubtle,
          }}
        >
          {/* Photo */}
          {styleConfig.showPhoto && data.fotoUrl && (
            <div className="mb-6 flex justify-center sm:justify-start">
              <img
                src={data.fotoUrl}
                alt={data.nombre || 'Foto CV'}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className={`w-28 h-28 object-cover border-2 shadow-xs ${getPhotoShapeClass()}`}
                style={{ borderColor: theme.accent }}
              />
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-4 text-xs">
            <div>
              <h4
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: theme.accent }}
              >
                Contacto
              </h4>
              <div className="space-y-1.5 text-[11.5px]" style={{ color: theme.textBody }}>
                {data.contacto && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.accentSecondary }} />
                    <span className="break-words">{data.contacto}</span>
                  </div>
                )}
                {data.redes && (
                  <div className="flex items-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.accentSecondary }} />
                    <span className="break-words">{data.redes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {skillsList.length > 0 && (
              <div>
                <h4
                  className="text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.accent }}
                >
                  Competencias
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium border"
                      style={{
                        backgroundColor: theme.chipBg,
                        color: theme.accent,
                        borderColor: theme.borderSubtle,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.idiomas && (
              <div>
                <h4
                  className="text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.accent }}
                >
                  Idiomas
                </h4>
                <p className="text-[11.5px] leading-relaxed" style={{ color: theme.textBody }}>
                  {data.idiomas}
                </p>
              </div>
            )}

            {/* References */}
            {data.referencias && (
              <div>
                <h4
                  className="text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.accent }}
                >
                  Referencias
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: theme.textBody }}>
                  {data.referencias}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Column (Main content) */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="pb-4 border-b" style={{ borderColor: theme.borderSubtle }}>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
              style={{ color: theme.accent }}
            >
              {data.nombre || 'Nombre y Apellido'}
            </h1>
            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: theme.accentSecondary }}
            >
              {data.puesto || 'Puesto o Título Profesional'}
            </p>
          </div>

          {/* Strengths & Profile */}
          {data.fortalezas && (
            <section>
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: theme.accent }}
              >
                <Award className="w-3.5 h-3.5" />
                Perfil y Fortalezas
              </h3>
              <p
                className="text-[12px] leading-relaxed text-justify"
                style={{ color: theme.textBody }}
              >
                {data.fortalezas}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experiencia && (
            <section>
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
                style={{ color: theme.accent }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experiencia Laboral
              </h3>
              <div className="space-y-3">{renderFormattedParagraphs(data.experiencia)}</div>
            </section>
          )}

          {/* Education */}
          {data.educacion && (
            <section>
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
                style={{ color: theme.accent }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Educación y Formación
              </h3>
              <div className="space-y-2">{renderFormattedParagraphs(data.educacion)}</div>
            </section>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // 2. TEMPLATE: EDITORIAL SERIF
  // ==========================================
  if (styleConfig.layout === 'editorial') {
    return (
      <div
        id={id}
        className={`w-full min-h-[297mm] max-w-[210mm] mx-auto text-left p-8 sm:p-11 shadow-md transition-colors duration-200 ${getFontFamilyClass()} ${className}`}
        style={{
          backgroundColor: getPageBg(),
          color: theme.textBody,
        }}
      >
        {/* Editorial Top Masthead */}
        <header className="text-center pb-6 border-b-2" style={{ borderColor: theme.accent }}>
          {styleConfig.showPhoto && data.fotoUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={data.fotoUrl}
                alt={data.nombre}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className={`w-24 h-24 object-cover border shadow-2xs ${getPhotoShapeClass()}`}
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>
          )}

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-1.5 font-editorial"
            style={{ color: theme.accent }}
          >
            {data.nombre || 'Nombre y Apellido'}
          </h1>

          <p
            className="text-sm uppercase tracking-widest font-medium mb-3"
            style={{ color: theme.accentSecondary }}
          >
            {data.puesto || 'Puesto o Título Profesional'}
          </p>

          {/* Contact Bar */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-xs"
            style={{ color: theme.textMuted }}
          >
            {data.contacto && <span>{data.contacto}</span>}
            {data.contacto && data.redes && <span>·</span>}
            {data.redes && <span>{data.redes}</span>}
          </div>
        </header>

        {/* Main Content Flow */}
        <div className="py-6 space-y-6">
          {/* Resumen */}
          {data.fortalezas && (
            <section>
              <div className="flex items-center gap-3 mb-2.5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Resumen y Perfil
                </h3>
                <div className="flex-1 h-px" style={{ backgroundColor: theme.borderSubtle }} />
              </div>
              <p className="text-[12px] leading-relaxed text-justify" style={{ color: theme.textBody }}>
                {data.fortalezas}
              </p>
            </section>
          )}

          {/* Experiencia */}
          {data.experiencia && (
            <section>
              <div className="flex items-center gap-3 mb-2.5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Trayectoria Profesional
                </h3>
                <div className="flex-1 h-px" style={{ backgroundColor: theme.borderSubtle }} />
              </div>
              <div className="space-y-3">{renderFormattedParagraphs(data.experiencia)}</div>
            </section>
          )}

          {/* Educación */}
          {data.educacion && (
            <section>
              <div className="flex items-center gap-3 mb-2.5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Formación Académica
                </h3>
                <div className="flex-1 h-px" style={{ backgroundColor: theme.borderSubtle }} />
              </div>
              <div className="space-y-2">{renderFormattedParagraphs(data.educacion)}</div>
            </section>
          )}

          {/* Skills & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {skillsList.length > 0 && (
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: theme.accent }}
                >
                  Habilidades & Métodos
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-[11px] rounded border"
                      style={{
                        backgroundColor: theme.accentSoft,
                        borderColor: theme.borderSubtle,
                        color: theme.accent,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.idiomas && (
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: theme.accent }}
                >
                  Idiomas
                </h4>
                <p className="text-[11.5px]" style={{ color: theme.textBody }}>
                  {data.idiomas}
                </p>
              </div>
            )}
          </div>

          {/* References */}
          {data.referencias && (
            <section className="pt-2">
              <div className="flex items-center gap-3 mb-2">
                <h4
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Referencias
                </h4>
                <div className="flex-1 h-px" style={{ backgroundColor: theme.borderSubtle }} />
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: theme.textBody }}>
                {data.referencias}
              </p>
            </section>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. TEMPLATE: COMPACTO MODERNO
  // ==========================================
  if (styleConfig.layout === 'compacto') {
    return (
      <div
        id={id}
        className={`w-full min-h-[297mm] max-w-[210mm] mx-auto text-left p-6 sm:p-7 shadow-md transition-colors duration-200 ${getFontFamilyClass()} ${className}`}
        style={{
          backgroundColor: getPageBg(),
          color: theme.textBody,
        }}
      >
        {/* Compact Top Header */}
        <header
          className="flex items-center gap-5 p-4 rounded-xl border mb-5"
          style={{
            backgroundColor: theme.accentSoft,
            borderColor: theme.borderSubtle,
          }}
        >
          {styleConfig.showPhoto && data.fotoUrl && (
            <img
              src={data.fotoUrl}
              alt={data.nombre}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className={`w-20 h-20 object-cover border-2 shrink-0 ${getPhotoShapeClass()}`}
              style={{ borderColor: theme.accent }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-bold tracking-tight truncate"
              style={{ color: theme.accent }}
            >
              {data.nombre || 'Nombre y Apellido'}
            </h1>
            <p
              className="text-xs font-semibold tracking-wide mb-1.5"
              style={{ color: theme.accentSecondary }}
            >
              {data.puesto || 'Puesto o Título Profesional'}
            </p>
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
              style={{ color: theme.textMuted }}
            >
              {data.contacto && <span>{data.contacto}</span>}
              {data.contacto && data.redes && <span>·</span>}
              {data.redes && <span>{data.redes}</span>}
            </div>
          </div>
        </header>

        {/* Compact Sections Grid */}
        <div className="space-y-4">
          {data.fortalezas && (
            <section className="p-3.5 rounded-lg border bg-white/70" style={{ borderColor: theme.borderSubtle }}>
              <h3
                className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: theme.accent }}
              >
                Perfil y Fortalezas
              </h3>
              <p className="text-[11.5px] leading-relaxed" style={{ color: theme.textBody }}>
                {data.fortalezas}
              </p>
            </section>
          )}

          {data.experiencia && (
            <section className="p-3.5 rounded-lg border bg-white/70" style={{ borderColor: theme.borderSubtle }}>
              <h3
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: theme.accent }}
              >
                Experiencia Laboral
              </h3>
              <div className="space-y-2">{renderFormattedParagraphs(data.experiencia)}</div>
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.educacion && (
              <section className="p-3.5 rounded-lg border bg-white/70" style={{ borderColor: theme.borderSubtle }}>
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: theme.accent }}
                >
                  Educación
                </h3>
                <div className="space-y-1.5">{renderFormattedParagraphs(data.educacion)}</div>
              </section>
            )}

            <div className="space-y-4">
              {skillsList.length > 0 && (
                <section className="p-3.5 rounded-lg border bg-white/70" style={{ borderColor: theme.borderSubtle }}>
                  <h3
                    className="text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: theme.accent }}
                  >
                    Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {skillsList.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded text-[10.5px] font-medium border"
                        style={{
                          backgroundColor: theme.accentSoft,
                          color: theme.accent,
                          borderColor: theme.borderSubtle,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(data.idiomas || data.referencias) && (
                <section className="p-3.5 rounded-lg border bg-white/70" style={{ borderColor: theme.borderSubtle }}>
                  {data.idiomas && (
                    <div className="mb-2">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
                        Idiomas:
                      </span>
                      <span className="text-[11px]" style={{ color: theme.textBody }}>{data.idiomas}</span>
                    </div>
                  )}
                  {data.referencias && (
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
                        Referencias:
                      </span>
                      <span className="text-[10.5px]" style={{ color: theme.textBody }}>{data.referencias}</span>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. TEMPLATE: CLÁSICO ELEGANTE (DEFAULT)
  // ==========================================
  return (
    <div
      id={id}
      className={`w-full min-h-[297mm] max-w-[210mm] mx-auto text-left p-8 sm:p-10 shadow-md transition-colors duration-200 ${getFontFamilyClass()} ${className}`}
      style={{
        backgroundColor: getPageBg(),
        color: theme.textBody,
      }}
    >
      {/* Header */}
      <header
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b-2"
        style={{ borderColor: theme.accent }}
      >
        {styleConfig.showPhoto && data.fotoUrl && (
          <img
            src={data.fotoUrl}
            alt={data.nombre}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className={`w-24 h-24 object-cover border-2 shadow-xs shrink-0 ${getPhotoShapeClass()}`}
            style={{ borderColor: theme.accent }}
          />
        )}

        <div className="flex-1 text-center sm:text-left">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
            style={{ color: theme.accent }}
          >
            {data.nombre || 'Nombre y Apellido'}
          </h1>
          <h3
            className="text-sm font-semibold tracking-wide mb-2"
            style={{ color: theme.accentSecondary }}
          >
            {data.puesto || 'Puesto o Título Profesional'}
          </h3>

          <div
            className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs"
            style={{ color: theme.textMuted }}
          >
            {data.contacto && <span>{data.contacto}</span>}
            {data.contacto && data.redes && <span>·</span>}
            {data.redes && <span>{data.redes}</span>}
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className="py-6 space-y-6">
        {/* Resumen & Fortalezas */}
        {data.fortalezas && (
          <section>
            <h4
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2 border-b"
              style={{
                color: theme.accent,
                borderColor: theme.borderSubtle,
              }}
            >
              Fortalezas y Perfil
            </h4>
            <p className="text-[12px] leading-relaxed text-justify" style={{ color: theme.textBody }}>
              {data.fortalezas}
            </p>
          </section>
        )}

        {/* Experiencia Laboral */}
        {data.experiencia && (
          <section>
            <h4
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
              style={{
                color: theme.accent,
                borderColor: theme.borderSubtle,
              }}
            >
              Experiencia Laboral
            </h4>
            <div className="space-y-3">{renderFormattedParagraphs(data.experiencia)}</div>
          </section>
        )}

        {/* Educación */}
        {data.educacion && (
          <section>
            <h4
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
              style={{
                color: theme.accent,
                borderColor: theme.borderSubtle,
              }}
            >
              Educación y Formación
            </h4>
            <div className="space-y-2">{renderFormattedParagraphs(data.educacion)}</div>
          </section>
        )}

        {/* Skills and languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {skillsList.length > 0 && (
            <section>
              <h4
                className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2 border-b"
                style={{
                  color: theme.accent,
                  borderColor: theme.borderSubtle,
                }}
              >
                Habilidades Clave
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded text-[11px] font-medium border"
                    style={{
                      backgroundColor: theme.accentSoft,
                      color: theme.accent,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.idiomas && (
            <section>
              <h4
                className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2 border-b"
                style={{
                  color: theme.accent,
                  borderColor: theme.borderSubtle,
                }}
              >
                Idiomas
              </h4>
              <p className="text-[12px] leading-relaxed" style={{ color: theme.textBody }}>
                {data.idiomas}
              </p>
            </section>
          )}
        </div>

        {/* Referencias */}
        {data.referencias && (
          <section>
            <h4
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2 border-b"
              style={{
                color: theme.accent,
                borderColor: theme.borderSubtle,
              }}
            >
              Referencias
            </h4>
            <p className="text-[11.5px] leading-relaxed" style={{ color: theme.textBody }}>
              {data.referencias}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
