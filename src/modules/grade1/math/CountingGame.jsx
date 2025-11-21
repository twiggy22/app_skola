import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CountingGame() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const generateGame = () => {
    const num = Math.floor(Math.random() * 10) + 1; // 1 to 10
    setTargetNumber(num);
    
    // Generate options
    const newOptions = [num];
    while (newOptions.length < 3) {
      const random = Math.floor(Math.random() * 10) + 1;
      if (!newOptions.includes(random)) {
        newOptions.push(random);
      }
    }
    // Shuffle options
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setMessage('');
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleGuess = (guess) => {
    if (guess === targetNumber) {
      setMessage('Správně! 🎉');
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(generateGame, 1500);
    } else {
      setMessage('Zkus to znovu.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full max-w-md mb-8">
        <Link to="/grade1/math" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft /> Zpět
        </Link>
        <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
          <Star fill="currentColor" /> {score}
        </div>
        <button onClick={generateGame} className="text-blue-500 hover:text-blue-700">
          <RefreshCw />
        </button>
      </div>

      <h2 className="text-2xl font-bold text-blue-800 mb-8">Kolik je tu jablíček?</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-12 min-h-[200px] items-center">
        {Array.from({ length: targetNumber }).map((_, i) => (
          <div key={i} className="text-6xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            🍎
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className="w-20 h-20 rounded-full bg-white border-4 border-blue-300 text-3xl font-bold text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all shadow-lg"
          >
            {opt}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mt-8 text-2xl font-bold ${message.includes('Správně') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}