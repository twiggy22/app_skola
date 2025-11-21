import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, Lightbulb, X, Frown, Save, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

const SENTENCES = [
  { part1: 'Máma vaří', part2: '.', correct: 'MASO', wrong: ['KOLO', 'AUTO'] },
  { part1: 'Ema má', part2: '.', correct: 'MÍSU', wrong: ['LES', 'PES'] },
  { part1: 'Táta řídí', part2: '.', correct: 'AUTO', wrong: ['MASO', 'DŮM'] },
  { part1: 'V lese je', part2: '.', correct: 'SELE', wrong: ['KOLO', 'MÍSA'] },
  { part1: 'Ola solí', part2: '.', correct: 'MASO', wrong: ['AUTO', 'LES'] },
  { part1: 'To je moje', part2: '.', correct: 'KOLO', wrong: ['SELE', 'OKNO'] },
  { part1: 'Pes má', part2: '.', correct: 'UCHO', wrong: ['AUTO', 'KOLO'] },
  { part1: 'Máme doma', part2: '.', correct: 'SŮL', wrong: ['LES', 'SELE'] },
];

export function SentenceGame() {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [filledWord, setFilledWord] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setCurrentSentence(randomSentence);
    setFilledWord(null);

    // Combine correct answer with wrong answers and shuffle
    const allOptions = [randomSentence.correct, ...randomSentence.wrong].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setMessage('');
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'czech-sentences', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleOptionClick = (selectedWord) => {
    if (message.includes('Správně')) return;

    const isCorrect = selectedWord === currentSentence.correct;

    if (isCorrect) {
      setFilledWord(selectedWord);
      setMessage('Správně! 🎉');
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#fdba74'] // Orange theme
      });
      setTimeout(startNewRound, 2000); // Longer delay to read the completed sentence
    } else {
      setMessage('Zkus to znovu');
    }
  };

  if (!currentSentence) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <div className="flex justify-between w-full mb-8">
        <Link to="/grade1/czech" className="text-orange-500 hover:text-orange-700 flex items-center gap-2">
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

      <h2 className="text-3xl font-bold text-orange-800 mb-12">
        Doplň větu
      </h2>

      {/* Sentence Display */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-5xl font-bold text-gray-800 mb-16 bg-white p-8 rounded-3xl shadow-sm border-2 border-orange-100 w-full min-h-[160px]">
        <span>{currentSentence.part1}</span>
        
        <span className={`
          inline-flex items-center justify-center px-4 py-2 rounded-xl border-b-4 min-w-[120px] transition-all
          ${filledWord 
            ? 'bg-green-100 border-green-400 text-green-700' 
            : 'bg-gray-100 border-gray-300 text-transparent border-dashed'}
        `}>
          {filledWord || '_____'}
        </span>
        
        <span>{currentSentence.part2}</span>
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 w-full">
        {options.map((word, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(word)}
            className="px-8 py-4 rounded-2xl bg-white border-b-4 border-orange-200 hover:border-orange-400 text-3xl font-bold text-orange-600 hover:-translate-y-1 transition-all shadow-lg active:border-b-0 active:translate-y-1"
          >
            {word}
          </button>
        ))}
      </div>

      {message && (
        <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

      {/* Save Score Section */}
      <div className="max-w-md mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-100 w-full">
        <div className="flex items-center gap-3 mb-4 text-orange-800">
          <Trophy className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold">Uložit skóre</h3>
        </div>
        
        {scoreSaved ? (
          <div className="text-center py-4 text-green-600 font-bold text-lg animate-in fade-in">
            Skóre uloženo! 🎉
          </div>
        ) : (
          <form onSubmit={handleSaveScore} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">
                Tvé jméno
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Zadej jméno..."
                className="w-full px-4 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                maxLength={20}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSaving || !playerName.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Uložit výsledek
            </button>
          </form>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-md mx-auto mt-8 w-full">
        <Leaderboard gameId="czech-sentences" />
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
            
            <div className="flex items-center gap-3 mb-4 text-orange-800">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Doplň slovo do věty tak, aby to dávalo smysl.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Přečti si větu (např. "Máma vaří _____").</li>
                <li>Podívej se na slova dole.</li>
                <li>Vyber to správné (např. "MASO").</li>
                <li>Pozor, slovo "KOLO" by tam nedávalo smysl!</li>
              </ul>
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
