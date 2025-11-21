import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameConfig } from '../../../config';

export function MathDashboard() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="flex justify-start mb-8">
        <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft /> Zpět na hlavní stranu
        </Link>
      </div>

      <h2 className="text-4xl font-bold text-green-700 mb-12">Matematika - 1. Třída</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {/* Counting */}
        <Link to="counting" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-green-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">🍎</div>
          <h3 className="text-xl font-bold text-gray-800">Počítání</h3>
          <p className="text-gray-500 text-sm">Spočítej předměty</p>
        </Link>

        {/* Addition */}
        <Link to="addition" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-blue-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl font-bold text-blue-500 mb-2">+</div>
          <h3 className="text-xl font-bold text-gray-800">Sčítání</h3>
          <p className="text-gray-500 text-sm">Sčítání do {GameConfig.maxNumber}</p>
        </Link>

        {/* Subtraction */}
        <Link to="subtraction" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-red-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl font-bold text-red-500 mb-2">-</div>
          <h3 className="text-xl font-bold text-gray-800">Odčítání</h3>
          <p className="text-gray-500 text-sm">Odčítání do {GameConfig.maxNumber}</p>
        </Link>

        {/* Comparison */}
        <Link to="comparison" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-purple-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl font-bold text-purple-500 mb-2">&lt; &gt;</div>
          <h3 className="text-xl font-bold text-gray-800">Porovnávání</h3>
          <p className="text-gray-500 text-sm">Větší nebo menší?</p>
        </Link>

        {/* Memory Game */}
        <Link to="memory" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-indigo-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">🎴</div>
          <h3 className="text-xl font-bold text-gray-800">Pexeso</h3>
          <p className="text-gray-500 text-sm">Najdi příklad a výsledek</p>
        </Link>
      </div>
    </div>
  );
}