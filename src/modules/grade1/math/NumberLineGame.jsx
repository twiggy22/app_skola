import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NumberLineGame({ maxNumber = 20 }) {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const generateGame = () => {
    setIsComplete(false);
    
    // Determine sequence length (e.g., 5 numbers)
    const length = 5;
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

    // Pick 2 random positions to be missing
    while (missingIndices.length < 2) {
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

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    // For mobile/touch support we might need more complex handling, 
    // but for standard HTML5 DnD:
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const targetSlot = sequence[index];
    
    if (!targetSlot.isMissing) return;

    const droppedValue = draggedItem.value;
    const previousValue = targetSlot.filledValue;

    // Update sequence
    const newSequence = [...sequence];
    newSequence[index].filledValue = droppedValue;
    setSequence(newSequence);

    // Update options
    // 1. Remove the dropped value from options
    let newOptions = options.filter(opt => opt.id !== draggedItem.id);
    
    // 2. If there was a value there before, add it back to options
    if (previousValue !== null) {
        newOptions.push({
            id: `opt-${previousValue}`,
            value: previousValue
        });
    }
    setOptions(newOptions);

    // Check win condition
    const allCorrect = newSequence.every(item => 
        !item.isMissing || item.filledValue === item.value
    );

    if (allCorrect) {
        setIsComplete(true);
        setScore(s => s + 1);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    
    setDraggedItem(null);
  };

  const handleSlotClick = (index) => {
    const slot = sequence[index];
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

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-12">
        <Link to="/grade1/math" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Zpět
        </Link>
        <h1 className="text-3xl font-bold text-teal-600">Číselná osa</h1>
        <div className="flex gap-4 items-center">
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
      </div>

      {/* The Number Line */}
      <div className="relative w-full flex items-center justify-between gap-2 mb-20 px-4 py-12 bg-teal-50 rounded-3xl shadow-inner">
        {/* Line background */}
        <div className="absolute left-4 right-4 top-1/2 h-2 bg-teal-200 -z-0 rounded-full"></div>

        {sequence.map((item, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            {/* Tick mark */}
            <div className="w-1 h-4 bg-teal-400 mb-2"></div>
            
            {/* Number Circle or Drop Zone */}
            {!item.isMissing ? (
              <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center text-2xl font-bold text-gray-700 shadow-md">
                {item.value}
              </div>
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => handleSlotClick(index)}
                className={`w-16 h-16 rounded-full border-4 border-dashed flex items-center justify-center text-2xl font-bold transition-all cursor-pointer
                  ${item.filledValue === null 
                    ? 'bg-white/50 border-teal-300 text-transparent hover:bg-teal-100' 
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

      {/* Draggable Options */}
      <div className="flex gap-6 min-h-[100px]">
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
            <div
              key={opt.id}
              draggable
              onDragStart={(e) => handleDragStart(e, opt)}
              className="w-16 h-16 rounded-full bg-orange-400 text-white flex items-center justify-center text-2xl font-bold shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
              {opt.value}
            </div>
          ))
        )}
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
                <li>Chyť číslo myší (nebo prstem) a <strong>přetáhni ho</strong> na správné prázdné místo na ose.</li>
                <li>Pokud uděláš chybu (číslo zčervená), můžeš na něj <strong>kliknout</strong> a vrátit ho zpět, nebo ho přepsat jiným číslem.</li>
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
