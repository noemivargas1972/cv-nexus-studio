import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { CVData } from '../types';

export const getCleanFilename = (name?: string, extension: string = 'pdf') => {
  const clean = (name || 'Curriculum_Vitae')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  return `CV_${clean}.${extension}`;
};

/**
 * Convierte cualquier imagen a Data URL Base64 para prevenir tainting de canvas
 */
const convertImageToBase64 = (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise((resolve) => {
    if (!imgElement.src) {
      resolve('');
      return;
    }
    if (imgElement.src.startsWith('data:')) {
      resolve(imgElement.src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
          return;
        }
      } catch {
        // En caso de restricción extrema
      }
      resolve(imgElement.src);
    };
    img.onerror = () => resolve(imgElement.src);
    img.src = imgElement.src;
  });
};

/**
 * Captura el CV de forma ultra-robusta sin depender de coordenadas negativas (-9999px)
 * que corrompen html2canvas. Clona el nodo en un sandbox limpio, sanitiza imágenes y renderiza.
 */
export const captureCvCanvas = async (
  elementOverride?: HTMLElement | null
): Promise<HTMLCanvasElement> => {
  // Buscar elemento fuente: override, #cv-paper-preview o #cvHoja
  let source: HTMLElement | null =
    elementOverride ||
    document.getElementById('cv-paper-preview') ||
    document.getElementById('cvHoja') ||
    document.querySelector('.cv-sheet');

  if (!source) {
    throw new Error('No se encontró el contenedor del currículum para exportar.');
  }

  // Esperar fuentes web
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignorar
    }
  }

  // Crear contenedor sandbox temporal en coordenadas reales (top: 0, left: 0)
  // pero oculto detrás de todo con z-index negativo y opacity 0
  const sandbox = document.createElement('div');
  sandbox.id = 'cv-export-clean-sandbox';
  sandbox.style.position = 'fixed';
  sandbox.style.top = '0px';
  sandbox.style.left = '0px';
  sandbox.style.width = '794px'; // 210mm a 96dpi
  sandbox.style.minHeight = '1123px'; // 297mm a 96dpi
  sandbox.style.zIndex = '-99999';
  sandbox.style.opacity = '0';
  sandbox.style.pointerEvents = 'none';
  sandbox.style.backgroundColor = '#ffffff';
  sandbox.style.overflow = 'visible';

  // Clonar el contenido del CV
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.width = '794px';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // Sanitizar imágenes en el clon a Base64 para garantizar que el canvas jamás se vuelva "tainted"
  const images = Array.from(clone.querySelectorAll('img'));
  for (const img of images) {
    try {
      const b64 = await convertImageToBase64(img);
      if (b64) {
        img.src = b64;
      }
    } catch {
      // Continuar si falla una imagen
    }
  }

  // Pausa mínima para asegurar que el clon esté asentado en el DOM
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, // Calidad 2x Retina
      useCORS: true,
      allowTaint: false, // ¡Crítico! Nunca marcar como tainted para permitir toDataURL y toBlob
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 12000,
      windowWidth: 1024,
    });

    return canvas;
  } finally {
    // Siempre remover el sandbox temporal
    if (sandbox.parentNode) {
      document.body.removeChild(sandbox);
    }
  }
};

/**
 * Funcionalidad de "Guardar Imagen":
 * Renderiza el canvas en alta resolución y fuerza la descarga con file-saver y fallback de enlace <a>
 */
export const exportToImage = async (
  element?: HTMLElement | null,
  filename: string = 'Mi_Curriculum.png',
  format: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<Blob> => {
  const canvas = await captureCvCanvas(element);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar el archivo de imagen.'));
          return;
        }

        try {
          // 1. Guardado confiable con file-saver (compatible con iframes y móviles)
          saveAs(blob, filename);

          // 2. Doble fallback con enlace <a> dinámico
          try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 1000);
          } catch {
            // Ignorar si saveAs ya funcionó
          }

          resolve(blob);
        } catch (err) {
          reject(err);
        }
      },
      format,
      0.95
    );
  });
};

/**
 * Funcionalidad de "Descargar PDF":
 * Genera el PDF con jsPDF y fuerza la descarga directa usando saveAs y pdf.save()
 */
