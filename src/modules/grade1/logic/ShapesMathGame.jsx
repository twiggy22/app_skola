import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Star, Frown, Check, Lightbulb, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveScore } from '../../../services/scoreService';
import { GameConfig } from '../../../config';
import { Leaderboard } from '../../../components/Leaderboard';

// Definice tvarů/ovoce (hodnoty se přiřadí náhodně pro každý příklad)
const SHAPES = [
  { id: 'apple', label: 'Jablko', emoji: '🍎' },
  { id: 'pear', label: 'Hruška', emoji: '🍐' },
  { id: 'plum', label: 'Švestka', emoji: '🍑' }
];

export function ShapesMathGame() {
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // puzzle: three lines. line 0 is given with result; lines 1 and 2 must be computed by player
  const [puzzle, setPuzzle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  const max = Math.max(1, GameConfig.maxNumber || 5);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateExpression = (terms) => {
    // terms: array of { shapeId }
    // build a display string of emojis and operators (all + or - as chosen)
    const ops = [];
    for (let i = 0; i < terms.length - 1; i++) {
      // only + or -; prefer + more often
      ops.push(Math.random() < 0.75 ? '+' : '-');
    }
    return { terms, ops };
  };

  const computeValueForExpr = (expr, valueMap) => {
    let total = valueMap[expr.terms[0].shapeId];
    for (let i = 0; i < expr.ops.length; i++) {
      const op = expr.ops[i];
      const rhs = valueMap[expr.terms[i + 1].shapeId];
      if (op === '+') total += rhs; else total -= rhs;
    }
    return Math.max(0, total);
  };

  const generateGame = () => {
    setIsSolved(false);
    setMessage('');
    setUserAnswer('');

    // assign random values for each shape for this puzzle
    const valueMap = {};
    SHAPES.forEach(s => {
      valueMap[s.id] = randInt(1, max);
    });

    // Choose two distinct shapes A and B (prefer two symbols for simplicity)
    const pool = [...SHAPES];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const A = pool[0];
    const B = pool[1] || pool[0];

    // Line 0: n*A = R0 (gives A) — ensure only addition so expression is deducible
    const n0 = Math.random() < 0.8 ? 2 : 3;
    const terms0 = Array.from({ length: n0 }, () => ({ shapeId: A.id }));
    const expr0 = { terms: terms0, ops: Array.from({ length: Math.max(0, terms0.length - 1) }, () => '+') };
    const line0 = { expr: expr0, result: computeValueForExpr(expr0, valueMap) };

    // Line 1: A + B = R1  (A known -> B deducible easily)
    const line1Expr = { terms: [{ shapeId: A.id }, { shapeId: B.id }], ops: ['+'] };
    const line1 = { expr: line1Expr, result: computeValueForExpr(line1Expr, valueMap) };

    // Final expression: build 2-term expression (prefer addition), ensure non-negative
    let finalExpr = null;
    const makeCandidate = () => {
      const useAdd = Math.random() < 0.75;
      if (useAdd) {
        return { terms: [{ shapeId: A.id }, { shapeId: B.id }], ops: ['+'] };
      }
      // subtraction candidate - ensure left >= right by valueMap
      if (valueMap[A.id] >= valueMap[B.id]) {
        return { terms: [{ shapeId: A.id }, { shapeId: B.id }], ops: ['-'] };
      }
      return { terms: [{ shapeId: B.id }, { shapeId: A.id }], ops: ['-'] };
    };

    // avoid final expression being identical to line1 (so children don't see same expression twice)
    let attempts = 0;
    do {
      finalExpr = makeCandidate();
      attempts += 1;
      if (attempts > 10) break;
    } while (
      finalExpr.terms.length === line1Expr.terms.length &&
      finalExpr.terms.every((t, i) => t.shapeId === line1Expr.terms[i].shapeId) &&
      finalExpr.ops.every((o, i) => o === line1Expr.ops[i])
    );

    const finalValue = computeValueForExpr(finalExpr, valueMap);

    setPuzzle({ valueMap, lines: [line0, line1], finalExpr, finalValue });
  };

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) setPlayerName(savedName);
    generateGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = (e) => {
    e?.preventDefault();
    if (!puzzle) return;
    if (userAnswer.trim() === '') return;
    const guess = parseInt(userAnswer, 10);
    const expected = puzzle.finalValue;
    if (guess === expected) {
      setMessage('Správně!');
      setIsSolved(true);
      setScore(s => s + 1);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        generateGame();
      }, 1200);
    } else {
      setMessage('Zkus to znovu');
    }
  };

  const handleSaveScore = async (e) => {
    e?.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem('playerName', playerName);
    setIsSaving(true);
    const success = await saveScore(playerName, 'logic-shapes', score);
    setIsSaving(false);
    if (success) {
      setScoreSaved(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <div className="w-full grid grid-cols-2 sm:flex sm:items-center sm:justify-between mb-8 gap-4">
        <Link to="/grade1/logic" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors justify-self-start sm:order-1">
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
          <button onClick={generateGame} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Nová hra">
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-purple-700 text-center sm:order-2">
          Tvary a čísla
        </h1>
      </div>

      <div className="mb-6 w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm">
        {/* Show three given lines (with results) and a final expression to compute */}
        {puzzle && (
          <div className="flex flex-col gap-6">
            {puzzle.lines.map((ln, idx) => (
              <div key={idx} className="flex items-center justify-center gap-4 text-4xl font-bold">
                <div className="flex items-center gap-2">
                  {ln.expr.terms.map((t, i) => (
                    <React.Fragment key={i}>
                      <span className="text-5xl">{SHAPES.find(s => s.id === t.shapeId).emoji}</span>
                      {i < ln.expr.ops.length && <span className="text-3xl">{ln.expr.ops[i]}</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-3xl">=</div>
                <div className="text-3xl font-bold">{ln.result}</div>
              </div>
            ))}

            {/* Final expression (no result) */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 text-4xl font-bold mb-3">
                {puzzle.finalExpr.terms.map((t, i) => (
                  <React.Fragment key={i}>
                    <span className="text-5xl">{SHAPES.find(s => s.id === t.shapeId).emoji}</span>
                    {i < puzzle.finalExpr.ops.length && <span className="text-3xl">{puzzle.finalExpr.ops[i]}</span>}
                  </React.Fragment>
                ))}
                <span className="text-3xl">=</span>
                {isSolved ? (
                  <span className="w-24 h-24 bg-green-100 rounded-xl border-2 border-green-400 flex items-center justify-center text-green-600 text-2xl font-bold">
                    {puzzle.finalValue}
                  </span>
                ) : (
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => { setUserAnswer(e.target.value); if (message) setMessage(''); }}
                    placeholder="?"
                    className={`w-24 h-24 bg-white rounded-xl border-2 text-center text-gray-800 outline-none focus:ring-4 transition-all
                      ${message.includes('Zkus') ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-purple-200 focus:border-purple-500 focus:ring-purple-100'}`}
                  />
                )}
              </div>

              {/* button moved below example for consistent layout */}
            </div>
          </div>
        )}
        {/* puzzle content end */}
        </div>
        <div className="mb-8">
          {isSolved ? (
            <button onClick={generateGame} className="px-8 py-3 bg-purple-500 text-white text-xl rounded-full hover:bg-purple-600 transition-colors shadow-lg font-bold flex items-center gap-2 animate-bounce">
              Další příklad
            </button>
          ) : (
            <button onClick={handleCheck} className="px-8 py-3 bg-green-500 text-white text-xl rounded-full hover:bg-green-600 transition-colors shadow-lg font-bold flex items-center gap-2">
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

        <div className="mt-6 w-full max-w-md">
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
              <button type="submit" disabled={isSaving || !playerName.trim() || score === 0} className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2">
                Uložit
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100 text-center font-bold text-green-700">Výsledek uložen. Díky!</div>
        )}
      </div>

      {/* Local leaderboard for this logic game (moved below save form to match other games) */}
      <div className="mt-12 w-full max-w-md">
        <Leaderboard gameId="logic-shapes" title="Mistři logiky" limit={3} />
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

            <div className="flex items-center gap-3 mb-4 text-purple-600">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>
                V každém příkladu ovoce představuje čísla. Nejprve se podívej na první dva řádky — z nich můžeš dopočítat hodnoty jednotlivých tvarů.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>První řádek ukazuje např. více stejných ovoce: to ti pomůže zjistit hodnotu jednoho kusu.</li>
                <li>Druhý řádek kombinuje dvě různé tvary (např. jablko + hruška), takže můžeš dopočítat i druhý tvar.</li>
                <li>Na konci musíš spočítat hodnotu posledního (prázdného) výrazu a napsat výsledek.</li>
                <li>Použij klávesnici k zadání čísla a stiskni <strong>Zkontrolovat</strong>.</li>
              </ul>
              <p>
                Hodně štěstí! 🍀
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
