import React from 'react';
import { Delete, Check } from 'lucide-react';

export function NumericKeypad({ onInput, onDelete, onConfirm, disabled = false }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          disabled={disabled}
          className={`
            h-16 rounded-xl text-3xl font-bold shadow-sm transition-all
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-blue-50 hover:scale-105 active:scale-95 border-2 border-gray-200'
            }
            ${num === 0 ? 'col-start-2' : ''}
          `}
        >
          {num}
        </button>
      ))}
      
      <button
        onClick={onDelete}
        disabled={disabled}
        className={`
          h-16 rounded-xl flex items-center justify-center shadow-sm transition-all col-start-1 row-start-4
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95 border-2 border-red-100'
          }
        `}
      >
        <Delete size={28} />
      </button>

      <button
        onClick={onConfirm}
        disabled={disabled}
        className={`
          h-16 rounded-xl flex items-center justify-center shadow-sm transition-all col-start-3 row-start-4
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95 shadow-green-200'
          }
        `}
      >
        <Check size={32} />
      </button>
    </div>
  );
}
