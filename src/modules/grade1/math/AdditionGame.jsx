import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown, Save, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function AdditionGame({ maxNumber = 20 }) {
  const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

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

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'math-addition', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
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
        <Leaderboard gameId="math-addition" title="Mistři sčítání" limit={3} />
      </div>
    </div>
  );
}