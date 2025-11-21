import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MemoryGame({ maxNumber = 20 }) {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState('');

  const generateCards = () => {
    const numPairs = 6; // 12 cards total
    const newCards = [];
    
    for (let i = 0; i < numPairs; i++) {
      // Generate simple addition problems
      const a = Math.floor(Math.random() * (maxNumber / 2)); 
      const b = Math.floor(Math.random() * (maxNumber / 2));
      const result = a + b;
      
      // Create pair
      const pairId = i;
      newCards.push({
        id: `eq-${i}`,
        content: `${a} + ${b}`,
        value: result,
        type: 'equation',
        isFlipped: false,
        isMatched: false,
        pairId: pairId
      });
      newCards.push({
        id: `res-${i}`,
        content: `${result}`,
        value: result,
        type: 'result',
        isFlipped: false,
        isMatched: false,
        pairId: pairId
      });
    }

    // Shuffle
    return newCards.sort(() => Math.random() - 0.5);
  };

  const initializeGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsLocked(false);
    setMessage('');
  };

  useEffect(() => {
    initializeGame();
  }, [maxNumber]);

  const handleCardClick = (id) => {
    if (isLocked) return;
    
    const clickedCard = cards.find(c => c.id === id);
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setIsLocked(true);
      checkForMatch(newFlippedCards, newCards);
    }
  };

  const checkForMatch = (currentFlipped, currentCards) => {
    const [card1, card2] = currentFlipped;
    const isMatch = card1.value === card2.value && card1.id !== card2.id;

    if (isMatch) {
      setMessage('Správně! 🎉');
      const newCards = currentCards.map(c => 
        c.id === card1.id || c.id === card2.id 
          ? { ...c, isMatched: true, isFlipped: true } 
          : c
      );
      setCards(newCards);
      setFlippedCards([]);
      setIsLocked(false);
      setMatchedPairs(prev => {
        const newCount = prev + 1;
        if (newCount === 6) {
          setScore(prevScore => prevScore + 1);
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
        return newCount;
      });
      setTimeout(() => setMessage(''), 1500);
    } else {
      setMessage('Zkus to znovu');
      // No match, flip back after delay
      setTimeout(() => {
        const newCards = currentCards.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: false } 
            : c
        );
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
        setMessage('');
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="w-full grid grid-cols-2 sm:flex sm:items-center sm:justify-between mb-8 gap-4">
        <Link to="/grade1/math" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors justify-self-start sm:order-1">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Zpět
        </Link>
        
        <div className="flex gap-2 items-center justify-self-end sm:order-3">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl mr-4">
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
            onClick={initializeGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Nová hra"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-purple-600 text-center sm:order-2">Matematické Pexeso</h1>
      </div>

      <div className="flex justify-between mb-4 text-xl font-semibold text-gray-700">
        <div>Tahů: {moves}</div>
        <div>Nalezeno: {matchedPairs} / 6</div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {cards.map(card => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="aspect-[3/4] sm:aspect-square cursor-pointer relative group [perspective:1000px]"
          >
            <div className={`
              w-full h-full transition-all duration-500 [transform-style:preserve-3d]
              ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}
            `}>
              {/* Card Back */}
              <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center border-2 border-white/20">
                <span className="text-4xl">❓</span>
              </div>

              {/* Card Front */}
              <div className={`
                absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]
                bg-white rounded-xl shadow-lg flex items-center justify-center border-4
                ${card.isMatched ? 'border-green-400 bg-green-50' : 'border-purple-200'}
              `}>
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {card.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {matchedPairs === 6 && (
        <div className="mt-8 text-center animate-bounce">
          <h2 className="text-2xl font-bold text-green-600">Výborně! Všechny páry nalezeny! 🎉</h2>
          <button 
            onClick={initializeGame}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
          >
            Hrát znovu
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-8 text-2xl font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
          {message}
          {!message.includes('Správně') && <Frown className="inline-block" />}
        </div>
      )}

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
                Cílem hry je najít všechny dvojice karet, které k sobě patří.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Jedna karta obsahuje <strong>příklad</strong> (např. <span className="font-mono bg-gray-100 px-1 rounded">2 + 3</span>).</li>
                <li>Druhá karta obsahuje <strong>výsledek</strong> (např. <span className="font-mono bg-gray-100 px-1 rounded">5</span>).</li>
              </ul>
              <p>
                Otáčejte karty kliknutím. Pokud najdete správnou dvojici, zůstane otočená. Hodně štěstí! 🍀
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
