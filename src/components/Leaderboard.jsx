import React, { useEffect, useState } from 'react';
import { getTopScores } from '../services/scoreService';
import { Trophy, Medal, Crown } from 'lucide-react';

export function Leaderboard({ gameId, title = "Síň slávy", limit = 5, className = "" }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      const data = await getTopScores(gameId, limit);
      setScores(data);
      setLoading(false);
    };
    
    // Load immediately
    loadScores();

    // Optional: Refresh every 30 seconds to keep it live
    const interval = setInterval(loadScores, 30000);
    return () => clearInterval(interval);
  }, [gameId, limit]);

  if (loading) return <div className="text-center text-gray-400 py-4">Načítám žebříček...</div>;

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-xl border-4 border-yellow-100 w-full max-w-md ${className}`}>
      <h3 className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
        <Trophy className="w-8 h-8 animate-bounce" /> {title}
      </h3>
      
      {scores.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-2">Zatím žádné výsledky.</p>
          <p className="text-xs text-gray-400">
            (Pokud se výsledky nezobrazují, je nutné vytvořit Index ve Firebase konzoli - viz chyba v F12)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div 
              key={score.id} 
              className={`flex items-center justify-between p-3 rounded-xl transition-transform hover:scale-105 ${
                index === 0 ? 'bg-yellow-100 border-2 border-yellow-300 shadow-md' : 
                index === 1 ? 'bg-gray-100 border-2 border-gray-300' : 
                index === 2 ? 'bg-orange-100 border-2 border-orange-300' : 'bg-white border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`font-black text-xl w-8 h-8 flex items-center justify-center rounded-full ${
                  index === 0 ? 'bg-yellow-400 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' : 
                  index === 2 ? 'bg-orange-400 text-white' : 'text-gray-400 bg-gray-100'
                }`}>
                  {index === 0 ? <Crown size={18} /> : index + 1}
                </div>
                <span className="font-bold text-gray-700 text-lg">{score.playerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-black text-2xl text-blue-600">{score.score}</span>
                <span className="text-xs text-gray-400 font-bold uppercase">bodů</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
