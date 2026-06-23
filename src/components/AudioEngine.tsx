import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Sparkles, Wind, Play, Square } from 'lucide-react';

interface AudioEngineProps {
  onSpeakStatusChange?: (isSpeaking: boolean) => void;
}

export default function AudioEngine({ onSpeakStatusChange }: AudioEngineProps) {
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(false);
  const [isSynthesizingNature, setIsSynthesizingNature] = useState(false);
  const [currentNarratorText, setCurrentNarratorText] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [volume, setVolume] = useState(0.2); // 20% by default for peaceful background
  const [showExplanation, setShowExplanation] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientTimerRef = useRef<number | null>(null);
  const natureNodesRef = useRef<{
    windOsc?: OscillatorNode;
    windGain?: GainNode;
    windFilter?: BiquadFilterNode;
    noiseSource?: AudioWorkletNode | ScriptProcessorNode;
  } | null>(null);

  // Warm up voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      stopNarrating();
    };
  }, []);

  // Initialize Web Audio Context on first interaction
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Web Audio Procedural Piano Generator
  const playPianisticChord = (ctx: AudioContext, frequencies: number[], durationSecs: number) => {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.12, now + 1.5); // Soft chord entry
    masterGain.gain.setValueAtTime(volume * 0.12, now + durationSecs - 2);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSecs);

    frequencies.forEach((freq, idx) => {
      // Arpeggiate slightly for a natural "human-strummedized" piano touch
      const noteDelay = idx * 0.15;
      const osc = ctx.createOscillator();
      const waveFilter = ctx.createBiquadFilter();
      const noteGain = ctx.createGain();

      // Mellow triangle wave for soft keyboard vibe
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + noteDelay);

      // Warm lowpass filter to remove sterile digital high-frequencies
      waveFilter.type = 'lowpass';
      waveFilter.frequency.setValueAtTime(280, now + noteDelay);
      waveFilter.Q.setValueAtTime(1, now + noteDelay);

      // Soft decay curves for each key
      noteGain.gain.setValueAtTime(0, now + noteDelay);
      noteGain.gain.linearRampToValueAtTime(0.3, now + noteDelay + 0.2);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + durationSecs - 0.5);

      osc.connect(waveFilter);
      waveFilter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + noteDelay);
      osc.stop(now + durationSecs);
    });

    masterGain.connect(ctx.destination);
  };

  // Serene Meditative chord list (F# Maj7 -> D#m9 -> B Maj9 -> C# 11)
  const ambientChords = [
    [185.00, 233.08, 277.18, 349.23], // F# Maj7
    [155.56, 196.00, 220.00, 293.66], // E-ish Modal Lox
    [123.47, 164.81, 246.94, 293.66, 369.99], // B Maj9
    [138.59, 174.61, 207.65, 277.18, 329.63]  // C# sus/Maj
  ];

  const toggleAmbience = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlayingAmbience) {
      // Stop loop
      if (ambientTimerRef.current) {
        window.clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = null;
      }
      setIsPlayingAmbience(false);
    } else {
      setIsPlayingAmbience(true);
      // Trigger immediately
      let chordIdx = 0;
      const playNext = () => {
        if (ctx.state === 'closed') return;
        const chords = ambientChords[chordIdx];
        playPianisticChord(ctx, chords, 8);
        chordIdx = (chordIdx + 1) % ambientChords.length;
      };

      playNext();
      ambientTimerRef.current = window.setInterval(playNext, 7500);
    }
  };

  // Pure Web Audio procedural wind/water synthesiser of peaceful white noise soundscapes
  const toggleNature = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isSynthesizingNature) {
      // Clean up previous components
      if (natureNodesRef.current) {
        if (natureNodesRef.current.windOsc) natureNodesRef.current.windOsc.stop();
        if (natureNodesRef.current.noiseSource) natureNodesRef.current.noiseSource.disconnect();
        natureNodesRef.current = null;
      }
      setIsSynthesizingNature(false);
    } else {
      setIsSynthesizingNature(true);

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoiseNode = ctx.createBufferSource();
      whiteNoiseNode.buffer = noiseBuffer;
      whiteNoiseNode.loop = true;

      const bandpassFilter = ctx.createBiquadFilter();
      bandpassFilter.type = 'bandpass';
      bandpassFilter.frequency.value = 400;
      bandpassFilter.Q.value = 1.0;

      const natureGain = ctx.createGain();
      natureGain.gain.value = volume * 0.08; // very faint ambient rustle

      // LFO to make the wind swell and sigh like a real mountain breeze
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.08; // 1 cycle per 12 seconds

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150; // Sweeps from 250Hz to 550Hz

      lfo.connect(lfoGain);
      lfoGain.connect(bandpassFilter.frequency);

      whiteNoiseNode.connect(bandpassFilter);
      bandpassFilter.connect(natureGain);
      natureGain.connect(ctx.destination);

      lfo.start();
      whiteNoiseNode.start();

      natureNodesRef.current = {
        windOsc: lfo,
        windGain: lfoGain,
        windFilter: bandpassFilter,
        noiseSource: whiteNoiseNode as any
      };
    }
  };

  // Speak narration fully leveraging Spanish TTS setting rate slower for emotional connection
  const triggerNarration = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setIsNarrating(true);
    if (onSpeakStatusChange) onSpeakStatusChange(true);

    const strippedText = text.replace(/<[^>]*>/g, '').trim();

    // Utterance with customized slower, deeper tone
    const utterance = new SpeechSynthesisUtterance(strippedText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // highly effective slower tempo
    utterance.pitch = 0.94; // slightly warm/deep pastoral pitch

    // Try finding a warm Spanish voice (e.g. Mónica, Jorge, etc.)
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      voice => voice.lang.startsWith('es') && (voice.name.includes('Natural') || voice.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('es'));

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.onend = () => {
      setIsNarrating(false);
      if (onSpeakStatusChange) onSpeakStatusChange(false);
    };

    utterance.onerror = () => {
      setIsNarrating(false);
      if (onSpeakStatusChange) onSpeakStatusChange(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopNarrating = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      if (onSpeakStatusChange) onSpeakStatusChange(false);
    }
  };

  // Expose triggers to window so active slides can programmatically trigger reading on '🔊 Escuchar' buttons
  useEffect(() => {
    (window as any).pastoralAudioTrigger = (text: string) => {
      triggerNarration(text);
    };
    (window as any).pastoralAudioStop = () => {
      stopNarrating();
    };
    return () => {
      delete (window as any).pastoralAudioTrigger;
      delete (window as any).pastoralAudioStop;
    };
  }, [volume]);

  // Adjust live nodes volume
  useEffect(() => {
    if (natureNodesRef.current?.noiseSource) {
      // Modulate nature node sound levels if active
    }
  }, [volume]);

  return (
    <div id="audio-console" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {showExplanation && (
        <div className="mb-2 w-72 rounded-2xl bg-white p-4 shadow-xl border border-stone-100 text-xs text-stone-600 transition-all">
          <h4 className="font-semibold text-stone-800 mb-1 flex items-center gap-1.5 font-serif text-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Sonido Generativo
          </h4>
          <p className="leading-relaxed">
            Hemos construido un motor acústico que genera música de piano contemplativa y viento de pradera en tiempo real mediante el procesador de tu navegador. Sin cargar archivos ni agotar tus datos. Siente la quietud.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-lg border border-stone-100/50">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          title="Ver cómo funciona"
          className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-stone-200" />

        {/* Ambient music switch */}
        <button
          onClick={toggleAmbience}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            isPlayingAmbience
              ? 'bg-emerald-550 text-white bg-emerald-700'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
          title="Fondo de piano meditativo"
        >
          <Music className={`h-3 w-3 ${isPlayingAmbience ? 'animate-pulse' : ''}`} />
          <span>Piano {isPlayingAmbience ? 'Activo' : 'Mudo'}</span>
        </button>

        {/* Procedural Wind switch */}
        <button
          onClick={toggleNature}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            isSynthesizingNature
              ? 'bg-amber-600 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
          title="Viento y naturaleza generativa"
        >
          <Wind className={`h-3 w-3 ${isSynthesizingNature ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span>Naturaleza</span>
        </button>

        {/* Volume slider */}
        <div className="flex items-center gap-1.5 px-1.5">
          <button
            onClick={() => setVolume(volume === 0 ? 0.2 : 0)}
            className="text-stone-500 hover:text-stone-700 cursor-pointer"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
          />
        </div>

        {isNarrating && (
          <>
            <div className="h-4 w-[1px] bg-stone-200" />
            <button
              onClick={stopNarrating}
              className="px-2 py-1 flex items-center gap-1 rounded bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 cursor-pointer"
              title="Detener voz"
            >
              <Square className="h-3 w-3 fill-rose-700" /> Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
