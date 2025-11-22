import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Star, RefreshCw, Trophy, Save, X, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

const GRID_SIZE = 5;

export function RowsColumnsGame() {
  const [task, setTask] = useState(null); // { type: 'ROW' | 'COL' | 'CELL', targetRow, targetCol }
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const types = ['ROW', 'COL', 'CELL'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const targetRow = Math.floor(Math.random() * GRID_SIZE) + 1;
    const targetCol = Math.floor(Math.random() * GRID_SIZE) + 1;

    setTask({ type, targetRow, targetCol });
    setMessage('');
  };

  const handleSelection = (type, row, col) => {
    if (message.includes('Správně')) return;

    let isCorrect = false;

    if (task.type === 'ROW') {
      isCorrect = type === 'ROW' && row === task.targetRow;
    } else if (task.type === 'COL') {
      isCorrect = type === 'COL' && col === task.targetCol;
    } else if (task.type === 'CELL') {
      isCorrect = type === 'CELL' && row === task.targetRow && col === task.targetCol;
    }

    if (isCorrect) {
      setMessage('Správně! 🎉');
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d8b4fe', '#f3e8ff'] // Purple theme
      });
      setTimeout(startNewRound, 1500);
    } else {
      setMessage('Zkus to znovu');
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'logic-rows-columns', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  if (!task) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      <div className="flex justify-between w-full mb-8">
        <Link to="/grade1/logic" className="text-purple-500 hover:text-purple-700 flex items-center gap-2">
          <ArrowLeft /> Zpět
        </Link>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowHelp(true)} 
                className="p-2 rounded-full transition-colors text-yellow-500 hover:bg-yellow-50"
                title="Nápověda"
            >
                <Lightbulb size={28} />
            </button>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                <Star fill="currentColor" /> {score}
            </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-purple-800 mb-4 text-center flex flex-col gap-2">
        <span className="text-gray-500 text-lg uppercase tracking-wider">Úkol:</span>
        {task.type === 'ROW' && (
          <span className="flex items-center gap-2 justify-center">
            Vyber <span className="text-5xl text-purple-600 mx-2">{task.targetRow}.</span> řádek <span className="text-4xl">➡️</span>
          </span>
        )}
        {task.type === 'COL' && (
          <span className="flex items-center gap-2 justify-center">
            Vyber <span className="text-5xl text-purple-600 mx-2">{task.targetCol}.</span> sloupec <span className="text-4xl">⬇️</span>
          </span>
        )}
        {task.type === 'CELL' && (
          <span className="flex flex-col items-center gap-1">
            <span>Najdi políčko:</span>
            <span className="bg-purple-100 px-4 py-2 rounded-xl border-2 border-purple-200">
              <span className="font-bold text-purple-700">{task.targetRow}.</span> řádek 
              <span className="mx-2 text-gray-400">+</span> 
              <span className="font-bold text-purple-700">{task.targetCol}.</span> sloupec
            </span>
          </span>
        )}
      </h2>

      <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-purple-100 inline-block">
        <div className="grid grid-cols-[auto_repeat(5,minmax(60px,1fr))] gap-2">
          {/* Top Left Corner (Empty) */}
          <div className="w-10 h-10 md:w-14 md:h-14"></div>

          {/* Column Headers */}
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <button
              key={`col-${i}`}
              onClick={() => handleSelection('COL', null, i + 1)}
              className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold rounded-xl transition-all bg-blue-100 hover:bg-blue-300 text-blue-700 hover:scale-110 border-2 border-blue-200 text-xl md:text-2xl shadow-sm"
            >
              {i + 1}
            </button>
          ))}

          {/* Rows */}
          {Array.from({ length: GRID_SIZE }).map((_, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              {/* Row Header */}
              <button
                onClick={() => handleSelection('ROW', rowIdx + 1, null)}
                className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold rounded-xl transition-all bg-green-100 hover:bg-green-300 text-green-700 hover:scale-110 border-2 border-green-200 text-xl md:text-2xl shadow-sm"
              >
                {rowIdx + 1}
              </button>

              {/* Cells */}
              {Array.from({ length: GRID_SIZE }).map((_, colIdx) => (
                <button
                  key={`cell-${rowIdx}-${colIdx}`}
                  onClick={() => handleSelection('CELL', rowIdx + 1, colIdx + 1)}
                  className={`
                    w-10 h-10 md:w-14 md:h-14 border-2 rounded-xl transition-all duration-200
                    hover:scale-105 hover:shadow-md
                    ${(rowIdx + 1) % 2 === (colIdx + 1) % 2 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}
                    hover:border-purple-400 hover:bg-purple-50
                  `}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {message && (
        <div className={`mt-8 text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

      {/* Save Score Section */}
      <div className="mt-12 w-full max-w-md mx-auto">
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
      <div className="mt-12 w-full max-w-md mx-auto">
        <Leaderboard gameId="logic-rows-columns" title="Mistři mřížky" limit={3} />
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
            
            <div className="flex items-center gap-3 mb-4 text-purple-800">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Nauč se orientovat v mřížce!
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Řádek:</strong> Jde zleva doprava (vodorovně). Klikni na číslo vlevo.</li>
                <li><strong>Sloupec:</strong> Jde shora dolů (svisle). Klikni na číslo nahoře.</li>
                <li><strong>Políčko:</strong> Místo, kde se protíná řádek a sloupec.</li>
              </ul>
              <p>
                Sleduj zadání nahoře a klikni na správné místo.
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
