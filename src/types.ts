export interface CVData {
  nombre: string;
  puesto: string;
  contacto: string;
  redes: string;
  fortalezas: string;
  experiencia: string;
  educacion: string;
  referencias: string;
  habilidades: string;
  idiomas: string;
  fotoUrl: string;
}

export type TemplateLayout = 'clasico' | 'ejecutivo' | 'editorial' | 'compacto';
export type FontFamilyType = 'modern' | 'editorial' | 'geometric';
export type PhotoShape = 'circle' | 'rounded' | 'square';

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentSecondary: string;
  bgPaper: string;
  sidebarBg?: string;
  textHeading: string;
  textBody: string;
  textMuted: string;
  borderSubtle: string;
  chipBg: string;
  swatch: [string, string, string];
}

export interface CVStyleConfig {
  themeId: string;
  layout: TemplateLayout;
  font: FontFamilyType;
  photoShape: PhotoShape;
  showPhoto: boolean;
  fontSize: 'compact' | 'normal' | 'relaxed';
  pageBgType: 'tinted' | 'white' | 'warm';
}
