import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import { GatedRoute } from './components/GatedRoute';

import Home from './pages/Home';
import Settings from './pages/Settings';
import TestPlan from './pages/TestPlan';
import TestStrategy from './pages/TestStrategy';
import DefectReport from './pages/DefectReport';
import TestCases from './pages/TestCases';
import ReleaseNote from './pages/ReleaseNote';

const ThemedApp = () => {
  const { isDarkMode } = useAppContext();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="plan" element={<GatedRoute title="Test Plan"><TestPlan /></GatedRoute>} />
          <Route path="strategy" element={<GatedRoute title="Test Strategy"><TestStrategy /></GatedRoute>} />
          <Route path="defects" element={<GatedRoute title="Defect Report"><DefectReport /></GatedRoute>} />
          <Route path="cases" element={<GatedRoute title="Test Cases"><TestCases /></GatedRoute>} />
          <Route path="release" element={<GatedRoute title="Release Note"><ReleaseNote /></GatedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
}

export default App;
