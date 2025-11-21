import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdditionGame({ maxNumber = 20 }) {
  const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  const generateGame = () => {
    setIsSolved(false);
    // Generate numbers so sum is <= maxNumber
    const a = Math.floor(Math.random() * (maxNumber + 1)); 
    const b = Math.floor(Math.random() * (maxNumber - a + 1));
    const result = a + b;
    
    setProblem({ a, b, result });
    
    // Generate options
    const newOptions = [result];
    while (newOptions.length < 3) {
      const random = Math.floor(Math.random() * (maxNumber + 1));
      if (!newOptions.includes(random)) {
        newOptions.push(random);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setMessage('');
  };

  useEffect(() => {
    generateGame();
  }, [maxNumber]); // Re-generate if maxNumber changes

  const handleGuess = (guess) => {
    if (guess === problem.result) {
      setIsSolved(true);
      setMessage('Správně! 🎉');
      setScore(score + 1);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(generateGame, 1500);
    } else {
      setMessage('Zkus to znovu');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <div className="flex justify-between w-full mb-8">
        <Link to="/grade1/math" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft /> Zpět
        </Link>
        <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
          <Star fill="currentColor" /> {score}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-blue-800 mb-12">Sčítání do {maxNumber}</h2>

      <div className="flex items-center gap-4 text-6xl font-bold text-gray-800 mb-16 bg-white p-8 rounded-2xl shadow-sm border-2 border-blue-100">
        <span className="text-blue-600">{problem.a}</span>
        <span>+</span>
        <span className="text-purple-600">{problem.b}</span>
        <span>=</span>
        {isSolved ? (
          <span className="w-24 h-24 bg-green-100 rounded-xl border-2 border-green-400 flex items-center justify-center text-green-600 animate-bounce">
            {problem.result}
          </span>
        ) : (
          <span className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">?</span>
        )}
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleGuess(opt)}
            className="w-24 h-24 rounded-2xl bg-white border-b-4 border-blue-200 hover:border-blue-400 text-4xl font-bold text-blue-600 hover:-translate-y-1 transition-all shadow-lg active:border-b-0 active:translate-y-1"
          >
            {opt}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mt-8 text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}
    </div>
  );
}