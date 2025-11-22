import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star, Frown, Save, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function NumberLineGame({ maxNumber = 20 }) {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const generateGame = () => {
    setIsComplete(false);
    
    // Determine sequence length (e.g., 7 numbers for better wrapping/snake effect)
    const length = 7;
    // Random start number so sequence fits in maxNumber
    // max start = maxNumber - length + 1
    const maxStart = Math.max(1, maxNumber - length + 1);
    const start = Math.floor(Math.random() * maxStart);
    
    const newSequence = [];
    const missingIndices = [];
    
    // Create full sequence
    for (let i = 0; i < length; i++) {
      newSequence.push({
        value: start + i,
        isMissing: false,
        filledValue: null
      });
    }

    // Pick 3 random positions to be missing (increased from 2)
    while (missingIndices.length < 3) {
      const idx = Math.floor(Math.random() * length);
      if (!missingIndices.includes(idx)) {
        missingIndices.push(idx);
        newSequence[idx].isMissing = true;
      }
    }

    setSequence(newSequence);

    // Create options from missing numbers
    const missingValues = missingIndices.map(idx => ({
      id: `opt-${newSequence[idx].value}`,
      value: newSequence[idx].value
    }));
    
    // Shuffle options
    setOptions(missingValues.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateGame();
  }, [maxNumber]);

  const handleOptionClick = (option) => {
    if (selectedOption && selectedOption.id === option.id) {
      setSelectedOption(null); // Deselect
    } else {
      setSelectedOption(option); // Select
    }
  };

  const handleSlotClick = (index) => {
    const slot = sequence[index];
    
    // Case 1: Slot is empty and we have a selected option -> Place it
    if (slot.isMissing && slot.filledValue === null && selectedOption) {
      const newSequence = [...sequence];
      newSequence[index].filledValue = selectedOption.value;
      setSequence(newSequence);

      // Remove from options
      setOptions(prev => prev.filter(o => o.id !== selectedOption.id));
      setSelectedOption(null);

      // Check correctness immediately (optional, or wait for check)
      if (selectedOption.value !== slot.value) {
        setMessage('Zkus to znovu');
      } else {
        setMessage('');
      }

      // Check win
      const allCorrect = newSequence.every(item => 
        !item.isMissing || item.filledValue === item.value
      );

      if (allCorrect) {
        setIsComplete(true);
        setMessage('Správně! 🎉');
        setScore(s => s + 1);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
      return;
    }

    // Case 2: Slot is filled -> Remove it (return to options)
    if (!slot.isMissing || slot.filledValue === null || isComplete) return;

    // Return value to options
    const valueToReturn = slot.filledValue;
    
    // Update sequence (empty the slot)
    const newSequence = [...sequence];
    newSequence[index].filledValue = null;
    setSequence(newSequence);

    // Add back to options
    setOptions(prev => [...prev, {
        id: `opt-${valueToReturn}`,
        value: valueToReturn
    }].sort(() => Math.random() - 0.5));
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'math-numberline', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full grid grid-cols-2 sm:flex sm:items-center sm:justify-between mb-8 gap-4">
        <Link to="/grade1/math" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors justify-self-start sm:order-1">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Zpět
        </Link>
        
        <div className="flex gap-4 items-center justify-self-end sm:order-3">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
            <Star fill="currentColor" /> {score}
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition-colors"
            title="Nápověda"
          >
            <Lightbulb className="w-6 h-6" />
          </button>
          <button 
            onClick={generateGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Nová hra"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-teal-600 text-center sm:order-2">Číselná osa</h1>
      </div>

      {/* The Number Line */}
      <div className="w-full mb-12 bg-teal-50 rounded-3xl shadow-inner p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 max-w-[320px] md:max-w-full mx-auto">
          {sequence.map((item, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center">
            
            {/* Number Circle or Drop Zone */}
            {!item.isMissing ? (
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center text-xl md:text-3xl font-bold text-gray-700 shadow-md select-none">
                {item.value}
              </div>
            ) : (
              <div 
                onClick={() => handleSlotClick(index)}
                className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-dashed flex items-center justify-center text-xl md:text-3xl font-bold transition-all cursor-pointer select-none
                  ${item.filledValue === null 
                    ? (selectedOption ? 'bg-yellow-50 border-yellow-400 animate-pulse scale-105' : 'bg-white/50 border-teal-300 text-transparent hover:bg-teal-100')
                    : item.filledValue === item.value
                        ? 'bg-green-100 border-green-500 text-green-700 scale-110' 
                        : 'bg-red-100 border-red-500 text-red-700 hover:bg-red-200'
                  }
                `}
              >
                {item.filledValue}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
        {isComplete ? (
          <div className="text-center animate-bounce">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Skvěle! Osa je kompletní! 🎉</h2>
            <button 
              onClick={generateGame}
              className="px-8 py-3 bg-teal-500 text-white text-xl rounded-full hover:bg-teal-600 transition-colors shadow-lg font-bold"
            >
              Další řada
            </button>
          </div>
        ) : (
          options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg transition-all transform
                ${selectedOption && selectedOption.id === opt.id 
                    ? 'bg-yellow-400 text-white scale-110 ring-4 ring-yellow-200 z-20' 
                    : 'bg-orange-400 text-white hover:scale-105 hover:bg-orange-500'
                }
              `}
            >
              {opt.value}
            </button>
          ))
        )}
      </div>

      {message && (
        <div className={`mt-8 text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

      {/* Save Score Section */}
      <div className="mt-12 w-full max-w-md">
        {!scoreSaved ? (
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 flex flex-col items-center gap-3">
            <span className="text-blue-800 font-bold">Uložit výsledek</span>
            <form onSubmit={handleSaveScore} className="flex gap-2 w-full justify-center">
              <input
                type="text"
                placeholder="Tvé jméno"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:border-blue-400 outline-none w-full max-w-[200px]"
                maxLength={15}
              />
              <button 
                type="submit" 
                disabled={isSaving || !playerName.trim() || score === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2"
              >
                <Save size={20} /> Uložit
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100 flex items-center justify-center gap-2 text-green-700 font-bold animate-in fade-in">
            <Trophy size={24} /> Výsledek uložen!
          </div>
        )}
      </div>

      {/* Local Leaderboard */}
      <div className="mt-12 w-full max-w-md">
        <Leaderboard gameId="math-numberline" title="Mistři číselné osy" limit={3} />
      </div>

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
            
            <div className="flex items-center gap-3 mb-4 text-teal-600">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Doplň chybějící čísla na číselnou osu.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Dole vidíš oranžová kolečka s čísly.</li>
                <li><strong>Klikni</strong> na číslo, které chceš použít (označí se žlutě).</li>
                <li>Potom <strong>klikni</strong> na prázdné místo na ose, kam číslo patří.</li>
                <li>Pokud uděláš chybu (číslo zčervená), klikni na něj znovu, aby se vrátilo zpět.</li>
                <li>Čísla jdou po sobě (např. 1, 2, 3, 4...).</li>
              </ul>
              <p>
                Hodně štěstí! 🍀
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
