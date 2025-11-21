import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, BookOpen, Calculator } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Home /> Škola Hrou
          </Link>
          <div className="flex gap-4">
            <Link to="/grade1/math" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
              <Calculator size={20} /> Matematika
            </Link>
            {/* Reading will be added later */}
            <span className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
              <BookOpen size={20} /> Čtení (Brzy)
            </span>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}