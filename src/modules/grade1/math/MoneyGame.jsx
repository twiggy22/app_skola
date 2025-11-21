import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star, ShoppingCart, Trash2, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS = [
  { emoji: '🍬', name: 'Bonbón', price: 2 },
  { emoji: '✏️', name: 'Tužka', price: 5 },
  { emoji: '🍎', name: 'Jablko', price: 8 },
  { emoji: '🍦', name: 'Zmrzlina', price: 15 },
  { emoji: '🍩', name: 'Kobliha', price: 12 },
  { emoji: '🍫', name: 'Čokoláda', price: 20 },
  { emoji: '🧸', name: 'Medvídek', price: 45 },
  { emoji: '🚗', name: 'Autíčko', price: 35 },
  { emoji: '📒', name: 'Sešit', price: 18 },
  { emoji: '🎨', name: 'Barvičky', price: 50 },
];

const COINS = [
  { value: 1, color: 'bg-gray-300 border-gray-400', size: 'w-12 h-12', text: 'text-gray-700' },
  { value: 2, color: 'bg-gray-300 border-gray-400', size: 'w-14 h-14', text: 'text-gray-700' },
  { value: 5, color: 'bg-gray-300 border-gray-400', size: 'w-16 h-16', text: 'text-gray-700' },
  { value: 10, color: 'bg-orange-300 border-orange-400', size: 'w-12 h-12', text: 'text-orange-900' },
  { value: 20, color: 'bg-yellow-400 border-yellow-500', size: 'w-14 h-14', text: 'text-yellow-900' },
  { value: 50, color: 'bg-yellow-100 border-yellow-600 ring-4 ring-orange-400', size: 'w-16 h-16', text: 'text-yellow-900' }, // Simplified bimetallic
];

export function MoneyGame() {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState(ITEMS[0]);
  const [payment, setPayment] = useState([]); // Array of coin values
  const [message, setMessage] = useState('');

  const generateGame = () => {
    const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    setCurrentItem(randomItem);
    setPayment([]);
    setMessage('');
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleAddCoin = (value) => {
    setPayment([...payment, value]);
    setMessage('');
  };

  const handleRemoveCoin = (index) => {
    const newPayment = [...payment];
    newPayment.splice(index, 1);
    setPayment(newPayment);
    setMessage('');
  };

  const currentTotal = payment.reduce((a, b) => a + b, 0);

  const handleCheck = () => {
    if (currentTotal === currentItem.price) {
      setScore(s => s + 1);
      setMessage('Správně! 🎉');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(generateGame, 1500);
    } else if (currentTotal < currentItem.price) {
      setMessage('To je málo. Přidej ještě penízky.');
    } else {
      setMessage('To je moc. Uber penízky.');
    }
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

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-yellow-600 text-center sm:order-2">Obchod</h1>
      </div>

      {/* Game Area */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        
        {/* Left: Item to Buy */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center justify-center border-4 border-blue-100 relative overflow-hidden min-h-[200px]">
          <div className="absolute top-0 left-0 w-full bg-blue-100 py-2 text-center font-bold text-blue-800 text-sm sm:text-base">
            KUPUJEŠ
          </div>
          <div className="text-7xl sm:text-9xl mb-2 sm:mb-4 mt-6 sm:mt-8 animate-bounce-slow">
            {currentItem.emoji}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{currentItem.name}</h2>
          <div className="text-4xl sm:text-5xl font-bold text-blue-600 bg-blue-50 px-6 sm:px-8 py-2 sm:py-4 rounded-2xl border-2 border-blue-200">
            {currentItem.price} Kč
          </div>
        </div>

        {/* Right: Payment Area */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 flex flex-col border-4 border-yellow-100 relative">
          <div className="absolute top-0 left-0 w-full bg-yellow-100 py-2 text-center font-bold text-yellow-800 rounded-t-2xl text-sm sm:text-base">
            TVOJE PENĚŽENKA
          </div>
          
          {/* Current Payment Display */}
          <div className="mt-8 sm:mt-10 mb-4 flex-grow bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-2 sm:p-4 min-h-[120px] sm:min-h-[150px] flex flex-wrap content-start gap-2">
            {payment.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-sm sm:text-base">
                Sem dávej penízky...
              </div>
            )}
            {payment.map((val, idx) => {
              const coin = COINS.find(c => c.value === val);
              return (
                <button
                  key={idx}
                  onClick={() => handleRemoveCoin(idx)}
                  className={`${coin.color} ${coin.size} rounded-full flex items-center justify-center font-bold shadow-md border-2 hover:scale-110 transition-transform animate-in zoom-in duration-200`}
                >
                  {val}
                </button>
              );
            })}
          </div>

          {/* Total and Check Button */}
          <div className="flex items-center justify-between mb-6 bg-yellow-50 p-4 rounded-xl">
            <div className="text-gray-600 font-bold">
              Celkem: <span className={`text-2xl ${currentTotal > currentItem.price ? 'text-red-500' : currentTotal === currentItem.price ? 'text-green-600' : 'text-blue-600'}`}>{currentTotal} Kč</span>
            </div>
            <button
              onClick={() => setPayment([])}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Vyprázdnit"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <button
            onClick={handleCheck}
            disabled={payment.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all
              ${payment.length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600 hover:-translate-y-1 active:translate-y-0'
              }
            `}
          >
            Zaplatit
          </button>

          {message && (
            <div className={`mt-4 text-center font-bold flex items-center justify-center gap-2 ${message.includes('Správně') ? 'text-green-600' : 'text-red-500 animate-shake'}`}>
              {message}
              {!message.includes('Správně') && <Frown className="inline-block" />}
            </div>
          )}
        </div>
      </div>

      {/* Coin Selection */}
      <div className="mt-8 w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6 border-t-4 border-gray-100">
        <h3 className="text-center text-gray-500 font-bold mb-4 uppercase text-sm tracking-wider">Vyber mince</h3>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {COINS.map((coin) => (
            <button
              key={coin.value}
              onClick={() => handleAddCoin(coin.value)}
              className={`${coin.color} ${coin.size} ${coin.text} rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-2 hover:scale-110 active:scale-95 transition-all`}
            >
              {coin.value}
            </button>
          ))}
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
            
            <div className="flex items-center gap-3 mb-4 text-yellow-600">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Jsi v obchodě a chceš si něco koupit.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Podívej se, kolik věc stojí (např. <strong>8 Kč</strong>).</li>
                <li>Dole klikni na penízky, kterými chceš zaplatit.</li>
                <li>Penízky se ti ukážou v peněžence.</li>
                <li>Musíš zaplatit <strong>přesně</strong> tolik, kolik věc stojí.</li>
                <li>Až budeš mít hotovo, klikni na <strong>Zaplatit</strong>.</li>
              </ul>
              <p>
                Hodně štěstí! 🍀
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
