import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowLeft, Frown, Save, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function CountingGame() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

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
      setMessage('Zkus to znovu');
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'math-counting', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full grid grid-cols-2 sm:flex sm:items-center sm:justify-between mb-8 gap-4 max-w-4xl">
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

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-blue-800 text-center sm:order-2">
          Počítání
        </h1>
      </div>

      <h2 className="text-xl font-bold text-blue-600 mb-8">Kolik je tu jablíček?</h2>

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
        <div className={`mt-8 text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

      {/* Save Score Section - Bottom */}
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
        <Leaderboard gameId="math-counting" title="Mistři počítání" limit={3} />
      </div>
    </div>
  );
}