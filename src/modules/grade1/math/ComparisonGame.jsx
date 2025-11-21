import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ComparisonGame({ maxNumber = 20 }) {
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [correctOperator, setCorrectOperator] = useState('');

  const generateGame = () => {
    setIsSolved(false);
    setCorrectOperator('');
    const a = Math.floor(Math.random() * (maxNumber + 1));
    const b = Math.floor(Math.random() * (maxNumber + 1));
    setProblem({ a, b });
    setMessage('');
  };

  useEffect(() => {
    generateGame();
  }, [maxNumber]);

  const handleGuess = (operator) => {
    let isCorrect = false;
    if (operator === '<' && problem.a < problem.b) isCorrect = true;
    if (operator === '>' && problem.a > problem.b) isCorrect = true;
    if (operator === '=' && problem.a === problem.b) isCorrect = true;

    if (isCorrect) {
      setIsSolved(true);
      setCorrectOperator(operator);
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

      <h2 className="text-3xl font-bold text-purple-800 mb-12">Porovnávání čísel (do {maxNumber})</h2>

      <div className="flex items-center justify-center gap-8 mb-16">
        <div className="text-7xl font-bold text-blue-600 bg-white w-32 h-32 flex items-center justify-center rounded-2xl shadow-md border-2 border-blue-100">
          {problem.a}
        </div>
        
        {isSolved ? (
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl font-bold text-green-600 border-2 border-green-400 animate-bounce">
            {correctOperator}
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 border-2 border-dashed border-gray-300">
            ?
          </div>
        )}

        <div className="text-7xl font-bold text-purple-600 bg-white w-32 h-32 flex items-center justify-center rounded-2xl shadow-md border-2 border-purple-100">
          {problem.b}
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => handleGuess('<')}
          className="w-24 h-24 rounded-2xl bg-white border-b-4 border-purple-200 hover:border-purple-400 text-5xl font-bold text-purple-600 hover:-translate-y-1 transition-all shadow-lg active:border-b-0 active:translate-y-1"
        >
          &lt;
        </button>
        <button
          onClick={() => handleGuess('=')}
          className="w-24 h-24 rounded-2xl bg-white border-b-4 border-purple-200 hover:border-purple-400 text-5xl font-bold text-purple-600 hover:-translate-y-1 transition-all shadow-lg active:border-b-0 active:translate-y-1"
        >
          =
        </button>
        <button
          onClick={() => handleGuess('>')}
          className="w-24 h-24 rounded-2xl bg-white border-b-4 border-purple-200 hover:border-purple-400 text-5xl font-bold text-purple-600 hover:-translate-y-1 transition-all shadow-lg active:border-b-0 active:translate-y-1"
        >
          &gt;
        </button>
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