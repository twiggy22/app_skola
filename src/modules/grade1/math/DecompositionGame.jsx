import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Check, Lightbulb, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DecompositionGame({ maxNumber = 20 }) {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [targetNumber, setTargetNumber] = useState(0);
  const [floors, setFloors] = useState([]);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({}); // 'correct' | 'incorrect' | null
  const [isComplete, setIsComplete] = useState(false);

  const generateGame = () => {
    // Target number should be at least 2
    const newTarget = Math.floor(Math.random() * (maxNumber - 1)) + 2;
    setTargetNumber(newTarget);
    
    const numFloors = 3;
    const newFloors = [];
    
    for (let i = 0; i < numFloors; i++) {
      const knownPart = Math.floor(Math.random() * (newTarget + 1));
      const missingPart = newTarget - knownPart;
      // Randomly decide if left or right is missing (0 = left missing, 1 = right missing)
      const missingSide = Math.random() > 0.5 ? 'right' : 'left';
      
      newFloors.push({
        id: i,
        left: missingSide === 'left' ? null : knownPart,
        right: missingSide === 'right' ? null : knownPart,
        answer: missingPart,
        missingSide: missingSide
      });
    }
    
    setFloors(newFloors);
    setInputs({});
    setResults({});
    setIsComplete(false);
  };

  useEffect(() => {
    generateGame();
  }, [maxNumber]);

  const handleInputChange = (floorId, value) => {
    setInputs(prev => ({
      ...prev,
      [floorId]: value
    }));
    // Reset result for this floor when typing
    setResults(prev => ({
      ...prev,
      [floorId]: null
    }));
  };

  const checkAnswers = () => {
    const newResults = {};
    let allCorrect = true;
    let hasEmpty = false;

    floors.forEach(floor => {
      const val = inputs[floor.id];
      if (!val) {
        hasEmpty = true;
        return;
      }
      
      const numVal = parseInt(val, 10);
      if (numVal === floor.answer) {
        newResults[floor.id] = 'correct';
      } else {
        newResults[floor.id] = 'incorrect';
        allCorrect = false;
      }
    });

    setResults(newResults);

    if (allCorrect && !hasEmpty) {
      setIsComplete(true);
      setScore(prev => prev + 1);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-8">
        <Link to="/grade1/math" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Zpět
        </Link>
        <h1 className="text-3xl font-bold text-orange-600">Rozklad čísel (Domečky)</h1>
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

      {/* House Container */}
      <div className="relative w-full max-w-md">
        {/* Roof */}
        <div className="w-full aspect-[2/1] bg-orange-500 clip-path-triangle flex items-end justify-center pb-4 relative" 
             style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold text-orange-600 shadow-inner mb-2">
            {targetNumber}
          </div>
        </div>

        {/* Body */}
        <div className="bg-orange-100 border-x-4 border-b-4 border-orange-500 p-6 space-y-4 shadow-xl">
          {floors.map((floor) => (
            <div key={floor.id} className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl shadow-sm">
              {/* Left Side */}
              <div className="flex-1 flex justify-center">
                {floor.missingSide === 'left' ? (
                  <input
                    type="number"
                    value={inputs[floor.id] || ''}
                    onChange={(e) => handleInputChange(floor.id, e.target.value)}
                    className={`w-20 h-16 text-center text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-4 transition-all
                      ${results[floor.id] === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 
                        results[floor.id] === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-orange-400 focus:ring-orange-200'}
                    `}
                    placeholder="?"
                  />
                ) : (
                  <div className="w-20 h-16 flex items-center justify-center text-3xl font-bold text-gray-700 bg-gray-100 rounded-lg border-2 border-gray-200">
                    {floor.left}
                  </div>
                )}
              </div>

              <div className="text-gray-400 font-bold text-xl">+</div>

              {/* Right Side */}
              <div className="flex-1 flex justify-center">
                {floor.missingSide === 'right' ? (
                  <input
                    type="number"
                    value={inputs[floor.id] || ''}
                    onChange={(e) => handleInputChange(floor.id, e.target.value)}
                    className={`w-20 h-16 text-center text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-4 transition-all
                      ${results[floor.id] === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 
                        results[floor.id] === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-orange-400 focus:ring-orange-200'}
                    `}
                    placeholder="?"
                  />
                ) : (
                  <div className="w-20 h-16 flex items-center justify-center text-3xl font-bold text-gray-700 bg-gray-100 rounded-lg border-2 border-gray-200">
                    {floor.right}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8">
        {isComplete ? (
          <div className="text-center animate-bounce">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Skvělá práce! Domeček je hotový! 🏠</h2>
            <button 
              onClick={generateGame}
              className="px-8 py-3 bg-orange-500 text-white text-xl rounded-full hover:bg-orange-600 transition-colors shadow-lg font-bold"
            >
              Další domeček
            </button>
          </div>
        ) : (
          <button 
            onClick={checkAnswers}
            className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white text-xl rounded-full hover:bg-green-600 transition-colors shadow-lg font-bold"
          >
            <Check className="w-6 h-6" />
            Zkontrolovat
          </button>
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
            
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Cílem je doplnit chybějící čísla v domečku.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Ve střeše je <strong>hlavní číslo</strong> (např. 10).</li>
                <li>V každém patře musí součet dvou čísel dát dohromady hlavní číslo.</li>
                <li>Příklad: Pokud je ve střeše <strong>10</strong> a vlevo <strong>3</strong>, musíte vpravo napsat <strong>7</strong> (protože 3 + 7 = 10).</li>
              </ul>
              <p>
                Až vyplníte všechna patra, klikněte na tlačítko <strong>Zkontrolovat</strong>.
              </p>
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
