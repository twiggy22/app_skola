import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function CzechDashboard() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="flex justify-start mb-8">
        <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft /> Zpět na hlavní stranu
        </Link>
      </div>

      <h2 className="text-4xl font-bold text-orange-700 mb-12">Čeština - 1. Třída</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {/* Letters Game */}
        <Link to="letters" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-orange-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">🅰️</div>
          <h3 className="text-xl font-bold text-gray-800">Písmenka</h3>
          <p className="text-gray-500 text-sm">Velká a malá písmena</p>
        </Link>

        {/* Syllables Game */}
        <Link to="syllables" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-orange-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">🗣️</div>
          <h3 className="text-xl font-bold text-gray-800">Slabiky</h3>
          <p className="text-gray-500 text-sm">Velké a malé slabiky</p>
        </Link>

        {/* Words Game */}
        <Link to="words" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-orange-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">📖</div>
          <h3 className="text-xl font-bold text-gray-800">Slova</h3>
          <p className="text-gray-500 text-sm">Čtení slov s obrázky</p>
        </Link>
      </div>
    </div>
  );
}
