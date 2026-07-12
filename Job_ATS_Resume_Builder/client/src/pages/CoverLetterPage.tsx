import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { CoverLetterPanel } from '../components/cover-letter/CoverLetterPanel';
import { ResultRightPanel } from '../components/common/ResultRightPanel';
import { api } from '../services/api';

export function CoverLetterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async (formData: FormData) => {
    setIsGenerating(true);
    setContent(null); // clear previous
    try {
      const response = await api.generateCoverLetter(formData);
      setContent(response.content);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Failed to generate cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Header title="Resume Builder" />
      <div className="app-layout">
        <LeftSidebar />
        <CoverLetterPanel onGenerate={handleGenerate} isLoading={isGenerating} />
        <ResultRightPanel 
          title="Cover Letter" 
          content={content} 
          isLoading={isGenerating} 
          filename="cover_letter.docx"
        />
      </div>
    </>
  );
}
