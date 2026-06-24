import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Heart,
  Play,
  RotateCcw,
  CheckCircle2,
  Check,
  Download,
  AlertCircle,
  Moon,
  Compass,
  Smile,
  ShieldAlert,
  HelpCircle,
  Bookmark,
  Calendar,
  Volume2,
  VolumeX,
  User,
  Coffee,
  CheckSquare
} from 'lucide-react';
import jsPDF from 'jspdf';

import {
  Movement,
  BackpackState,
  SheepType,
  CoreNeed,
  RenovationPlan
} from './types';

import {
  HABIT_PRESETS,
  MICROPAUSES,
  SHEEP_DETAILS,
  NEED_DETAILS
} from './data';

import { DAILY_PLANS } from './planGenerator';

import AudioEngine from './components/AudioEngine';

export default function App() {
  // Navigation & Step States
  const [currentMovement, setCurrentMovement] = useState<Movement>('intro');
  const [prevMovement, setPrevMovement] = useState<Movement | null>(null);

  // Audio Sync state
  const [isSpeakingGlobally, setIsSpeakingGlobally] = useState(false);

  // Movement 1 State: Breathing Guided Cycle
  const [breathingStage, setBreathingStage] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);

  // Movement 2 State: Backpack Burden Fields
  const [backpack, setBackpack] = useState<BackpackState>({
    precupa: '',
    duele: '',
    miedo: '',
    cambiar: ''
  });
  const [isUnpackingLoading, setIsUnpackingLoading] = useState(false);
  const [unpackingError, setUnpackingError] = useState<string | null>(null);
  const [pastoralResponse, setPastoralResponse] = useState<string | null>(null);

  // Movement 3 State: The Control Matrix Sorting Game
  const [unsortedBurdens, setUnsortedBurdens] = useState([
    { id: 'b1', text: 'El rumbo de la economía global', controllable: false },
    { id: 'b2', text: 'La actitud o críticas de otras personas', controllable: false },
    { id: 'b3', text: 'Rendir mis temores diarios en oración', controllable: true },
    { id: 'b4', text: 'Los errores y culpas del pasado', controllable: false },
    { id: 'b5', text: 'Elegir perdonar y soltar el rencor hoy', controllable: true },
    { id: 'b6', text: 'Cuidar las horas de descanso de mi cuerpo', controllable: true },
    { id: 'b7', text: 'Saber qué va a pasar exactamente mañana', controllable: false },
    { id: 'b8', text: 'Dar gracias por una cosa pequeña cada mañana', controllable: true }
  ]);
  const [controlMatrix, setControlMatrix] = useState<{
    uncontrollable: string[];
    controllable: string[];
  }>({
    uncontrollable: [],
    controllable: []
  });

  const autoSortBurdens = () => {
    if (unsortedBurdens.length === 0) return;
    const controllableTexts = unsortedBurdens.filter(b => b.controllable).map(b => b.text);
    const uncontrollableTexts = unsortedBurdens.filter(b => !b.controllable).map(b => b.text);

    setControlMatrix((prev) => ({
      uncontrollable: [...prev.uncontrollable, ...uncontrollableTexts],
      controllable: [...prev.controllable, ...controllableTexts]
    }));
    setUnsortedBurdens([]);
  };

  // Movement 4 State: Sheep Selection & Deep pastoral assessment
  const [selectedSheep, setSelectedSheep] = useState<SheepType>('cansada');
  const [selectedNeed, setSelectedNeed] = useState<CoreNeed>('descanso');

  // Movement 5 State: 30-Day Plan Habit selectors (Max 3/category)
  const [selectedHabits, setSelectedHabits] = useState<{
    mente: string[];
    cuerpo: string[];
    relaciones: string[];
    comunion: string[];
  }>({
    mente: [],
    cuerpo: [],
    relaciones: [],
    comunion: []
  });

  // Backend generated final prayer plan
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [serverResponsePrayer, setServerResponsePrayer] = useState<{
    oracion: string;
    mensajeVersiculo: string;
  } | null>(null);

  // Breathing Cycle loop timer
  useEffect(() => {
    if (currentMovement !== 'mov1_detente') return;

    const interval = setInterval(() => {
      setBreathingSecondsLeft((prev) => {
        if (prev <= 1) {
          // Change stage
          if (breathingStage === 'Inhala') {
            setBreathingStage('Retén');
            return 4;
          } else if (breathingStage === 'Retén') {
            setBreathingStage('Exhala');
            return 4;
          } else {
            setBreathingStage('Inhala');
            setBreathingCyclesCompleted((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMovement, breathingStage]);

  // Programmatic Narrator TTS trigger when changing movements
  const speakActiveSlide = (textToRead: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Small delay to ensure synthesis context is clean
    setTimeout(() => {
      const trigger = (window as any).pastoralAudioTrigger;
      if (trigger) {
        trigger(textToRead);
      }
    }, 100);
  };

  // Stop narration on transition helper
  const stopNarration = () => {
    const stop = (window as any).pastoralAudioStop;
    if (stop) stop();
  };

  // Helper to flow through pages & handle pauses
  const navigateTo = (next: Movement) => {
    stopNarration();
    setPrevMovement(currentMovement);
    setCurrentMovement(next);
  };

  // Submit Backpack payload to Express server for Gemini counselor analysis
  const handleUnpackBackpack = async () => {
    setIsUnpackingLoading(true);
    setUnpackingError(null);
    try {
      const response = await fetch('/api/pastoral-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backpack)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Fallo al procesar tu mochila.');

      setPastoralResponse(data.text);
      navigateTo('pastoral_unpack');
    } catch (err: any) {
      console.error(err);
      // Gracious local fallback if API fails (e.g. key missing/loading)
      setPastoralResponse(
        `Leo tus líneas con toda mi atención, y aunque la distancia física nos divide, puedo sentir el cansancio genuino de tu andar. Esos temores respecto a lo que escapa de tus manos son sumamente comprensibles. Permíteme recordarte que el foso donde hoy te encuentras no es tu destino final. No te pido que resuelvas todo hoy. Cristo vino precisamente a cargar lo que nos agota. Sigamos adelante, dándote el permiso de desempacar esto poco a poco delante de Su cruz.`
      );
      navigateTo('pastoral_unpack');
    } finally {
      setIsUnpackingLoading(false);
    }
  };

  // Trigger Backend finalized plan generation after choosing habits
  const handleGenerateFinalPlan = async () => {
    setIsGeneratingPlan(true);
    navigateTo('plan_final');
    try {
      const response = await fetch('/api/pastoral-prayer-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheep: selectedSheep,
          need: selectedNeed,
          precupar: backpack.precupa || 'Las cargas inciertas de la vida diaria',
          habits: selectedHabits
        })
      });
      const data = await response.json();
      setServerResponsePrayer(data);
    } catch (err) {
      console.error(err);
      // Graceful local fallback to keep the experience moving beautifully
      setServerResponsePrayer({
        oracion: `Señor Jesús, Buen Pastor de mi alma cansada, hoy coloco las preocupaciones de mi hermano en Tus manos. Él se siente como una oveja ${selectedSheep.toUpperCase()}, buscando con urgencia tu tierno ${selectedNeed.toUpperCase()}. Sopla Tu hálito de paz sobre sus noches silenciosas y ayúdale en estos próximos 30 días a dar pequeños pasos en la renovación de su mente y su comunión contigo. Que aprenda que no necesita tener todo solucionado, porque Tú eres suficiente. Amén.`,
        mensajeVersiculo: `«Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros» (1 Pedro 5:7). No intentes abarcar los 30 días de golpe; vive un solo día de gracia a la vez.`
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Dynamic habit list toggle capping habits to max 3
  const handleToggleHabit = (category: 'mente' | 'cuerpo' | 'relaciones' | 'comunion', id: string) => {
    setSelectedHabits((prev) => {
      const list = prev[category];
      if (list.includes(id)) {
        return { ...prev, [category]: list.filter((item) => item !== id) };
      }
      if (list.length >= 3) {
        return prev; // cap reached
      }
      return { ...prev, [category]: [...list, id] };
    });
  };

  // Client side PDF compilation matching the strict visual rules
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const drawBorders = () => {
      doc.setDrawColor(107, 142, 120); // Olive wood
      doc.setLineWidth(1);
      doc.rect(8, 8, 194, 281);

      doc.setDrawColor(220, 215, 205); // Cream line
      doc.setLineWidth(0.4);
      doc.rect(10, 10, 190, 277);
    };

    // Page 1 setup
    drawBorders();

    // Title Block
    doc.setTextColor(28, 42, 56);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('MI PLAN DE RENOVACIÓN PERSONAL', 105, 24, { align: 'center' });

    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('«Jehová es mi pastor; nada me faltará» — Salmo 23:1', 105, 29, { align: 'center' });

    // Dividers
    doc.setDrawColor(200, 190, 180);
    doc.line(20, 34, 190, 34);

    let pointerY = 42;

    const checkPageSpace = (neededHeight: number) => {
      if (pointerY + neededHeight > 265) {
        doc.addPage();
        drawBorders();
        pointerY = 22;
      }
    };

    // Block 1
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(107, 142, 120);
    doc.text('1. MI PUNTO DE PARTIDA Y VERDAD GUÍA', 20, pointerY);
    pointerY += 6;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);

    const sheepPost = `Hoy me acerco a Dios con el corazón de una oveja: ${selectedSheep.toUpperCase()}`;
    const coreNeedText = `Mi necesidad espiritual primordial hoy es: ${selectedNeed.toUpperCase()}`;
    doc.text(sheepPost, 20, pointerY);
    pointerY += 5.5;
    doc.text(coreNeedText, 20, pointerY);
    pointerY += 7;

    doc.setFont('Helvetica', 'bold');
    doc.text('Mi versículo amparador especial:', 20, pointerY);
    pointerY += 5;
    doc.setFont('Helvetica', 'oblique');
    const verseText = NEED_DETAILS[selectedNeed]?.verse || 'Salmo 23:1';
    doc.text(verseText, 20, pointerY);
    pointerY += 8;

    doc.setDrawColor(220, 215, 205);
    doc.line(20, pointerY, 190, pointerY);
    pointerY += 8;

    // Block 2: Daily habits
    checkPageSpace(30);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(107, 142, 120);
    doc.text('2. COMPROMISOS DIARIOS ESTABLECIDOS', 20, pointerY);
    pointerY += 7;

    const catLabels = [
      { key: 'mente', label: 'Mi Mente' },
      { key: 'cuerpo', label: 'Mi Cuerpo' },
      { key: 'relaciones', label: 'Mis Relaciones' },
      { key: 'comunion', label: 'Mi Comunión con Dios' }
    ];

    catLabels.forEach((catObj) => {
      checkPageSpace(15);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      doc.text(`${catObj.label}:`, 20, pointerY);
      doc.setFont('Helvetica', 'normal');

      const ids = selectedHabits[catObj.key as 'mente' | 'cuerpo' | 'relaciones' | 'comunion'] || [];
      if (ids.length === 0) {
        doc.text('  - Paso sencillo de gracia y silencio cotidiano.', 20, pointerY + 4.5);
        pointerY += 8.5;
      } else {
        ids.forEach((id) => {
          checkPageSpace(10);
          const item = HABIT_PRESETS[catObj.key]?.find((h) => h.id === id);
          const fullText = item ? `* ${item.text}` : '';
          const wrapList = doc.splitTextToSize(fullText, 160);
          doc.text(wrapList, 22, pointerY + 4.5);
          pointerY += 4.5 + (wrapList.length * 4);
        });
        pointerY += 1.5;
      }
    });

    pointerY += 2;
    doc.line(20, pointerY, 190, pointerY);
    pointerY += 8;

    // Block 3: Customized Prayer
    const prayerBody = serverResponsePrayer?.oracion ||
      'Señor, sÉ mi descanso. En los momentos donde todo parece desmoronarse, líbrame de la fútil carga del control absoluto. Abrazo hoy Tu cuidado constante como Pastor de mi destino.';
    const wrappedPrayer = doc.splitTextToSize(prayerBody, 165);
    const neededPrayerHeight = 12 + (wrappedPrayer.length * 4);
    
    checkPageSpace(neededPrayerHeight);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(107, 142, 120);
    doc.text('3. ORACIÓN PASTORAL PERSONALIZADA', 20, pointerY);
    pointerY += 6;

    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(wrappedPrayer, 20, pointerY);
    pointerY += (wrappedPrayer.length * 4) + 10;

    // Signature Block
    checkPageSpace(20);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(107, 142, 120);
    doc.text('Firma de Compromiso Conmigo Mismo y Dios:', 20, pointerY);
    doc.line(100, pointerY + 0.5, 185, pointerY + 0.5);

    pointerY += 5;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('«No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo» — Isaías 41:10', 105, pointerY + 2, { align: 'center' });


    // ==========================================
    // PAGE 2+: DAILY DEVOTIONAL PLAN DÍA A DÍA
    // ==========================================
    doc.addPage();
    drawBorders();

    doc.setTextColor(28, 42, 56);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('HOJA DE RUTA DIARIA - PLAN DÍA A DÍA', 105, 20, { align: 'center' });
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Siete días de renovación espiritual, verdad profunda y acciones deliberadas de fe', 105, 25, { align: 'center' });
    doc.line(20, 29, 190, 29);

    let dayPointerY = 34;
    const plans = DAILY_PLANS[selectedNeed] || DAILY_PLANS['descanso'];

    plans.forEach((p) => {
      const citationLines = doc.splitTextToSize(p.citation, 150);
      const truthLines = doc.splitTextToSize(p.truth, 145);
      const actionLines = doc.splitTextToSize(p.action, 145);
      const surrenderLines = doc.splitTextToSize(p.surrender, 145);

      const lineHt = 4.0;
      const citationHeight = citationLines.length * lineHt;
      const truthHeight = truthLines.length * lineHt;
      const actionHeight = actionLines.length * lineHt;
      const surrenderHeight = surrenderLines.length * lineHt;

      const padding = 13;
      const cardHeight = 7 + citationHeight + truthHeight + actionHeight + surrenderHeight + padding;

      // Check if it fits on current page, if not, add page!
      if (dayPointerY + cardHeight > 270) {
        doc.addPage();
        drawBorders();

        // Render mini-header on new page
        doc.setTextColor(28, 42, 56);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PLAN DIARIO DE RESTAURACIÓN (CONTINUACIÓN)', 105, 18, { align: 'center' });
        doc.line(20, 22, 190, 22);
        dayPointerY = 28;
      }

      // Draw Card background
      doc.setDrawColor(225, 220, 210);
      doc.setLineWidth(0.3);
      doc.setFillColor(252, 251, 249);
      doc.rect(20, dayPointerY, 170, cardHeight, 'FD');

      // Left Accent Strip
      doc.setFillColor(107, 142, 120);
      doc.rect(20, dayPointerY, 3.5, cardHeight, 'F');

      let currentY = dayPointerY + 6;

      // Title
      doc.setTextColor(28, 42, 56);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(`DÍA ${p.day} — ${p.citation.split('—')[0].trim()}`, 26, currentY);
      currentY += 5.5;

      // 1. Cita Bíblica
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 142, 120);
      doc.text('Cita Bíblica:', 26, currentY);
      doc.setFont('Helvetica', 'oblique');
      doc.setTextColor(60, 60, 60);
      doc.text(citationLines, 48, currentY);
      currentY += citationHeight + 1.5;

      // 2. Verdad a Recordar
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(107, 142, 120);
      doc.text('Verdad a Recordar:', 26, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(truthLines, 56, currentY);
      currentY += truthHeight + 1.5;

      // 3. Acción Práctica
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(107, 142, 120);
      doc.text('Acción Específica:', 26, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(actionLines, 54, currentY);
      currentY += actionHeight + 1.5;

      // 4. Entregar / Confiar
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(170, 90, 90); // Muted warm rust/red for surrender
      doc.text('Entregar o Confiar:', 26, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(surrenderLines, 58, currentY);
      currentY += surrenderHeight + 2;

      dayPointerY += cardHeight + 4.5; // Spacing to next card
    });

    doc.save('Plan_De_Renovacion_Personal_Cuando_Todo_Parece_Derrumbarse.pdf');
  };

  return (
    <div className="min-h-screen nature-gradient font-sans text-stone-800 flex flex-col justify-between py-12 px-4 selection:bg-emerald-100 relative">
      <AudioEngine onSpeakStatusChange={setIsSpeakingGlobally} />

      {/* Embedded decorative leaves / mountain background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.06] z-0">
        <svg className="absolute top-10 left-5 w-48 h-48 text-emerald-800" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50,10 C60,40 10,50 10,95 C45,95 50,55 50,10 Z" />
          <path d="M50,10 C40,40 90,50 90,95 C55,95 50,55 50,10 Z" fill="currentColor" className="opacity-70" />
        </svg>
        <svg className="absolute bottom-10 right-5 w-64 h-64 text-emerald-800" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50,10 L10,90 L90,90 Z" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center relative z-10">
        {/* Navigation Indicators */}
        {currentMovement !== 'intro' && currentMovement !== 'plan_final' && (
          <div className="max-w-md mx-auto w-full mb-8 flex justify-between items-center px-4">
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-medium font-serif opacity-70">
              Movimiento del Alma
            </span>
            <div className="flex gap-1.5">
              {(['mov1_detente', 'mov2_mochila', 'mov3_claridad', 'mov4_pastor', 'mov5_reconstruye'] as string[]).map((stepVal, idx) => {
                const isActive = currentMovement.startsWith(stepVal.substring(0, 4));
                return (
                  <div
                    key={stepVal}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive ? 'w-8 bg-emerald-700' : 'w-2 bg-stone-205 bg-stone-300'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* INTRO SCREEN */}
          {currentMovement === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 text-center max-w-3xl mx-auto"
            >
              <div className="inline-block p-2 bg-emerald-50 rounded-full text-emerald-700 mb-6">
                <Heart className="h-6 w-6 stroke-1.5 animate-pulse" />
              </div>

              <h1 className="font-serif text-3xl md:text-5xl text-stone-900 font-medium tracking-tight mb-4 select-text">
                Cuando Todo Parece Derrumbarse
              </h1>
              <p className="text-stone-500 font-serif italic text-base md:text-lg tracking-wide mb-8">
                Una experiencia guiada e inmersiva para encontrar paz, claridad y dirección cuando tu mundo se siente fuera de control.
              </p>

              {/* Narrator Intro Voice Box */}
              <div className="my-8 max-w-xl mx-auto p-6 bg-stone-50/70 border border-stone-100 rounded-2xl text-left font-serif leading-relaxed text-stone-700 text-sm md:text-base relative group">
                <p className="mb-4">
                  "No conozco exactamente tu historia, pero conozco de sobra la sensación de despertar sin saber cómo enfrentar otro día. He tenido temporadas donde sentí que todo se estaba derrumbando a mi alrededor."
                </p>
                <p>
                  "No estoy aquí para darte respuestas rápidas ni clichés religiosos. Estoy aquí para sentarme contigo y caminar a tu lado durante los próximos minutos."
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => speakActiveSlide(
                      "No conozco exactamente tu historia, pero conozco de sobra la sensación de despertar sin saber cómo enfrentar otro día. He tenido temporadas donde sentí que todo se estaba derrumbando a mi alrededor. No estoy aquí para darte respuestas rápidas ni clichés religiosos. Estoy aquí para sentarme contigo y caminar a tu lado durante los próximos minutos."
                    )}
                    className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium tracking-wider uppercase hover:text-emerald-900 cursor-pointer transition-colors"
                  >
                    <Volume2 className="h-4 w-4" /> Escuchar Narración Amigable
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-400 mb-10 leading-relaxed max-w-md mx-auto uppercase tracking-wider">
                Te aconsejamos ponerte cómododes, activar los altavoces o auriculares y tomar aire lento. Esto durará entre 15 y 20 minutos.
              </p>

              <button
                id="btn-empezar"
                onClick={() => navigateTo('mov1_detente')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 text-white rounded-full font-serif text-lg hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                Comenzar con un Suspiro <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* MOVIMIENTO 1: DETENTE */}
          {currentMovement === 'mov1_detente' && (
            <motion.div
              key="detente"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-serif font-semibold">
                  Movimiento 1 — Detente
                </span>
                <h2 className="font-serif text-2xl md:text-4xl text-stone-900 font-medium mt-2">
                  La Fuerza del Silencio
                </h2>
                <div className="h-[2px] w-12 bg-emerald-700 mx-auto mt-4" />
              </div>

              {/* Breathing Circle Guider Widget */}
              <div className="flex flex-col items-center justify-center my-10 relative">
                <motion.div
                  animate={{
                    scale: breathingStage === 'Inhala' ? 1.5 : breathingStage === 'Retén' ? 1.5 : 1.0,
                    opacity: breathingStage === 'Inhala' ? 0.9 : breathingStage === 'Retén' ? 1.0 : 0.6,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-44 h-44 md:w-52 md:h-52 rounded-full border border-emerald-700/20 bg-emerald-100/30 flex flex-col items-center justify-center breathing-ring relative"
                >
                  <span className="text-xs uppercase tracking-widest text-emerald-850 font-serif text-emerald-900">
                    {breathingStage}
                  </span>
                  <span className="font-serif text-4xl text-stone-900 mt-1">
                    {breathingSecondsLeft}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-2 uppercase tracking-wide">
                    segundos
                  </span>
                </motion.div>

                <p className="text-xs text-stone-400 mt-6 tracking-wide uppercase">
                  Ciclos de Alivio Logrados: <span className="font-bold text-stone-700">{breathingCyclesCompleted}</span>
                </p>
              </div>

              {/* Guiding Scripture & Reflection */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center font-serif relative">
                <span className="text-xs uppercase text-emerald-700 tracking-wider font-semibold block mb-2">Palabra Reveladora</span>
                <p className="text-lg md:text-xl text-stone-900 leading-relaxed italic mb-3">
                  "Estad quietos, y conoced que yo soy Dios..."
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Salmo 46:10</p>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed text-left">
                  Toda tormenta nos impulsa a correr, a gritar, a forzar puertas. Pero algunas batallas se ganan rindiendo nuestra velocidad. "Estar quietos" no es pereza; es el acto de fe definitivo en el que declaramos que Dios se ocupará de las olas que escapan de nuestras fuerzas.
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => speakActiveSlide(
                      "Salmo cuarenta y seis, diez: Estad quietos, y conoced que yo soy Dios. Toda tormenta nos impulsa a correr, a gritar, a forzar puertas. Pero algunas batallas se ganan rindiendo nuestra velocidad. Estar quietos no es pereza; es el acto de fe definitivo en el que declaramos que Dios se ocupará de las olas que escapan de nuestras fuerzas."
                    )}
                    className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4" /> Escuchar versículo
                  </button>
                  <span className="text-xs text-stone-400 italic">Respira al menos 3 veces antes de avanzar...</span>
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => navigateTo('intro')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-full font-serif text-sm hover:bg-stone-50 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> Inicio
                </button>
                <button
                  onClick={() => navigateTo('pause1')}
                  className="px-8 py-3 rounded-full font-serif text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer bg-emerald-800 text-white hover:bg-emerald-700 shadow-md"
                >
                  <span>Siguiente</span> <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MICROPAUSA 1 */}
          {currentMovement === 'pause1' && (
            <motion.div
              key="pause1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-xl mx-auto rounded-3xl p-8 border border-emerald-100/50 shadow-lg text-center ${MICROPAUSES.pause1.bgColor}`}
            >
              <h3 className="font-serif text-emerald-800 text-xs tracking-widest uppercase font-semibold mb-2">
                {MICROPAUSES.pause1.subtitle}
              </h3>
              <h2 className="font-serif text-2xl text-stone-900 font-medium mb-4">
                {MICROPAUSES.pause1.title}
              </h2>
              <p className="text-stone-700 font-serif leading-relaxed text-sm md:text-base mb-8 italic">
                "{MICROPAUSES.pause1.instruction}"
              </p>

              <button
                onClick={() => navigateTo('mov2_mochila')}
                className="px-8 py-3.5 bg-emerald-700 text-white rounded-full font-serif text-sm hover:bg-emerald-800 cursor-pointer transition-all duration-300 shadow-md"
              >
                {MICROPAUSES.pause1.actionText}
              </button>
            </motion.div>
          )}

          {/* MOVIMIENTO 2: VACÍA TU MOCHILA */}
          {currentMovement === 'mov2_mochila' && (
            <motion.div
              key="mochila"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-serif font-semibold">
                  Movimiento 2 — Vacía tu mochila
                </span>
                <h2 className="font-serif text-2xl md:text-4xl text-stone-900 font-medium mt-2">
                  Desempaca tu mochila emocional
                </h2>
                <div className="h-[2px] w-12 bg-emerald-700 mx-auto mt-4" />
                <p className="text-sm text-stone-500 font-serif mt-4 max-w-xl mx-auto leading-relaxed italic">
                  "El peso no disminuye si corres más rápido. Disminuye cuando nos damos el permiso de ser vulnerables y colocar las piedras sobre la mesa."
                </p>
              </div>

              {/* Core Writing Prompt Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 font-serif mb-1.5">
                    ¿Qué es lo que más te preocupa hoy?
                  </label>
                  <textarea
                    rows={2}
                    value={backpack.precupa}
                    onChange={(e) => setBackpack({ ...backpack, precupa: e.target.value })}
                    placeholder="Describe libremente los problemas que giran en tu mente ahora mismo..."
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 font-serif mb-1.5">
                    ¿Qué es lo que más te duele o pesa interiormente?
                  </label>
                  <textarea
                    rows={2}
                    value={backpack.duele}
                    onChange={(e) => setBackpack({ ...backpack, duele: e.target.value })}
                    placeholder="Relaciones lastimadas, vacíos, palabras que te hicieron sentir derrotado..."
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 font-serif mb-1.5">
                    ¿Qué miedos se levantan cuando imaginas el futuro?
                  </label>
                  <textarea
                    rows={2}
                    value={backpack.miedo}
                    onChange={(e) => setBackpack({ ...backpack, miedo: e.target.value })}
                    placeholder="El miedo al rechazo, al fracaso financiero, a que todo se desmorone del todo..."
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 font-serif mb-1.5">
                    Si pudieras cambiar algo de tu situación actual, ¿qué sería?
                  </label>
                  <textarea
                    rows={2}
                    value={backpack.cambiar}
                    onChange={(e) => setBackpack({ ...backpack, cambiar: e.target.value })}
                    placeholder="Una restauración familiar, un milagro financiero, o salud para un ser querido..."
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {unpackingError && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{unpackingError}</span>
                </div>
              )}

              {/* Footer controls and Loader block */}
              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={() => navigateTo('mov1_detente')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-full font-serif text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Atrás
                </button>

                <button
                  onClick={handleUnpackBackpack}
                  disabled={isUnpackingLoading || (!backpack.precupa && !backpack.duele && !backpack.miedo && !backpack.cambiar)}
                  className="px-8 py-3.5 bg-emerald-800 text-white rounded-full font-serif text-sm hover:bg-emerald-700 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {isUnpackingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>El Consejero está leyendo tus líneas...</span>
                    </>
                  ) : (
                    <>
                      <span>Desempacar mi mochila delante de Dios</span> <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {isUnpackingLoading && (
                <p className="text-[11px] text-stone-400 text-center uppercase tracking-wider mt-4 animate-pulse">
                  Alineando tus preocupaciones con el amor redentor de Cristo en el servidor... por favor súpira hondo.
                </p>
              )}
            </motion.div>
          )}

          {/* DYNAMIC POST ROUTE RESPONSE PARCHMENT */}
          {currentMovement === 'pastoral_unpack' && (
            <motion.div
              key="unpack_response"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#fcfbf9] rounded-3xl p-8 md:p-14 shadow-xl border border-stone-250/60 max-w-2xl mx-auto relative overflow-hidden"
              style={{ boxShadow: 'inset 0 0 40px rgba(220,215,200,0.4), 0 10px 30px rgba(0,0,0,0.05)' }}
            >
              {/* Parchment decorative borders */}
              <div className="absolute top-0 left-0 w-3 h-full bg-emerald-700/10" />
              <div className="absolute top-0 right-0 w-3 h-full bg-emerald-700/10" />

              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-emerald-800 font-serif font-semibold">
                  Palabras de tu Consejero y Pastor
                </span>
                <div className="h-[1px] w-24 bg-stone-200 mx-auto mt-2" />
              </div>

              {/* Pastoral advice text */}
              <div className="font-serif text-stone-850 text-base leading-relaxed space-y-6 italic select-text text-stone-800">
                {pastoralResponse ? (
                  pastoralResponse.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p>Mascullando palabras de alivio especial...</p>
                )}
              </div>

              {/* Speech sound player */}
              <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => speakActiveSlide(pastoralResponse || "")}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" /> 🔊 Escuchar este consejo de voz
                </button>

                <button
                  onClick={() => navigateTo('pause2')}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-full font-serif text-sm hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5"
                >
                  Avanzar al siguiente paso <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MICROPAUSA 2 */}
          {currentMovement === 'pause2' && (
            <motion.div
              key="pause2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-xl mx-auto rounded-3xl p-8 border border-blue-100/30 shadow-lg text-center ${MICROPAUSES.pause2.bgColor}`}
            >
              <h3 className="font-serif text-sky-850 text-xs tracking-widest uppercase font-semibold mb-2">
                {MICROPAUSES.pause2.subtitle}
              </h3>
              <h2 className="font-serif text-2xl text-stone-900 font-medium mb-4">
                {MICROPAUSES.pause2.title}
              </h2>
              <p className="text-stone-700 font-serif leading-relaxed text-sm md:text-base mb-8 italic">
                "{MICROPAUSES.pause2.instruction}"
              </p>

              <button
                onClick={() => navigateTo('mov3_claridad')}
                className="px-8 py-3.5 bg-emerald-700 text-white rounded-full font-serif text-sm hover:bg-emerald-800 cursor-pointer transition-all duration-300 shadow-md"
              >
                {MICROPAUSES.pause2.actionText}
              </button>
            </motion.div>
          )}

          {/* MOVIMIENTO 3: RECUPERA CLARIDAD (Control Dynamic Matrix) */}
          {currentMovement === 'mov3_claridad' && (
            <motion.div
              key="claridad"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 max-w-4xl mx-auto"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-serif font-semibold">
                  Movimiento 3 — Recupera claridad
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-medium mt-1">
                  Filtrar la ansiedad: El límite del control
                </h2>
                <div className="h-[2px] w-12 bg-emerald-700 mx-auto mt-3" />
                <p className="text-sm text-stone-500 font-serif mt-3 max-w-xl mx-auto">
                  Clasifica cada una de las dinámicas de abajo haciendo un clic directamente sobre ellas. Separa lo que está bajo tu responsabilidad de lo que le pertenece únicamente a Dios. O pulsa el botón de abajo para organizarlas todas ahora mismo.
                </p>
              </div>

              {/* Items sorting stage bar */}
              {unsortedBurdens.length > 0 && (
                <div className="mb-8 p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-350">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest block text-center mb-3">
                    Dinámicas pendientes por filtrar ({unsortedBurdens.length}) — ¡Haz clic para clasificar!
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {unsortedBurdens.map((burden) => (
                      <button
                        key={burden.id}
                        onClick={() => {
                          // Sort into the correct category based on its predetermined metadata
                          const key = burden.controllable ? 'controllable' : 'uncontrollable';
                          setControlMatrix((prev) => ({
                            ...prev,
                            [key]: [...prev[key], burden.text]
                          }));
                          setUnsortedBurdens((prev) => prev.filter((b) => b.id !== burden.id));
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-xl text-xs text-stone-750 cursor-pointer shadow-sm transition-all flex items-center gap-1.5 active:scale-95 group font-serif"
                      >
                        <span>{burden.text}</span>
                        <Sparkles className="h-3 w-3 text-stone-400 group-hover:text-emerald-600" />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center border-t border-stone-200/60 pt-3">
                    <button
                      onClick={autoSortBurdens}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-700 animate-pulse" />
                      <span>Clasificar todo automáticamente</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Grid 2 Column Matrix Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Column 1: Uncontrollable (Release to Father) */}
                <div className="bg-stone-50/50 rounded-2xl p-5 border border-stone-150/40">
                  <h3 className="font-serif text-stone-600 uppercase tracking-wider text-xs font-bold mb-3 border-b border-stone-200/50 pb-2 flex items-center justify-between">
                    <span>Lo que NO puedo controlar</span>
                    <span className="text-[10px] text-stone-400 font-normal normal-case italic">Suelto a Dios</span>
                  </h3>
                  <div className="space-y-2 min-h-[160px]">
                    {controlMatrix.uncontrollable.length === 0 ? (
                      <p className="text-xs text-stone-400 italic text-center pt-10">Haz clic en burdens de arriba para liberar piedras...</p>
                    ) : (
                      controlMatrix.uncontrollable.map((p, idx) => (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.6 }} // soft faded look
                          key={idx}
                          className="p-3 bg-white border border-dashed border-stone-250 text-xs text-stone-500 rounded-xl leading-relaxed italic flex items-start gap-2"
                        >
                          <span className="text-stone-300 shrink-0">✓</span>
                          <span>{p}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                  {controlMatrix.uncontrollable.length > 0 && (
                    <p className="text-[10px] text-stone-400 italic text-right mt-2">
                      Faded: Has rendido estas cargas fuera de tu círculo. Es momento de que descansen.
                    </p>
                  )}
                </div>

                {/* Column 2: Controllable (Actions of stewardship) */}
                <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/30">
                  <h3 className="font-serif text-emerald-800 uppercase tracking-wider text-xs font-bold mb-3 border-b border-emerald-100 pb-2 flex items-center justify-between">
                    <span>Lo que SÍ puedo controlar</span>
                    <span className="text-[10px] text-emerald-700 font-normal normal-case italic">Mayordomía</span>
                  </h3>
                  <div className="space-y-2 min-h-[160px]">
                    {controlMatrix.controllable.length === 0 ? (
                      <p className="text-xs text-stone-400 italic text-center pt-10">Haz clic en burdens activos para adueñarte de tus pasos...</p>
                    ) : (
                      controlMatrix.controllable.map((p, idx) => (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={idx}
                          className="p-3 bg-white border border-emerald-700/20 text-xs text-stone-800 font-medium rounded-xl leading-relaxed shadow-sm flex items-start gap-2 border-l-4 border-l-emerald-700"
                        >
                          <span className="text-emerald-700 font-bold shrink-0">→</span>
                          <span>{p}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Comfort scripture of release */}
              {unsortedBurdens.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-700/10 text-center font-serif mt-8"
                >
                  <p className="text-lg text-emerald-950 font-serif leading-relaxed italic mb-2">
                    "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros."
                  </p>
                  <span className="text-xs text-emerald-700 uppercase tracking-widest font-semibold block mb-2">1 Pedro 5:7</span>
                  <p className="text-xs text-stone-500 max-w-lg mx-auto">
                    ¿Te das cuenta de la balanza? El 80% de lo que te roba el aire pertenece a la columna de la izquierda. Lo que no puedes controlar está amparado bajo la soberanía de Aquel que te amó con celo. Suelta la columna de la izquierda; ocúpate sabiamente del pequeño paso de la derecha.
                  </p>

                  <button
                    onClick={() => speakActiveSlide(
                      "Versículo de Primera de Pedro cinco, siete: Echando toda vuestra ansiedad sobre Él, porque Él tiene cuidado de vosotros. ¿Te das cuenta de la balanza? El ochenta por ciento de lo que te roba el aire pertenece a la columna de la izquierda, cosas que escapan de ti. Suelta esa columna de la izquierda. Ocúpate sabiamente de los pasos de la derecha."
                    )}
                    className="mt-4 flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium mx-auto cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4" /> Escuchar versículo y reflexión
                  </button>
                </motion.div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigateTo('mov2_mochila')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-full font-serif text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Regresar a la Mochila
                </button>
                <button
                  onClick={() => {
                    if (unsortedBurdens.length > 0) {
                      autoSortBurdens();
                    }
                    navigateTo('pause3');
                  }}
                  className="px-8 py-3 bg-emerald-800 text-white hover:bg-emerald-700 rounded-full font-serif text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Avanzar</span> <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MICROPAUSA 3 */}
          {currentMovement === 'pause3' && (
            <motion.div
              key="pause3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-xl mx-auto rounded-3xl p-8 border border-amber-100/30 shadow-lg text-center ${MICROPAUSES.pause3.bgColor}`}
            >
              <h3 className="font-serif text-amber-800 text-xs tracking-widest uppercase font-semibold mb-2">
                {MICROPAUSES.pause3.subtitle}
              </h3>
              <h2 className="font-serif text-2xl text-stone-900 font-medium mb-4">
                {MICROPAUSES.pause3.title}
              </h2>
              <p className="text-stone-700 font-serif leading-relaxed text-sm md:text-base mb-8 italic">
                "{MICROPAUSES.pause3.instruction}"
              </p>

              <button
                onClick={() => navigateTo('mov4_pastor')}
                className="px-8 py-3.5 bg-emerald-700 text-white rounded-full font-serif text-sm hover:bg-emerald-800 cursor-pointer transition-all duration-300 shadow-md"
              >
                {MICROPAUSES.pause3.actionText}
              </button>
            </motion.div>
          )}

          {/* MOVIMIENTO 4: ESCUCHA AL PASTOR (Psalm 23 & Sheep types) */}
          {currentMovement === 'mov4_pastor' && (
            <motion.div
              key="pastor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-serif font-semibold">
                  Movimiento 4 — Escucha al pastor
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-medium mt-1">
                  En el redil del Salmo 23
                </h2>
                <div className="h-[2px] w-12 bg-emerald-700 mx-auto mt-3" />
                <p className="text-sm text-stone-500 font-serif mt-3 max-w-xl mx-auto italic">
                  "El Señor no pastorea estadísticas; pastorea almas cansadas con nombres y posturas individuales. ¿Cómo te presentas ante Él hoy?"
                </p>
              </div>

              {/* Dynamic Step selectors inside Slide */}
              <div className="space-y-8">
                {/* Step 4.1: Identify posture (Sheep selector) */}
                <div>
                  <h3 className="font-serif text-sm font-semibold text-stone-850 mb-3 flex items-center gap-1.5 text-stone-900">
                    <span className="w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center text-xs text-stone-600 font-serif">1</span>
                    ¿Qué postura de oveja describe mejor el estado de tu alma hoy?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {(Object.keys(SHEEP_DETAILS) as SheepType[]).map((key) => {
                      const sheepObj = SHEEP_DETAILS[key];
                      const isSelected = selectedSheep === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedSheep(key);
                            // Also read the pastoral guidance automatically to give immersive aura
                            speakActiveSlide(sheepObj.pastoralWord);
                          }}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-700 ring-1 ring-emerald-700 shadow-sm'
                              : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50/50'
                          }`}
                        >
                          <span className="text-xs font-bold block capitalize text-stone-800 font-serif">
                            {key}
                          </span>
                          <span className="text-[10px] text-stone-400 block leading-tight mt-1">
                            {sheepObj.label.split(' (')[1]?.slice(0, -1) || 'Carga espiritual'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Display pastoral word immediately for selected sheep type */}
                  <div className="mt-4 p-5 bg-stone-50 rounded-2xl border border-stone-150/40 relative">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-widest block mb-1">
                      Mensaje directo del Pastor para la oveja "{selectedSheep.toUpperCase()}"
                    </span>
                    <p className="text-stone-700 text-sm font-serif leading-relaxed italic">
                      "{SHEEP_DETAILS[selectedSheep].pastoralWord}"
                    </p>

                    <div className="mt-2.5 flex justify-end">
                      <button
                        onClick={() => speakActiveSlide(SHEEP_DETAILS[selectedSheep].pastoralWord)}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
                      >
                        <Volume2 className="h-3 w-3" /> Re-escuchar de viva voz
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 4.2: Identify Core Need */}
                <div>
                  <h3 className="font-serif text-sm font-semibold text-stone-850 mb-3 flex items-center gap-1.5 text-stone-900">
                    <span className="w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center text-xs text-stone-600 font-serif">2</span>
                    ¿Qué es lo que más necesita tu caminar el día de hoy?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {(Object.keys(NEED_DETAILS) as CoreNeed[]).map((key) => {
                      const needObj = NEED_DETAILS[key];
                      const isSelected = selectedNeed === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedNeed(key);
                            speakActiveSlide(needObj.verse + ". " + needObj.reflection);
                          }}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-700 ring-1 ring-emerald-700'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <span className="text-xs font-bold block capitalize text-stone-800 font-serif">
                            {key}
                          </span>
                          <span className="text-[10px] text-stone-500 mt-1 block leading-tight">
                            {needObj.label.split(' para')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Reflection of the core need chosen */}
                  <div className="mt-4 p-5 bg-amber-50/20 rounded-2xl border border-amber-100/40">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest block mb-1">
                      Promesa asignada a tu descanso
                    </span>
                    <p className="font-serif text-sm text-stone-900 italic font-bold mb-1">
                      {NEED_DETAILS[selectedNeed].verse}
                    </p>
                    <p className="font-serif text-stone-600 text-xs leading-relaxed">
                      {NEED_DETAILS[selectedNeed].reflection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide controls */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={() => navigateTo('mov3_claridad')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-full font-serif text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Regresar al Matrix
                </button>
                <button
                  onClick={() => navigateTo('mov5_reconstruye')}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-full font-serif text-sm hover:bg-emerald-700 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  Avanzar a Reconstruir <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MOVIMIENTO 5: RECONSTRUYE LOS PRÓXIMOS 30 DÍAS */}
          {currentMovement === 'mov5_reconstruye' && (
            <motion.div
              key="reconstruye"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-xl border border-stone-100 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-serif font-semibold">
                  Movimiento 5 — Reconstruye los próximos 30 días
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-medium mt-1">
                  Tu plan de restauración lenta
                </h2>
                <div className="h-[2px] w-12 bg-emerald-700 mx-auto mt-3" />
                <p className="text-sm text-stone-500 font-serif mt-3 max-w-xl mx-auto">
                  "No busques arreglar toda tu vida de golpe. Elige un paso diminuto y realizable en cada una de las 4 dimensiones. El secreto está en la humilde constancia de la obediencia."
                </p>
              </div>

              {/* Habits selection panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Mind presets */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60">
                  <h3 className="font-serif text-stone-800 text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold font-mono">1.</span> Mi Mente
                  </h3>
                  <p className="text-[10px] text-stone-400 mb-3 lowercase tracking-wide">
                    Selecciona de 1 a 3 hábitos simples de quietud:
                  </p>
                  <div className="space-y-2">
                    {HABIT_PRESETS.mente.map((preset) => {
                      const isChecked = selectedHabits.mente.includes(preset.id);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleToggleHabit('mente', preset.id)}
                          className={`w-full p-3 text-left rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-100/40 text-emerald-950 border border-emerald-300'
                              : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{preset.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Body presets */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60">
                  <h3 className="font-serif text-stone-800 text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold font-mono">2.</span> Mi Cuerpo
                  </h3>
                  <p className="text-[10px] text-stone-400 mb-3 lowercase tracking-wide">
                    Selecciona de 1 a 3 hábitos de templo físico:
                  </p>
                  <div className="space-y-2">
                    {HABIT_PRESETS.cuerpo.map((preset) => {
                      const isChecked = selectedHabits.cuerpo.includes(preset.id);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleToggleHabit('cuerpo', preset.id)}
                          className={`w-full p-3 text-left rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-100/40 text-emerald-950 border border-emerald-300'
                              : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{preset.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Relationships presets */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60">
                  <h3 className="font-serif text-stone-800 text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold font-mono">3.</span> Mis Relaciones
                  </h3>
                  <p className="text-[10px] text-stone-400 mb-3 lowercase tracking-wide">
                    Selecciona de 1 a 3 hábitos de reconciliación:
                  </p>
                  <div className="space-y-2">
                    {HABIT_PRESETS.relaciones.map((preset) => {
                      const isChecked = selectedHabits.relaciones.includes(preset.id);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleToggleHabit('relaciones', preset.id)}
                          className={`w-full p-3 text-left rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-100/40 text-emerald-950 border border-emerald-300'
                              : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{preset.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Communion presets */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60">
                  <h3 className="font-serif text-stone-800 text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold font-mono">4.</span> Mi Comunión con Dios
                  </h3>
                  <p className="text-[10px] text-stone-400 mb-3 lowercase tracking-wide">
                    Selecciona de 1 a 3 hábitos de intimidad sagrada:
                  </p>
                  <div className="space-y-2">
                    {HABIT_PRESETS.comunion.map((preset) => {
                      const isChecked = selectedHabits.comunion.includes(preset.id);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleToggleHabit('comunion', preset.id)}
                          className={`w-full p-3 text-left rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-100/40 text-emerald-950 border border-emerald-300'
                              : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{preset.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation and Final Plan triggers */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigateTo('mov4_pastor')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-full font-serif text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  onClick={handleGenerateFinalPlan}
                  className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full font-serif text-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <span>Ver mi Plan de Renovación</span> <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MASTER RESOLUTION & DOWNLOAD DECK CONTAINER: EMOTIONAL CLIMAX */}
          {currentMovement === 'plan_final' && (
            <motion.div
              key="plan_final"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/95 rounded-3xl p-8 md:p-14 shadow-2xl border border-emerald-100/30 max-w-4xl mx-auto"
            >
              {/* Plan Header */}
              <div className="text-center mb-8 border-b border-stone-100 pb-6">
                <span className="text-xs uppercase tracking-widest text-emerald-800 font-serif font-bold">
                  Documento de Restauración Lenta
                </span>
                <h1 className="font-serif text-3xl md:text-5xl text-stone-900 font-bold mt-2">
                  Mi Plan de Renovación de 30 Días
                </h1>
                <p className="text-xs text-stone-400 font-serif italic mt-2 uppercase tracking-wide">
                  «El Señor es mi Pastor, nada me faltará» — Salmo 23:1
                </p>
              </div>

              {isGeneratingPlan ? (
                /* Beautiful animated pastoral loader whilst compiling personalized backend payload */
                <div className="py-20 text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-700/20 rounded-full" />
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-700 rounded-full border-t-transparent animate-spin" />
                  </div>
                  <h3 className="font-serif text-lg text-stone-800 font-medium">
                    Redactando tu bendición pastoral a medida...
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    Hemos enviado las preocupaciones de tu mochila, tu necesidad primordial de {selectedNeed.toUpperCase()} y tus hábitos seleccionados al Pastor. Se está gestando una oración personal en el Espíritu.
                  </p>
                </div>
              ) : (
                /* Complete Rendered printable dashboard */
                <div className="space-y-8 select-text">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column stats details */}
                    <div className="md:col-span-1 bg-stone-50/50 p-5 rounded-2xl border border-stone-150 text-xs">
                      <h3 className="font-serif text-emerald-800 font-bold uppercase tracking-widest mb-3 border-b border-stone-200 pb-2">
                        Punto de Partida
                      </h3>

                      <div className="space-y-4 font-serif">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wide block">
                            Postura Adoptada:
                          </span>
                          <span className="font-semibold block capitalize hover:underline cursor-help" title={SHEEP_DETAILS[selectedSheep].description}>
                            Oveja {selectedSheep}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wide block">
                            Necesidad Central:
                          </span>
                          <span className="font-semibold block capitalize">
                            {selectedNeed}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wide block">
                            Versículo en vela:
                          </span>
                          <span className="italic leading-normal block text-stone-700 bg-amber-50/50 p-2 border border-amber-100 rounded-lg mt-1 font-bold mt-1">
                            {NEED_DETAILS[selectedNeed]?.verse}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column Habits summary list */}
                    <div className="md:col-span-2 bg-stone-50/50 p-5 rounded-2xl border border-stone-150">
                      <h3 className="font-serif text-emerald-800 font-bold uppercase tracking-widest text-xs mb-3 border-b border-stone-200 pb-2">
                        Pasos Pequeños de Restauración Diaria
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {[
                          { key: 'mente', label: 'Mi Mente' },
                          { key: 'cuerpo', label: 'Mi Cuerpo' },
                          { key: 'relaciones', label: 'Mis Relaciones' },
                          { key: 'comunion', label: 'Mi Comunión con Dios' }
                        ].map((cat) => {
                          const list = selectedHabits[cat.key as 'mente' | 'cuerpo' | 'relaciones' | 'comunion'] || [];
                          return (
                            <div key={cat.key} className="space-y-1">
                              <h4 className="font-serif font-bold text-stone-800 flex items-center gap-1">
                                <CheckSquare className="h-3.5 w-3.5 text-emerald-700 stroke-2" /> {cat.label}
                              </h4>
                              {list.length === 0 ? (
                                <p className="text-[10px] text-stone-400 italic">No seleccionaste específicos. Se practicará el silencio espontáneo.</p>
                              ) : (
                                <ul className="list-disc list-inside space-y-1 text-stone-600 leading-relaxed text-[10px] pl-1">
                                  {list.map((id) => {
                                    const hab = HABIT_PRESETS[cat.key]?.find((h) => h.id === id);
                                    return <li key={id}>{hab?.text}</li>;
                                  })}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Personalized Pastoral Prayer card */}
                  {serverResponsePrayer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-emerald-50/20 rounded-2xl border border-emerald-700/10 font-serif italic relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Heart className="h-44 w-44 fill-emerald-700" />
                      </div>

                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                        Tu Bendición Pastoral y Oración Escrita
                      </span>

                      <div className="text-stone-850 text-sm md:text-base leading-relaxed space-y-4 leading-loose select-text mt-3">
                        <p className="whitespace-pre-line">{serverResponsePrayer.oracion}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-stone-200/50 flex justify-between items-center text-xs">
                        <button
                          onClick={() => speakActiveSlide(serverResponsePrayer.oracion)}
                          className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer"
                        >
                          <Volume2 className="h-4 w-4" /> 🔊 Escuchar Oración en Voz Alta
                        </button>
                        <span className="text-stone-400 tracking-wide font-normal">Consejero Bíblico y Pastor</span>
                      </div>
                    </motion.div>
                  )}

                  {/* PDF Download and Master Restart Control Panels */}
                  <div className="pt-6 border-t border-stone-150 flex flex-col sm:flex-row gap-4 justify-between items-center text-center">
                    <button
                      onClick={() => {
                        // Reset entire state machine easily
                        navigateTo('intro');
                        setBackpack({ precupa: '', duele: '', miedo: '', cambiar: '' });
                        setSelectedHabits({ mente: [], cuerpo: [], relaciones: [], comunion: [] });
                        setUnsortedBurdens([
                          { id: 'b1', text: 'El rumbo de la economía global', controllable: false },
                          { id: 'b2', text: 'La actitud o críticas de otras personas', controllable: false },
                          { id: 'b3', text: 'Rendir mis temores diarios en oración', controllable: true },
                          { id: 'b4', text: 'Los errores y culpas del pasado', controllable: false },
                          { id: 'b5', text: 'Elegir perdonar y soltar el rencor hoy', controllable: true },
                          { id: 'b6', text: 'Cuidar las horas de descanso de mi cuerpo', controllable: true },
                          { id: 'b7', text: 'Saber qué va a pasar exactamente mañana', controllable: false },
                          { id: 'b8', text: 'Dar gracias por una cosa pequeña cada mañana', controllable: true }
                        ]);
                        setControlMatrix({ uncontrollable: [], controllable: [] });
                        setServerResponsePrayer(null);
                        setBreathingCyclesCompleted(0);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 text-stone-600 rounded-full text-xs font-serif hover:bg-stone-50 cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" /> Iniciar de Nuevo la Senda
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 text-white rounded-full font-serif hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-sm animate-bounce hover:animate-none"
                    >
                      <Download className="h-4 w-4" /> Descargar mi Plan Completo (PDF)
                    </button>
                  </div>

                  {/* Powerful emotional closing words */}
                  <div className="mt-12 text-center p-6 border-2 border-stone-100 rounded-3xl max-w-xl mx-auto">
                    <h3 className="font-serif text-lg md:text-xl text-stone-800 font-medium mb-1.5">
                      "Jehová es mi pastor; nada me faltará."
                    </h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest block mb-4">Salmo 23:1</p>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                      Los problemas y desiertos quizá no desaparezcan mágicamente al amanecer de mañana, pero el Buen Pastor sigue habitando en tu fragilidad. Cristo sigue siendo plenamente suficiente, Su cayado sigue guiándote y la esperanza sigue con vida plena. Descansa en Su amor hoy. Nada te faltará.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Embedded footer signature line */}
      <div className="w-full text-center text-[10px] text-stone-400/80 uppercase tracking-widest mt-12 mb-2 font-mono">
        © {new Date().getFullYear()} Cuando Todo Parece Derrumbarse • Consejería Bíblica Cristocéntrica
      </div>
    </div>
  );
}
