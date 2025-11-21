import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Calculator, BookOpen, Mail } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);  return (
    <div className="min-h-screen bg-blue-50 font-sans flex flex-col">
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-800 transition-colors">
            <GraduationCap size={32} />
            <span className="hidden sm:inline">Škola Hrou</span>
          </Link>
          <div className="flex gap-2 sm:gap-4">
            <Link 
              to="/grade1/math" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/grade1/math') 
                  ? 'bg-green-100 text-green-700 font-bold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
              }`}
            >
              <Calculator size={20} />
              <span className="hidden sm:inline">Matematika</span>
            </Link>
            
            <Link 
              to="/grade1/czech" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/grade1/czech') 
                  ? 'bg-orange-100 text-orange-700 font-bold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-orange-600'
              }`}
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Čeština</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 flex-grow">
        <Outlet />
      </main>

      <footer className="bg-slate-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
              <GraduationCap size={20} /> Škola Hrou
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              &copy; {new Date().getFullYear()} Všechna práva vyhrazena.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Máte nápad nebo připomínku?</span>
            <a 
              href="mailto:informace@iteb.cz?subject=Zpráva z aplikace Škola Hrou" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
            >
              <Mail size={16} />
              Napište nám
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}