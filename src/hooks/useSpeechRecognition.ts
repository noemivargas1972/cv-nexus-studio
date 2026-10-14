import { useState, useRef, useCallback, useEffect } from 'react';

// Declare Web Speech API types for TypeScript
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function useSpeechRecognition() {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onUpdateCallbackRef = useRef<((text: string) => void) | null>(null);
  const baseTextRef = useRef<string>('');

  useEffect(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore already stopped errors
      }
      recognitionRef.current = null;
    }
    setActiveField(null);
  }, []);

  const startListening = useCallback(
    (fieldKey: string, initialValue: string, onUpdate: (text: string) => void) => {
      const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechAPI) {
        setIsSupported(false);
        setErrorMessage('El reconocimiento por voz requiere Google Chrome, Edge o un navegador compatible con Web Speech API.');
        return;
      }

      // If already listening on this field, stop
      if (activeField === fieldKey) {
        stopListening();
        return;
      }

      // Stop previous instance if running on another field
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      setErrorMessage(null);
      baseTextRef.current = initialValue.trim();
      onUpdateCallbackRef.current = onUpdate;

      try {
        const recognition = new SpeechAPI();
        recognition.lang = 'es-ES'; // Spanish recognition
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            finalTranscript += transcript;
          }

          const combined = baseTextRef.current
            ? `${baseTextRef.current} ${finalTranscript}`
            : finalTranscript;

          if (onUpdateCallbackRef.current) {
            onUpdateCallbackRef.current(combined.replace(/\s+/g, ' '));
          }
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition notice:', e.error);
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setErrorMessage('Permiso de micrófono denegado. Habilita el micrófono en el navegador para dictar.');
          } else if (e.error === 'network') {
            setErrorMessage('Error de conexión con el servicio de voz.');
          }
          stopListening();
        };

        recognition.onend = () => {
          setActiveField(null);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setActiveField(fieldKey);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setErrorMessage('No se pudo iniciar el dictado por voz.');
        setActiveField(null);
      }
    },
    [activeField, stopListening]
  );

  return {
    activeField,
    isListening: activeField !== null,
    isSupported,
    errorMessage,
    setErrorMessage,
    startListening,
    stopListening,
  };
}