export const exportToPdf = async (
  element?: HTMLElement | null,
  filename: string = 'Mi_Curriculum.pdf'
): Promise<Blob> => {
  const canvas = await captureCvCanvas(element);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  if (imgHeight <= pageHeight + 4) {
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
  } else {
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 5) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }

  const pdfBlob = pdf.output('blob');

  try {
    // 1. Descarga con FileSaver
    saveAs(pdfBlob, filename);
  } catch {
    // Fallback nativo de jsPDF
    pdf.save(filename);
  }

  return pdfBlob;
};

/**
 * Compartir archivo real (PDF o Imagen) directamente a WhatsApp usando Web Share API
 * Si el navegador no soporta envío directo de archivos, descarga el archivo y abre WhatsApp.
 */
export const shareFileToWhatsApp = async (
  element: HTMLElement | null,
  data: CVData,
  fileType: 'pdf' | 'image' = 'pdf',
  targetPhone?: string
): Promise<{ sharedDirectly: boolean; message: string }> => {
  const filename = fileType === 'pdf' ? 'Mi_Curriculum.pdf' : 'Mi_Curriculum.png';
  const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/png';

  const blob =
    fileType === 'pdf'
      ? await exportToPdf(element, filename)
      : await exportToImage(element, filename, 'image/png');

  const file = new File([blob], filename, { type: mimeType });

  // Verificar si el dispositivo admite compartir archivos nativos (Android / iOS)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `CV - ${data.nombre || 'Currículum'}`,
        text: `Hola, te comparto mi Currículum Vitae (${data.nombre || 'Candidato'} - ${data.puesto || ''}).`,
        files: [file],
      });
      return {
        sharedDirectly: true,
        message: '¡Abriendo WhatsApp para enviar el archivo adjunto!',
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { sharedDirectly: false, message: 'Operación cancelada.' };
      }
    }
  }

  // Fallback para computadoras o navegadores de escritorio:
  // El archivo ya fue descargado por exportToPdf / exportToImage, ahora abrimos el chat de WhatsApp
  const cleanPhone = (targetPhone || '').replace(/[^0-9]/g, '');
  let waUrl = 'https://api.whatsapp.com/send?';
  if (cleanPhone) {
    waUrl += `phone=${cleanPhone}&`;
  }
  waUrl += `text=${encodeURIComponent(
    `Hola, te comparto mi Currículum Vitae (${data.nombre || 'Candidato'} - ${data.puesto || ''}). Adjunto el archivo ${filename} que acabo de descargar.`
  )}`;

  window.open(waUrl, '_blank');

  return {
    sharedDirectly: false,
    message: `Archivo ${filename} descargado en tu dispositivo. Adjúntalo en la ventana de WhatsApp que se acaba de abrir.`,
  };
};

/**
 * Impresión nativa con ventana de impresión del navegador estilizada con @media print
 */
export const triggerNativePrint = () => {
  const originalTitle = document.title;
  document.title = 'Mi_Curriculum';
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
};

/**
 * Formato limpio de texto para WhatsApp
 */
export const formatWhatsAppText = (data: CVData): string => {
  const lines: string[] = [];

  lines.push(`📄 *CURRÍCULUM VITAE*`);
  lines.push(`*${data.nombre || 'Candidato'}*`);
  if (data.puesto) lines.push(`💼 _${data.puesto}_`);
  lines.push('');

  if (data.contacto || data.redes) {
    lines.push(`📱 *Contacto:*`);
    if (data.contacto) lines.push(`• Ubicación/Tel: ${data.contacto}`);
    if (data.redes) lines.push(`• Email/Redes: ${data.redes}`);
    lines.push('');
  }

  if (data.fortalezas) {
    lines.push(`⭐ *Perfil y Fortalezas:*`);
    lines.push(data.fortalezas);
    lines.push('');
  }

  if (data.experiencia) {
    lines.push(`🏢 *Experiencia Laboral:*`);
    lines.push(data.experiencia);
    lines.push('');
  }

  if (data.educacion) {
    lines.push(`🎓 *Educación:*`);
    lines.push(data.educacion);
    lines.push('');
  }

  if (data.habilidades) {
    lines.push(`🛠️ *Habilidades:*`);
    lines.push(data.habilidades);
    lines.push('');
  }

  if (data.idiomas) {
    lines.push(`🌐 *Idiomas:* ${data.idiomas}`);
    lines.push('');
  }

  if (data.referencias) {
    lines.push(`👥 *Referencias:*`);
    lines.push(data.referencias);
  }

  return lines.join('\n').trim();
};
