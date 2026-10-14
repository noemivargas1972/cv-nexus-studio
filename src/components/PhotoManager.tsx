import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, VideoOff, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface PhotoManagerProps {
  fotoUrl: string;
  onPhotoChange: (url: string) => void;
  showPhoto: boolean;
  onToggleShowPhoto: (show: boolean) => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({
  fotoUrl,
  onPhotoChange,
  showPhoto,
  onToggleShowPhoto,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Slight timeout to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.error('Error playing camera stream:', err);
          });
        }
      }, 50);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('No se pudo acceder a la cámara. Revisa los permisos en tu navegador.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    // Ensure square 1:1 ratio capture
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop
    const sx = ((video.videoWidth || size) - size) / 2;
    const sy = ((video.videoHeight || size) - size) / 2;

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onPhotoChange(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCameraError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onPhotoChange(result);
        setCameraError(null);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be reselected
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-semibold text-slate-900">Fotografía del CV</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleShowPhoto(!showPhoto)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          title={showPhoto ? 'Ocultar foto en el CV' : 'Mostrar foto en el CV'}
        >
          {showPhoto ? (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Oculta</span>
            </>
          )}
        </button>
      </div>

      {cameraError && (
        <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {cameraError}
        </div>
      )}

      {isCameraActive ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-black aspect-square max-w-[240px] mx-auto mb-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          {/* Subtle face centering guide */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-36 h-44 rounded-full border-2 border-dashed border-white/60" />
          </div>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              Capturar
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="py-2 px-3 bg-neutral-800/80 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <VideoOff className="w-3.5 h-3.5" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Foto de perfil de CV"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-6 h-6 stroke-1 mb-0.5" />
                <span className="text-[10px] font-medium">Sin foto</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-1 w-full space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Cámara en vivo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir archivo</span>
              </button>
            </div>

            {fotoUrl && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Foto configurada</span>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  Quitar foto
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};
