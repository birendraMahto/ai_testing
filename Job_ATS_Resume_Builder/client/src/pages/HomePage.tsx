import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { CenterPanel } from '../components/home/CenterPanel';
import { RightPanel } from '../components/home/RightPanel';
import type { AnalysisResult } from '../types';
import { api } from '../services/api';

export function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleHistorySelect = async (id: string) => {
    try {
      const result = await api.getHistoryDetail(id);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  return (
    <>
      <Header title="Resume Builder" />
      <div className="app-layout">
        <LeftSidebar
          onHistorySelect={handleHistorySelect}
          activeHistoryId={analysisResult?.id}
        />
        <CenterPanel
          onAnalysisComplete={handleAnalysisComplete}
          onLoading={setIsLoading}
        />
        <RightPanel
          analysis={analysisResult}
          loading={isLoading}
        />
      </div>
    </>
  );
}
