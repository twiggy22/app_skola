import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './components/Home';
import { CountingGame } from './modules/grade1/math/CountingGame';

const MathDashboard = () => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-green-700 mb-8">Matematika - 1. Třída</h2>
    <div className="flex justify-center gap-6">
      <Link to="counting" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-green-100 flex flex-col items-center gap-4 w-64">
        <div className="text-6xl">🍎</div>
        <h3 className="text-xl font-bold text-gray-800">Počítání</h3>
        <p className="text-gray-500">Spočítej předměty</p>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grade1/math" element={<MathDashboard />} />
          <Route path="grade1/math/counting" element={<CountingGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
