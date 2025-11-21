import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './components/Home';
import { MathDashboard } from './modules/grade1/math/MathDashboard';
import { CountingGame } from './modules/grade1/math/CountingGame';
import { AdditionGame } from './modules/grade1/math/AdditionGame';
import { SubtractionGame } from './modules/grade1/math/SubtractionGame';
import { ComparisonGame } from './modules/grade1/math/ComparisonGame';
import { MemoryGame } from './modules/grade1/math/MemoryGame';
import { GameConfig } from './config';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grade1/math" element={<MathDashboard />} />
          <Route path="grade1/math/counting" element={<CountingGame />} />
          <Route path="grade1/math/addition" element={<AdditionGame maxNumber={GameConfig.maxNumber} />} />
          <Route path="grade1/math/subtraction" element={<SubtractionGame maxNumber={GameConfig.maxNumber} />} />
          <Route path="grade1/math/comparison" element={<ComparisonGame maxNumber={GameConfig.maxNumber} />} />
          <Route path="grade1/math/memory" element={<MemoryGame maxNumber={GameConfig.maxNumber} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
