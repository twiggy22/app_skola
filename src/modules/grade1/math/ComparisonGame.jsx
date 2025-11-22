import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown, Save, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function ComparisonGame({ maxNumber = 20 }) {
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [correctOperator, setCorrectOperator] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

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

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'math-comparison', score);
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

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-purple-800 text-center sm:order-2">
          Porovnávání čísel
        </h1>
      </div>

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
        <Leaderboard gameId="math-comparison" title="Mistři porovnávání" limit={3} />
      </div>
    </div>
  );
}