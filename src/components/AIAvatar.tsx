import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AIAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  message?: string;
  onVoiceInput?: (text: string) => void;
}

export function AIAvatar({
  isListening = false,
  isSpeaking = false,
  message,
  onVoiceInput
}: AIAvatarProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isInternalListening, setIsInternalListening] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          if (event.results[event.results.length - 1].isFinal) {
            onVoiceInput?.(transcript);
            setIsInternalListening(false);
          }
        };

        recognition.onend = () => setIsInternalListening(false);
        recognition.onerror = () => setIsInternalListening(false);

        setRecognition(recognition);
      }

      if ('speechSynthesis' in window) {
        setSynthesis(window.speechSynthesis);
      }
    }
  }, [onVoiceInput]);

  useEffect(() => {
    if (message && synthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      synthesis.speak(utterance);
    }
  }, [message, synthesis]);

  const startListening = () => {
    if (recognition && !isInternalListening) {
      setIsInternalListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition error:', error);
        setIsInternalListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isInternalListening) {
      recognition.stop();
      setIsInternalListening(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 pt-4">
      {/* Avatar Image (Fixed Size, Responsive) */}
      <div className="w-[220px] h-auto mb-6 flex justify-center items-center">
        <img
          src="/Avatar.png"
          alt="AI Avatar"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p
          className={`text-lg font-semibold transition-colors duration-300 ${
            isListening || isInternalListening
              ? 'text-yellow-500'
              : isSpeaking
              ? 'text-blue-600'
              : 'text-gray-500'
          }`}
        >
          {isListening || isInternalListening
            ? 'Listening...'
            : isSpeaking
            ? 'Speaking...'
            : "Hi! I'm your AI assistant"}
        </p>
      </motion.div>

      {/* Voice Controls */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startListening}
          disabled={isInternalListening}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            isInternalListening
              ? 'bg-yellow-400 text-black cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isInternalListening ? 'Listening...' : 'Start Talking'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={stopListening}
          disabled={!isInternalListening}
          className="px-6 py-3 bg-gray-300 text-black rounded-full font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </motion.button>
      </div>
    </div>
  );
}
