import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export function Home() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Vítej ve škole hrou!</h1>
      <p className="text-xl text-gray-600 mb-10">Vyber si, co se chceš dnes naučit.</p>
      
      <div className="flex justify-center gap-6 flex-wrap">
        <Link to="/grade1/math" className="bg-green-100 hover:bg-green-200 border-2 border-green-400 p-8 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:scale-105 w-64">
          <Calculator size={64} className="text-green-600" />
          <span className="text-2xl font-bold text-green-800">Matematika</span>
          <span className="text-green-700">1. Třída</span>
        </Link>
        
        {/* Placeholder for Reading */}
        <div className="bg-gray-100 border-2 border-gray-300 p-8 rounded-2xl flex flex-col items-center gap-4 w-64 opacity-60">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">📖</div>
          <span className="text-2xl font-bold text-gray-500">Čtení</span>
          <span className="text-gray-400">Brzy</span>
        </div>
      </div>
    </div>
  );
}