import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, Lightbulb, X, Frown, Save, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';
import { GameConfig, isContentAllowed } from '../../../config';

const ALPHABET_PAIRS = [
  { upper: 'A', lower: 'a' },
  { upper: 'B', lower: 'b' },
  { upper: 'C', lower: 'c' },
  { upper: 'D', lower: 'd' },
  { upper: 'E', lower: 'e' },
  { upper: 'F', lower: 'f' },
  { upper: 'G', lower: 'g' },
  { upper: 'H', lower: 'h' },
  { upper: 'I', lower: 'i' },
  { upper: 'J', lower: 'j' },
  { upper: 'K', lower: 'k' },
  { upper: 'L', lower: 'l' },
  { upper: 'M', lower: 'm' },
  { upper: 'N', lower: 'n' },
  { upper: 'O', lower: 'o' },
  { upper: 'P', lower: 'p' },
  { upper: 'Q', lower: 'q' },
  { upper: 'R', lower: 'r' },
  { upper: 'S', lower: 's' },
  { upper: 'T', lower: 't' },
  { upper: 'U', lower: 'u' },
  { upper: 'V', lower: 'v' },
  { upper: 'W', lower: 'w' },
  { upper: 'X', lower: 'x' },
  { upper: 'Y', lower: 'y' },
  { upper: 'Z', lower: 'z' },
  // Czech special characters
  { upper: 'Á', lower: 'á' },
  { upper: 'Č', lower: 'č' },
  { upper: 'Ď', lower: 'ď' },
  { upper: 'É', lower: 'é' },
  { upper: 'Ě', lower: 'ě' },
  { upper: 'Í', lower: 'í' },
  { upper: 'Ň', lower: 'ň' },
  { upper: 'Ó', lower: 'ó' },
  { upper: 'Ř', lower: 'ř' },
  { upper: 'Š', lower: 'š' },
  { upper: 'Ť', lower: 'ť' },
  { upper: 'Ú', lower: 'ú' },
  { upper: 'Ů', lower: 'ů' },
  { upper: 'Ý', lower: 'ý' },
  { upper: 'Ž', lower: 'ž' },
];

// Filter pairs based on config
const getAllowedPairs = () => {
  return ALPHABET_PAIRS.filter(pair => isContentAllowed(pair.upper));
};

export function LettersGame() {
  const [currentPair, setCurrentPair] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameMode, setGameMode] = useState('upper-to-lower'); // 'upper-to-lower' | 'lower-to-upper' | 'block-to-cursive' | 'cursive-to-block'
  const [roundCase, setRoundCase] = useState('upper'); // 'upper' | 'lower'
  const [showHelp, setShowHelp] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    startNewRound();
  }, [gameMode]);

  const startNewRound = () => {
    const allowedPairs = getAllowedPairs();
    const sourcePairs = allowedPairs.length > 0 ? allowedPairs : ALPHABET_PAIRS;

    const randomPair = sourcePairs[Math.floor(Math.random() * sourcePairs.length)];
    setCurrentPair(randomPair);
    setRoundCase(Math.random() > 0.5 ? 'upper' : 'lower');

    // Generate 3 wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomOption = sourcePairs[Math.floor(Math.random() * sourcePairs.length)];
      // Ensure unique options and not the correct answer
      if (randomOption.upper !== randomPair.upper && !wrongOptions.some(o => o.upper === randomOption.upper)) {
        wrongOptions.push(randomOption);
      }
    }

    // Combine and shuffle
    const allOptions = [...wrongOptions, randomPair].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setMessage('');
  };

  const handleOptionClick = (selectedPair) => {
    if (message.includes('Správně')) return;

    const isCorrect = selectedPair.upper === currentPair.upper;

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
    const modes = ['upper-to-lower', 'lower-to-upper', 'block-to-cursive', 'cursive-to-block'];
    const currentIndex = modes.indexOf(gameMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setGameMode(nextMode);
    setScore(0);
  };

  const getModeLabel = () => {
    switch (gameMode) {
      case 'upper-to-lower': return 'Velká → Malá';
      case 'lower-to-upper': return 'Malá → Velká';
      case 'block-to-cursive': return 'Tiskací → Psací';
      case 'cursive-to-block': return 'Psací → Tiskací';
      default: return '';
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'czech-letters', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  if (!currentPair) return null;

  let targetContent, targetClass, optionContentFn, optionClass;

  switch (gameMode) {
    case 'upper-to-lower':
      targetContent = currentPair.upper;
      targetClass = '';
      optionContentFn = (p) => p.lower;
      optionClass = '';
      break;
    case 'lower-to-upper':
      targetContent = currentPair.lower;
      targetClass = '';
      optionContentFn = (p) => p.upper;
      optionClass = '';
      break;
    case 'block-to-cursive':
      targetContent = currentPair[roundCase];
      targetClass = '';
      optionContentFn = (p) => p[roundCase];
      optionClass = 'font-cursive text-6xl';
      break;
    case 'cursive-to-block':
      targetContent = currentPair[roundCase];
      targetClass = 'font-cursive text-8xl';
      optionContentFn = (p) => p[roundCase];
      optionClass = '';
      break;
    default:
      targetContent = currentPair.upper;
      optionContentFn = (p) => p.lower;
  }

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
        {getModeLabel()}
      </h2>

      <div className="flex items-center justify-center w-40 h-40 bg-white rounded-3xl shadow-sm border-2 border-orange-100 mb-12">
        <span className={`text-8xl font-bold text-orange-600 ${targetClass}`}>
          {targetContent}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`
              h-24 rounded-2xl bg-white border-b-4 border-orange-200 hover:border-orange-400 
              text-5xl font-bold text-orange-600 hover:-translate-y-1 transition-all shadow-lg 
              active:border-b-0 active:translate-y-1 flex items-center justify-center
              ${optionClass}
            `}
          >
            {optionContentFn(option)}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-semibold text-sm"
        >
          <RefreshCw size={16} />
          Změnit režim: {getModeLabel()}
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
        <Leaderboard gameId="czech-letters" title="Mistři písmenek" limit={3} />
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
                Nauč se poznávat písmenka!
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Podívej se na písmenko v rámečku.</li>
                <li>Najdi k němu správnou dvojici mezi tlačítky.</li>
                <li><strong>Velká písmena:</strong> A, B, C...</li>
                <li><strong>Malá písmena:</strong> a, b, c...</li>
              </ul>
              <p>
                Můžeš si přepnout hru a hledat k malým písmenkům ta velká.
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
