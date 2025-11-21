import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star, Clock, Frown, Save, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { Leaderboard } from '../../../components/Leaderboard';

export function ClockGame() {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [targetTime, setTargetTime] = useState({ hours: 12, minutes: 0 });
  const [options, setOptions] = useState([]);
  const [mode, setMode] = useState('read'); // 'read' (analog -> digital) or 'set' (digital -> analog options)
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false
  const [message, setMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const generateTime = () => {
    // 1st grade: Whole hours and half hours
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.random() > 0.5 ? 0 : 30;
    return { hours, minutes };
  };

  const formatTime = (t) => {
    return `${t.hours}:${t.minutes.toString().padStart(2, '0')}`;
  };

  const generateGame = () => {
    setIsCorrect(null);
    const newTarget = generateTime();
    setTargetTime(newTarget);
    
    // Randomize mode (50/50)
    const newMode = Math.random() > 0.5 ? 'read' : 'set';
    setMode(newMode);

    // Generate options
    const newOptions = [newTarget];
    while (newOptions.length < 3) {
      const randomTime = generateTime();
      // Check for duplicates
      const isDuplicate = newOptions.some(
        t => t.hours === randomTime.hours && t.minutes === randomTime.minutes
      );
      if (!isDuplicate) {
        newOptions.push(randomTime);
      }
    }
    
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleOptionClick = (selectedTime) => {
    if (isCorrect === true) return;

    if (selectedTime.hours === targetTime.hours && selectedTime.minutes === targetTime.minutes) {
      setIsCorrect(true);
      setMessage('Správně! 🎉');
      setScore(s => s + 1);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(generateGame, 1500);
    } else {
      setIsCorrect(false);
      setMessage('Zkus to znovu');
      setTimeout(() => {
        setIsCorrect(null);
        setMessage('');
      }, 1000);
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);
    const success = await saveScore(playerName, 'math-clock', score);
    setIsSaving(false);
    
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  // SVG Clock Component
  const ClockFace = ({ time, size = 200, interactive = false, onClick = null, className = "" }) => {
    const radius = size / 2;
    const center = radius;
    const hourHandLength = radius * 0.5;
    const minuteHandLength = radius * 0.75;
    
    const hourAngle = (time.hours % 12) * 30 + time.minutes * 0.5;
    const minuteAngle = time.minutes * 6;

    // Helper to calculate position for numbers
    const getNumberPos = (num, r) => {
      const angle = (num * 30 - 90) * (Math.PI / 180);
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    return (
      <div 
        className={`relative rounded-full bg-white shadow-xl flex-shrink-0 ${interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Border */}
          <circle cx={center} cy={center} r={radius - 4} fill="white" stroke="#1e3a8a" strokeWidth="8" />
          
          {/* Markers and Numbers */}
          {[...Array(12)].map((_, i) => {
            const num = i + 1;
            // Move numbers closer to center (0.72 radius)
            const pos = getNumberPos(num, radius * 0.72);
            const isMain = num % 3 === 0;
            
            return (
              <g key={i}>
                {/* Tick marks - moved to edge (0.85 to 0.95 radius) */}
                <line 
                  x1={center + (radius * 0.95) * Math.cos((num * 30 - 90) * Math.PI / 180)}
                  y1={center + (radius * 0.95) * Math.sin((num * 30 - 90) * Math.PI / 180)}
                  x2={center + (radius * 0.85) * Math.cos((num * 30 - 90) * Math.PI / 180)}
                  y2={center + (radius * 0.85) * Math.sin((num * 30 - 90) * Math.PI / 180)}
                  stroke={isMain ? "#1f2937" : "#9ca3af"}
                  strokeWidth={isMain ? 3 : 1}
                />
                {/* Numbers */}
                <text 
                  x={pos.x} 
                  y={pos.y} 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  className={`font-bold ${isMain ? 'fill-gray-900 font-extrabold' : 'fill-gray-600'}`}
                  style={{ fontSize: size * 0.12, fontFamily: 'sans-serif' }}
                >
                  {num}
                </text>
              </g>
            );
          })}

          {/* Hour Hand */}
          <g transform={`rotate(${hourAngle}, ${center}, ${center})`}>
            <line x1={center} y1={center} x2={center} y2={center - hourHandLength} stroke="black" strokeWidth={size * 0.04} strokeLinecap="round" />
            {/* Arrow head for hour */}
             <path d={`M${center},${center - hourHandLength - (size * 0.02)} L${center - (size * 0.03)},${center - hourHandLength + (size * 0.02)} L${center + (size * 0.03)},${center - hourHandLength + (size * 0.02)} Z`} fill="black" />
          </g>

          {/* Minute Hand */}
          <g transform={`rotate(${minuteAngle}, ${center}, ${center})`}>
            <line x1={center} y1={center} x2={center} y2={center - minuteHandLength} stroke="#dc2626" strokeWidth={size * 0.025} strokeLinecap="round" />
             {/* Arrow head for minute */}
             <path d={`M${center},${center - minuteHandLength - (size * 0.02)} L${center - (size * 0.025)},${center - minuteHandLength + (size * 0.02)} L${center + (size * 0.025)},${center - minuteHandLength + (size * 0.02)} Z`} fill="#dc2626" />
          </g>

          {/* Center Dot */}
          <circle cx={center} cy={center} r={size * 0.03} fill="#1e3a8a" />
          <circle cx={center} cy={center} r={size * 0.01} fill="white" />
        </svg>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col items-center min-h-screen">
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
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition-colors"
            title="Nápověda"
          >
            <Lightbulb className="w-6 h-6" />
          </button>
          <button 
            onClick={generateGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Nová hra"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-blue-900 text-center sm:order-2">Hodiny</h1>
      </div>

      {/* Game Content */}
      <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
        
        {/* Question Section */}
        <div className="text-center">
          <h2 className="text-2xl text-gray-700 mb-8">
            {mode === 'read' ? 'Kolik je hodin?' : `Najdi hodiny, kde je:`}
          </h2>
          
          {mode === 'read' ? (
            <div className="mb-8 flex justify-center">
              {/* Responsive scaling using CSS transform for smaller screens if needed, but base size 220 is safe */}
              <div className="transform sm:scale-125 origin-center">
                <ClockFace time={targetTime} size={220} />
              </div>
            </div>
          ) : (
            <div className="text-5xl sm:text-6xl font-bold text-blue-600 bg-white px-8 sm:px-12 py-4 sm:py-6 rounded-3xl shadow-lg border-4 border-blue-100 mb-8">
              {formatTime(targetTime)}
            </div>
          )}
        </div>

        {/* Options Section */}
        <div className={`
          grid gap-4 sm:gap-6 w-full
          ${mode === 'read' ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}
        `}>
          {options.map((opt, idx) => (
            <div key={idx} className="flex justify-center">
              {mode === 'read' ? (
                <button
                  onClick={() => handleOptionClick(opt)}
                  className="w-full py-4 sm:py-6 bg-white rounded-2xl shadow-md border-b-4 border-blue-200 hover:border-blue-400 hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-all text-2xl sm:text-3xl font-bold text-gray-800"
                >
                  {formatTime(opt)}
                </button>
              ) : (
                <div onClick={() => handleOptionClick(opt)}>
                  <ClockFace 
                    time={opt} 
                    size={140} 
                    interactive={true} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={`text-xl font-bold animate-shake flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500'}`}>
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
          <Leaderboard gameId="math-clock" title="Mistři času" limit={3} />
        </div>
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
            
            <div className="flex items-center gap-3 mb-4 text-blue-900">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Nauč se poznávat hodiny!
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Malá ručička</strong> (černá) ukazuje hodiny.</li>
                <li><strong>Velká ručička</strong> (červená) ukazuje minuty.</li>
                <li>Když je velká nahoře (na 12), je celá hodina (např. 3:00).</li>
                <li>Když je velká dole (na 6), je půl (např. 3:30).</li>
              </ul>
              <p>
                Vyber správnou odpověď kliknutím.
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
