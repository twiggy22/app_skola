import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, Lightbulb, X, Undo2, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORDS_DATA = [
  { word: 'AUTO', syllables: ['AU', 'TO'], emoji: '🚗' },
  { word: 'KOČKA', syllables: ['KOČ', 'KA'], emoji: '🐱' },
  { word: 'MÁMA', syllables: ['MÁ', 'MA'], emoji: '👩' },
  { word: 'TÁTA', syllables: ['TÁ', 'TA'], emoji: '👨' },
  { word: 'RUKA', syllables: ['RU', 'KA'], emoji: '✋' },
  { word: 'NOHA', syllables: ['NO', 'HA'], emoji: '🦶' },
  { word: 'KOLO', syllables: ['KO', 'LO'], emoji: '🚲' },
  { word: 'SOVA', syllables: ['SO', 'VA'], emoji: '🦉' },
  { word: 'ROBOT', syllables: ['RO', 'BOT'], emoji: '🤖' },
  { word: 'RYBA', syllables: ['RY', 'BA'], emoji: '🐟' },
  { word: 'DOMA', syllables: ['DO', 'MA'], emoji: '🏠' },
  { word: 'LAMA', syllables: ['LA', 'MA'], emoji: '🦙' },
  { word: 'PUSA', syllables: ['PU', 'SA'], emoji: '👄' },
  { word: 'ZIMA', syllables: ['ZI', 'MA'], emoji: '❄️' },
  { word: 'VODA', syllables: ['VO', 'DA'], emoji: '💧' },
];

export function WordCompositionGame() {
  const [currentWord, setCurrentWord] = useState(null);
  const [pool, setPool] = useState([]); // Array of syllable objects { id, text }
  const [slots, setSlots] = useState([]); // Array of syllable objects or null
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomWord = WORDS_DATA[Math.floor(Math.random() * WORDS_DATA.length)];
    setCurrentWord(randomWord);

    // Prepare correct syllables
    const correctSyllables = randomWord.syllables.map((text, index) => ({
      id: `correct-${index}`,
      text,
      isCorrect: true
    }));

    // Prepare distractors (2 random syllables from other words)
    const distractors = [];
    while (distractors.length < 2) {
      const randomOtherWord = WORDS_DATA[Math.floor(Math.random() * WORDS_DATA.length)];
      const randomSyllable = randomOtherWord.syllables[Math.floor(Math.random() * randomOtherWord.syllables.length)];
      
      // Avoid duplicates in distractors and avoid correct syllables
      const isDuplicate = distractors.some(d => d.text === randomSyllable) || correctSyllables.some(c => c.text === randomSyllable);
      
      if (!isDuplicate) {
        distractors.push({
          id: `distractor-${distractors.length}`,
          text: randomSyllable,
          isCorrect: false
        });
      }
    }

    // Combine and shuffle
    const allSyllables = [...correctSyllables, ...distractors].sort(() => Math.random() - 0.5);
    
    setPool(allSyllables);
    setSlots(new Array(randomWord.syllables.length).fill(null));
    setMessage('');
  };

  const handlePoolClick = (syllable) => {
    if (message.includes('Správně')) return;

    // Find first empty slot
    const emptySlotIndex = slots.findIndex(s => s === null);
    
    if (emptySlotIndex !== -1) {
      const newSlots = [...slots];
      newSlots[emptySlotIndex] = syllable;
      setSlots(newSlots);

      // Remove from pool (visually hide or disable)
      setPool(pool.map(p => p.id === syllable.id ? { ...p, used: true } : p));

      // Check if full
      if (emptySlotIndex === slots.length - 1) {
        checkAnswer(newSlots);
      }
    }
  };

  const handleSlotClick = (index) => {
    if (message.includes('Správně')) return;
    
    const syllable = slots[index];
    if (syllable) {
      // Return to pool
      setPool(pool.map(p => p.id === syllable.id ? { ...p, used: false } : p));
      
      // Clear slot
      const newSlots = [...slots];
      newSlots[index] = null;
      setSlots(newSlots);
      setMessage('');
    }
  };

  const checkAnswer = (currentSlots) => {
    const formedWord = currentSlots.map(s => s.text).join('');
    const targetWord = currentWord.syllables.join('');

    if (formedWord === targetWord) {
      setMessage('Správně! 🎉');
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#fdba74']
      });
      setTimeout(startNewRound, 1500);
    } else {
      setMessage('Zkus to znovu');
    }
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <div className="flex justify-between w-full mb-8">
        <Link to="/grade1/czech" className="text-orange-500 hover:text-orange-700 flex items-center gap-2">
          <ArrowLeft /> Zpět
        </Link>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowHelp(true)} 
                className="p-2 rounded-full transition-colors text-yellow-500 hover:bg-yellow-50"
                title="Nápověda"
            >
                <Lightbulb size={28} />
            </button>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                <Star fill="currentColor" /> {score}
            </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-orange-800 mb-8">
        Poskládej slovo
      </h2>

      {/* Image */}
      <div className="flex items-center justify-center w-48 h-48 bg-white rounded-3xl shadow-sm border-2 border-orange-100 mb-8">
        <span className="text-8xl">{currentWord.emoji}</span>
      </div>

      {/* Slots (Answer Area) */}
      <div className="flex gap-4 mb-12 min-h-[100px]">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotClick(index)}
            className={`
              w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-3xl font-bold transition-all
              ${slot 
                ? 'bg-orange-100 border-orange-400 text-orange-800 shadow-md hover:bg-red-50 hover:border-red-200 hover:text-red-800' 
                : 'bg-gray-50 border-dashed border-gray-300 text-gray-300'}
            `}
          >
            {slot ? slot.text : '?'}
          </button>
        ))}
      </div>

      {/* Pool (Options) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {pool.map((syllable) => (
          <button
            key={syllable.id}
            onClick={() => !syllable.used && handlePoolClick(syllable)}
            disabled={syllable.used}
            className={`
              w-20 h-20 rounded-xl text-2xl font-bold transition-all
              ${syllable.used 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-white border-b-4 border-orange-200 text-orange-600 shadow-sm hover:-translate-y-1 hover:border-orange-400 active:translate-y-0 active:border-b-0'}
            `}
          >
            {syllable.text}
          </button>
        ))}
      </div>

      {message && (
        <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-4 text-orange-800">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Poskládej rozházené slabiky do správného slova!
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Podívej se na obrázek (např. 🚗).</li>
                <li>Dole vidíš slabiky (např. <strong>AU</strong>, <strong>TO</strong>, <strong>KO</strong>).</li>
                <li>Klikni na slabiky ve správném pořadí.</li>
                <li>Pokud uděláš chybu, klikni na slabiku nahoře a ona se vrátí zpět.</li>
              </ul>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
