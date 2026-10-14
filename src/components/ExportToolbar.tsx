import React, { useState, useEffect } from 'react';
import {
  FileDown,
  Image as ImageIcon,
  MessageCircle,
  Loader2,
  Printer,
  CheckCircle2,
  Share2,
  Send,
  Sparkles,
  ChevronDown,
  X,
  Phone,
} from 'lucide-react';
import { CVData } from '../types';
import {
  exportToPdf,
  exportToImage,
  triggerNativePrint,
  shareFileToWhatsApp,
  formatWhatsAppText,
} from '../utils/exportUtils';

interface ExportToolbarProps {
  data: CVData;
  getExportElement?: () => HTMLElement | null;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  data,
  getExportElement,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState(false);
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Número de WhatsApp del usuario para que vaya DIRECTO a su chat
  const [targetPhone, setTargetPhone] = useState<string>(() => {
    return localStorage.getItem('cv_user_whatsapp_phone') || '';
  });

  // Si no está guardado, intentar extraer de data.contacto
  useEffect(() => {
    if (!targetPhone && data.contacto) {
      const numbersOnly = data.contacto.replace(/[^0-9]/g, '');
      if (numbersOnly.length >= 8) {
        setTargetPhone(numbersOnly);
      }
    }
  }, [data.contacto, targetPhone]);

  const handlePhoneChange = (val: string) => {
    setTargetPhone(val);
    localStorage.setItem('cv_user_whatsapp_phone', val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Guardar Imagen directa en alta resolución (PNG)
  const handleSaveImage = async (format: 'image/png' | 'image/jpeg' = 'image/png') => {
    try {
      setIsExportingImage(true);
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const filename = `Mi_Curriculum.${ext}`;
      const element = getExportElement ? getExportElement() : null;
      await exportToImage(element, filename, format);
      showToast(`¡Archivo ${filename} descargado con éxito en tu dispositivo!`);
    } catch (err) {
      console.error('Error al guardar imagen:', err);
      showToast('No se pudo guardar la imagen. Revisa los permisos de descarga.');
    } finally {
      setIsExportingImage(false);
    }
  };

  // 2. Descargar PDF directo con jsPDF + FileSaver
  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const element = getExportElement ? getExportElement() : null;
      await exportToPdf(element, 'Mi_Curriculum.pdf');
      showToast('¡Archivo Mi_Curriculum.pdf descargado con éxito!');
    } catch (err) {
      console.error('Error al generar PDF:', err);
      triggerNativePrint();
      showToast('Abriendo ventana de impresión para guardar como PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 3. Compartir archivo PDF / Imagen directamente a WhatsApp
  const handleWhatsAppFileShare = async (fileType: 'pdf' | 'image') => {
    try {
      setIsSharingWhatsApp(true);
      const element = getExportElement ? getExportElement() : null;
      const result = await shareFileToWhatsApp(element, data, fileType, targetPhone);
      showToast(result.message);
    } catch (err) {
      console.error('Error al compartir a WhatsApp:', err);
      showToast('Error al enviar a WhatsApp. Puedes descargar el archivo y adjuntarlo.');
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  // 4. Enlace directo a WhatsApp con texto
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
        formatWhatsAppText(data)
      )}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(formatWhatsAppText(data))}`;

  return (
    <>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 text-white text-xs py-2.5 px-4 rounded-xl shadow-xl border border-slate-700/80 animate-fade-in flex items-center gap-2 max-w-sm pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Barra de herramientas compacta y discreta */}
      <div className="relative rounded-xl border border-neutral-200/90 bg-white/95 backdrop-blur-xs p-2.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Identificador minimalista */}
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              Herramientas de Exportación
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              · Multiformato A4
            </span>
          </div>

          {/* Botones compactos y elegantes */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Guardar Imagen */}
            <button
              type="button"
              disabled={isExportingImage}
              onClick={() => handleSaveImage('image/png')}
              title="Guardar imagen Mi_Curriculum.png en tu equipo o galería"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/90 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isExportingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{isExportingImage ? 'Guardando...' : 'Guardar Imagen'}</span>
            </button>

            {/* 2. Descargar PDF */}
            <button
              type="button"
              disabled={isExportingPdf}
              onClick={handleDownloadPdf}
              title="Descargar archivo PDF vectorial limpio listo para imprimir o enviar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{isExportingPdf ? 'Creando PDF...' : 'Descargar PDF'}</span>
            </button>

            {/* 3. Menú directo de WhatsApp con envío de Archivo PDF / Imagen */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWhatsAppPanel((prev) => !prev)}
                title="Opciones de envío directo a WhatsApp (PDF, Imagen o Texto)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
                <span>Enviar x WhatsApp</span>
                <ChevronDown className="w-3 h-3 text-emerald-600" />
              </button>

              {/* Panel desplegable de WhatsApp para evitar errores de abrir "otro" */}
              {showWhatsAppPanel && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 p-3 bg-white rounded-xl shadow-xl border border-neutral-200 text-xs animate-fade-in space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Enviar a tu WhatsApp</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowWhatsAppPanel(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Número de WhatsApp configurado */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Tu número o destinatario (código de país + número):
                    </label>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1.5 rounded-lg border border-neutral-200">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        value={targetPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="Ej: 5491148923401 (sin signos)"
                        className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Al indicar el número, WhatsApp abre DIRECTAMENTE tu chat sin intermediarios.
                    </span>
                  </div>

                  {/* Botones de acción directa para enviar PDF o Foto */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      disabled={isSharingWhatsApp}
                      onClick={() => handleWhatsAppFileShare('pdf')}
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Enviar Archivo PDF a WhatsApp</span>
                      </span>
                      {isSharingWhatsApp && <Loader2 className="w-3 h-3 animate-spin" />}
                    </button>

                    <button
                      type="button"
                      disabled={isSharingWhatsApp}
                      onClick={() => handleWhatsAppFileShare('image')}
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                        <span>Enviar Imagen del CV a WhatsApp</span>
                      </span>
                      {isSharingWhatsApp && <Loader2 className="w-3 h-3 animate-spin" />}
                    </button>

                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowWhatsAppPanel(false)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-slate-600 hover:text-slate-900 hover:bg-neutral-50 transition-colors"
                    >
                      <Send className="w-3 h-3 text-emerald-600" />
                      <span>Abrir Chat con Texto Formateado</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Impresión limpia nativa del navegador */}
            <button
              type="button"
              onClick={triggerNativePrint}
              title="Imprimir directamente desde el navegador (Ctrl + P)"
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Consejo rápido sobre el envío del archivo */}
        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="truncate">
            💡 En celular: <strong>Enviar x WhatsApp</strong> adjunta el PDF directo · En PC: descárgalo y arrástralo al chat.
          </span>
          <button
            type="button"
            onClick={() => handleSaveImage('image/jpeg')}
            className="text-[10.5px] text-slate-400 hover:text-slate-700 underline shrink-0 ml-2"
          >
            Guardar JPG
          </button>
        </div>
      </div>
    </>
  );
};
