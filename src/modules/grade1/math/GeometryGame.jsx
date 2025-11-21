import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Lightbulb, X, Star, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';

const SHAPES = [
  { id: 'circle', name: 'kruh', label: 'kruhy', css: 'rounded-full' },
  { id: 'square', name: 'čtverec', label: 'čtverce', css: 'rounded-none' },
  { id: 'triangle', name: 'trojúhelník', label: 'trojúhelníky', css: 'clip-path-triangle' }, // Requires custom CSS or clip-path
  { id: 'rectangle', name: 'obdélník', label: 'obdélníky', css: 'rounded-none aspect-[3/2]' }
];

const COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-400'
];

// Helper to get hex color for triangle border hack
const getHexColor = (bgClass) => {
  const map = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-yellow-400': '#facc15',
    'bg-purple-500': '#a855f7',
    'bg-orange-500': '#f97316',
    'bg-pink-500': '#ec4899',
    'bg-teal-400': '#2dd4bf'
  };
  return map[bgClass] || '#000';
};

export function GeometryGame() {
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [gameItems, setGameItems] = useState([]);
  const [targetShape, setTargetShape] = useState(null);
  const [foundCount, setFoundCount] = useState(0);
  const [totalTargetCount, setTotalTargetCount] = useState(0);
  const [message, setMessage] = useState('');
  
  // Dragging state
  const containerRef = useRef(null);
  const [dragState, setDragState] = useState({
    itemId: null,
    startX: 0,
    startY: 0,
    initialItemX: 0,
    initialItemY: 0,
    hasMoved: false
  });

  const generateGame = () => {
    // Pick a target shape
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(target);

    // Generate random items
    const items = [];
    const totalItems = 12;
    let targetCount = 0;

    // Ensure at least 3 target shapes
    const minTargets = 3;
    
    for (let i = 0; i < totalItems; i++) {
      let shape;
      if (i < minTargets) {
        shape = target;
      } else {
        shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      }

      if (shape.id === target.id) targetCount++;

      items.push({
        id: i,
        shapeId: shape.id,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: Math.random() * 80, // Random position %
        y: Math.random() * 80,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4, // Random size
        isFound: false,
        isWrong: false
      });
    }

    // Shuffle items so targets aren't first
    setGameItems(items.sort(() => Math.random() - 0.5));
    setTotalTargetCount(targetCount);
    setFoundCount(0);
  };

  useEffect(() => {
    generateGame();
  }, []);

  // Drag handlers
  const handlePointerDown = (e, item) => {
    if (item.isFound) return;
    e.preventDefault(); // Prevent scrolling on touch
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDragState({
      itemId: item.id,
      startX: clientX,
      startY: clientY,
      initialItemX: item.x,
      initialItemY: item.y,
      hasMoved: false
    });
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (dragState.itemId === null || !containerRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaXPixels = clientX - dragState.startX;
      const deltaYPixels = clientY - dragState.startY;

      // Check if moved enough to consider it a drag
      if (!dragState.hasMoved && (Math.abs(deltaXPixels) > 5 || Math.abs(deltaYPixels) > 5)) {
        setDragState(prev => ({ ...prev, hasMoved: true }));
      }

      // Convert pixels to percentage
      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = (deltaXPixels / containerRect.width) * 100;
      const deltaYPercent = (deltaYPixels / containerRect.height) * 100;

      const newX = Math.max(0, Math.min(85, dragState.initialItemX + deltaXPercent));
      const newY = Math.max(0, Math.min(85, dragState.initialItemY + deltaYPercent));

      setGameItems(prev => prev.map(item => 
        item.id === dragState.itemId 
          ? { ...item, x: newX, y: newY } 
          : item
      ));
    };

    const handlePointerUp = (e) => {
      if (dragState.itemId === null) return;

      if (!dragState.hasMoved) {
        // It was a click
        const item = gameItems.find(i => i.id === dragState.itemId);
        if (item) handleItemClick(item);
      }

      setDragState({
        itemId: null,
        startX: 0,
        startY: 0,
        initialItemX: 0,
        initialItemY: 0,
        hasMoved: false
      });
    };

    if (dragState.itemId !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [dragState, gameItems]);

  const handleItemClick = (item) => {
    if (item.isFound) return;

    if (item.shapeId === targetShape.id) {
      // Correct
      setMessage('Správně! 🎉');
      const newItems = gameItems.map(i => 
        i.id === item.id ? { ...i, isFound: true } : i
      );
      setGameItems(newItems);
      
      const newFoundCount = foundCount + 1;
      setFoundCount(newFoundCount);

      if (newFoundCount === totalTargetCount) {
        setScore(s => s + 1);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
      setTimeout(() => setMessage(''), 1000);
    } else {
      // Wrong
      setMessage('Zkus to znovu');
      const newItems = gameItems.map(i => 
        i.id === item.id ? { ...i, isWrong: true } : i
      );
      setGameItems(newItems);
      
      // Reset wrong state after animation
      setTimeout(() => {
        setGameItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, isWrong: false } : i
        ));
        setMessage('');
      }, 1000);
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

        <h1 className="col-span-2 text-2xl sm:text-3xl font-bold text-pink-600 text-center sm:order-2">Poznávání tvarů</h1>
      </div>

      {/* Instruction */}
      <div className="mb-8 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl text-gray-700 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span>Najdi všechny</span>
          <span className="font-bold text-pink-600 text-3xl uppercase">{targetShape?.label}</span>
        </h2>
        
        {/* Visual Hint */}
        {targetShape && (
          <div className="p-4">
             <div 
                className={`w-16 h-16 ${
                  targetShape.id === 'triangle' 
                    ? 'w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[64px] border-b-current bg-transparent' 
                    : targetShape.id === 'rectangle'
                      ? 'w-24 h-16 rounded-lg border-4 border-dashed border-gray-300'
                      : targetShape.id === 'circle'
                        ? 'rounded-full border-4 border-dashed border-gray-300'
                        : 'rounded-lg border-4 border-dashed border-gray-300' // square
                }`}
                style={targetShape.id === 'triangle' ? { color: '#d1d5db' } : {}} // gray-300
              />
          </div>
        )}

        <p className="text-gray-400 text-sm">
          Zbývá najít: {totalTargetCount - foundCount}
        </p>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl h-[400px] bg-white rounded-3xl shadow-xl border-4 border-pink-100 overflow-hidden touch-none"
      >
        {foundCount === totalTargetCount ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 animate-in fade-in duration-500">
            <h2 className="text-4xl font-bold text-green-600 mb-4">Výborně! 🎉</h2>
            <button 
              onClick={generateGame}
              className="px-8 py-3 bg-pink-500 text-white text-xl rounded-full hover:bg-pink-600 transition-colors shadow-lg font-bold"
            >
              Další hra
            </button>
          </div>
        ) : (
          gameItems.map((item) => (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              className={`absolute cursor-grab active:cursor-grabbing hover:z-10
                ${item.isFound ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
                ${item.isWrong ? 'animate-shake' : ''}
                ${dragState.itemId === item.id ? 'z-50 scale-110 transition-none' : 'transition-all duration-300 hover:scale-110'}
              `}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              }}
            >
              <div 
                className={`w-16 h-16 shadow-md pointer-events-none ${
                  item.shapeId === 'triangle' 
                    ? 'w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[64px] border-b-current bg-transparent shadow-none' 
                    : item.shapeId === 'rectangle'
                      ? `w-24 h-16 rounded-lg ${item.color}`
                      : item.shapeId === 'circle'
                        ? `rounded-full ${item.color}`
                        : `rounded-lg ${item.color}` // square
                }`}
                style={item.shapeId === 'triangle' ? { color: getHexColor(item.color) } : {}}
              >
                {/* Triangle hack: border-b-current uses text color */}
              </div>
            </div>
          ))
        )}
      </div>

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
            
            <div className="flex items-center gap-3 mb-4 text-pink-600">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Jak hrát?</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Tvým úkolem je najít všechny tvary podle zadání.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Nahoře vidíš, co máš hledat (např. <strong>KRUHY</strong>).</li>
                <li>Klikej na správné tvary. Když se trefíš, tvar zmizí.</li>
                <li>Musíš najít úplně všechny!</li>
              </ul>
              <p>
                Hodně štěstí! 🍀
              </p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
