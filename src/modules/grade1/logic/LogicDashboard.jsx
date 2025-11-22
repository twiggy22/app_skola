import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Leaderboard } from '../../../components/Leaderboard';

export function LogicDashboard() {
  return (
    <div className="text-center max-w-6xl mx-auto p-4">
      <div className="flex justify-start mb-8">
        <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft /> Zpět na hlavní stranu
        </Link>
      </div>

      <h2 className="text-4xl font-bold text-purple-700 mb-12">Logika - 1. Třída</h2>
      
      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mb-16">
        {/* Rows and Columns */}
        <Link to="rows-columns" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-b-4 border-purple-200 hover:-translate-y-1 flex flex-col items-center gap-4 w-full max-w-[250px]">
          <div className="text-6xl mb-2">🏁</div>
          <h3 className="text-xl font-bold text-gray-800">Řádky a sloupce</h3>
          <p className="text-gray-500 text-sm">Orientace v mřížce</p>
        </Link>
      </div>

      {/* Global Leaderboard */}
      <div className="max-w-md mx-auto">
        <Leaderboard gameId="global-logic" title="Nejlepší logici" limit={5} />
      </div>
    </div>
  );
}
