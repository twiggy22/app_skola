import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, Lightbulb, X, Frown, Save, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';
import { GameConfig, isContentAllowed } from '../../../config';

const WORDS = [
  { text: 'PES', emoji: '🐶' },
  { text: 'KOČKA', emoji: '🐱' },
  { text: 'AUTO', emoji: '🚗' },
  { text: 'DŮM', emoji: '🏠' },
  { text: 'STROM', emoji: '🌳' },
  { text: 'MÍČ', emoji: '⚽' },
  { text: 'OKO', emoji: '👁️' },
  { text: 'UCHO', emoji: '👂' },
  { text: 'RUKA', emoji: '✋' },
  { text: 'NOHA', emoji: '🦶' },
  { text: 'PUSA', emoji: '👄' },
  { text: 'NOS', emoji: '👃' },
  { text: 'KVĚT', emoji: '🌸' },
  { text: 'LES', emoji: '🌲' },
  { text: 'SÝR', emoji: '🧀' },
  { text: 'MED', emoji: '🍯' },
  { text: 'LED', emoji: '🧊' },
  { text: 'LOĎ', emoji: '🚢' },
  { text: 'VLAK', emoji: '🚂' },
  { text: 'KOLO', emoji: '🚲' },
  { text: 'RYBA', emoji: '🐟' },
  { text: 'HADA', emoji: '🐍' },
  { text: 'MYŠ', emoji: '🐭' },
  { text: 'SŮL', emoji: '🧂' },
  { text: 'POLE', emoji: '🌾' },
  { text: 'LOUKA', emoji: '🌿' },
  { text: 'MRAK', emoji: '☁️' },
  { text: 'SLUNCE', emoji: '☀️' },
  { text: 'OKNO', emoji: '🪟' },
  { text: 'DVEŘE', emoji: '🚪' },
  { text: 'STŮL', emoji: '🪑' },
  { text: 'ŽIDLE', emoji: '🪑' },
  { text: 'MEDVĚD', emoji: '🐻' },
  { text: 'ZAJÍC', emoji: '🐇' },
  { text: 'JEŽEK', emoji: '🦔' },
  { text: 'BÁBA', emoji: '👵' },
  { text: 'DĚDA', emoji: '👴' },
  { text: 'ŠKOLA', emoji: '🏫' },
  { text: 'TUŽKA', emoji: '✏️' },
  { text: 'SEŠIT', emoji: '📓' },
  { text: 'KNIHA', emoji: '📖' },
  { text: 'JABLKO', emoji: '🍎' },
  { text: 'HRUŠKA', emoji: '🍐' },
  { text: 'BANÁN', emoji: '🍌' },
  { text: 'DORT', emoji: '🎂' },
  { text: 'MLÉKO', emoji: '🥛' },
  { text: 'ROHLÍK', emoji: '🥐' },
  { text: 'MALINA', emoji: '🍓' },
  { text: 'MOLO', emoji: '⚓' },
  { text: 'MOL', emoji: '🦋' },
  { text: 'MASO', emoji: '🥩' },
  { text: 'EMA', emoji: '👧' },
  { text: 'ELA', emoji: '👧' },
  { text: 'PEPA', emoji: '👦' },
  { text: 'MÍSA', emoji: '🥣' },
  { text: 'ESO', emoji: '🂡' },
  { text: 'MELOUN', emoji: '🍉' },
  { text: 'OSEL', emoji: '🫏' },
];

const getAllowedWords = () => {
  const allowed = WORDS.filter(w => isContentAllowed(w.text));
  return allowed.length > 0 ? allowed : WORDS;
};

export function WordsGame() {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameMode, setGameMode] = useState('word-to-image'); // 'word-to-image' | 'image-to-word'
  const [showHelp, setShowHelp] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    startNewRound();
  }, [gameMode]);

  const startNewRound = () => {
    const currentWords = getAllowedWords();
    const randomWord = currentWords[Math.floor(Math.random() * currentWords.length)];
    setCurrentWord(randomWord);

    // Generate 3 wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomOption = currentWords[Math.floor(Math.random() * currentWords.length)];
      // Ensure unique options and not the correct answer
      if (randomOption.text !== randomWord.text && !wrongOptions.some(o => o.text === randomOption.text)) {
        wrongOptions.push(randomOption);
      }
    }

    // Combine and shuffle
    const allOptions = [...wrongOptions, randomWord].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setMessage('');
  };

  const handleOptionClick = (selectedOption) => {
    if (message.includes('Správně')) return;

    const isCorrect = selectedOption.text === currentWord.text;

    if (isCorrect) {
      setMessage('Správně! 🎉');
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#fdba74'] // Orange theme
      });
      setTimeout(startNewRound, 1500);
    } else {
      setMessage('Zkus to znovu');
    }
  };

  const toggleMode = () => {
    setGameMode(prev => prev === 'word-to-image' ? 'image-to-word' : 'word-to-image');
    setScore(0);
    startNewRound();
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'czech-words', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  if (!currentWord) return null;

  // In word-to-image mode: Show Text, Options are Images
  // In image-to-word mode: Show Image, Options are Texts
  const targetDisplay = gameMode === 'word-to-image' ? currentWord.text : currentWord.emoji;

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

      <h2 className="text-3xl font-bold text-orange-800 mb-8">
        {gameMode === 'word-to-image' ? 'Najdi obrázek ke slovu' : 'Najdi slovo k obrázku'}
      </h2>

      <div className="flex items-center justify-center w-64 h-40 bg-white rounded-3xl shadow-sm border-2 border-orange-100 mb-12 px-4">
        <span className={`${gameMode === 'word-to-image' ? 'text-5xl' : 'text-8xl'} font-bold text-orange-600`}>
          {targetDisplay}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full">
        {options.map((option, index) => {
          const displayContent = gameMode === 'word-to-image' ? option.emoji : option.text;
          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`
                h-24 rounded-2xl bg-white border-b-4 border-orange-200 hover:border-orange-400 
                ${gameMode === 'word-to-image' ? 'text-5xl' : 'text-xl'} 
                font-bold text-orange-600 hover:-translate-y-1 transition-all shadow-lg 
                active:border-b-0 active:translate-y-1 flex items-center justify-center p-2
              `}
            >
              {displayContent}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-semibold text-sm"
        >
          <RefreshCw size={16} />
          {gameMode === 'word-to-image' ? 'Přepnout na: Obrázek → Slovo' : 'Přepnout na: Slovo → Obrázek'}
        </button>
      </div>

      {message && (
        <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
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
        <Leaderboard gameId="czech-words" title="Mistři slovíček" limit={3} />
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
                Trénuj čtení slov!
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Přečti si slovo v rámečku (např. <strong>PES</strong>).</li>
                <li>Najdi správný obrázek (🐶).</li>
                <li>Nebo naopak: podívej se na obrázek a najdi správné slovo.</li>
              </ul>
              <p>
                Slova jsou krátká a jednoduchá. Zvládneš to!
              </p>
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
