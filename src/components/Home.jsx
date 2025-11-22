import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, BrainCircuit } from 'lucide-react';

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
        
        <Link to="/grade1/czech" className="bg-orange-100 hover:bg-orange-200 border-2 border-orange-400 p-8 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:scale-105 w-64">
          <BookOpen size={64} className="text-orange-600" />
          <span className="text-2xl font-bold text-orange-800">Čeština</span>
          <span className="text-orange-700">1. Třída</span>
        </Link>

        <Link to="/grade1/logic" className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-400 p-8 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:scale-105 w-64">
          <BrainCircuit size={64} className="text-purple-600" />
          <span className="text-2xl font-bold text-purple-800">Logika</span>
          <span className="text-purple-700">1. Třída</span>
        </Link>
      </div>
    </div>
  );
}