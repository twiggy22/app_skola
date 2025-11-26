import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown, Save, Trophy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function SubtractionGame({ maxNumber = 20 }) {
  const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const generateGame = () => {
    setIsSolved(false);
    setUserAnswer('');
    // Generate numbers so result is >= 0 (no negative numbers)
    const a = Math.floor(Math.random() * (maxNumber + 1));
    const b = Math.floor(Math.random() * (a + 1)); // 0 to a
    const result = a - b;
    
    setProblem({ a, b, result });
    setMessage('');
  };

  useEffect(() => {
    generateGame();
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, [maxNumber]);

  const handleCheck = (e) => {
    e?.preventDefault();
    if (!userAnswer) return;
    
    const guess = parseInt(userAnswer, 10);
    if (guess === problem.result) {
      setIsSolved(true);
      setMessage('Správně! 🎉');
      setScore(score + 1);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setMessage('Zkus to znovu');
      // Keep answer visible but mark as error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    localStorage.setItem('playerName', playerName);
    setIsSaving(true);
    const success = await saveScore(playerName, 'math-subtraction', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
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
            onClick={generateGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Nová hra"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-red-800 text-center sm:order-2">
          Odčítání do {maxNumber}
        </h1>
      </div>

      <div className="flex items-center gap-4 text-6xl font-bold text-gray-800 mb-8 bg-white p-8 rounded-2xl shadow-sm border-2 border-red-100">
        <span className="text-blue-600">{problem.a}</span>
        <span>-</span>
        <span className="text-red-600">{problem.b}</span>
        <span>=</span>
        {isSolved ? (
          <span className="w-24 h-24 bg-green-100 rounded-xl border-2 border-green-400 flex items-center justify-center text-green-600 animate-bounce">
            {problem.result}
          </span>
        ) : (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              if (message) setMessage('');
            }}
            onKeyDown={handleKeyDown}
            className={`w-24 h-24 bg-white rounded-xl border-2 text-center text-gray-800 outline-none focus:ring-4 transition-all
              ${message.includes('Zkus') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                : 'border-red-200 focus:border-red-500 focus:ring-red-100'
              }`}
            placeholder="?"
            autoFocus
          />
        )}
      </div>

      <div className="mb-8">
        {isSolved ? (
          <button 
            onClick={generateGame}
            className="px-8 py-3 bg-blue-500 text-white text-xl rounded-full hover:bg-blue-600 transition-colors shadow-lg font-bold flex items-center gap-2 animate-bounce"
          >
            Další příklad <ArrowLeft className="rotate-180" />
          </button>
        ) : (
          <button
            onClick={handleCheck}
            className="px-8 py-3 bg-green-500 text-white text-xl rounded-full hover:bg-green-600 transition-colors shadow-lg font-bold flex items-center gap-2"
          >
            <Check /> Zkontrolovat
          </button>
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
        <Leaderboard gameId="math-subtraction" title="Mistři odčítání" limit={3} />
      </div>
    </div>
  );
}