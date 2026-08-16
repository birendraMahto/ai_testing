import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { FollowUpPanel } from '../components/follow-up/FollowUpPanel';
import { ResultRightPanel } from '../components/common/ResultRightPanel';
import { api } from '../services/api';

export function FollowUpEmailPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async (formData: FormData) => {
    setIsGenerating(true);
    setContent(null); // clear previous
    try {
      const response = await api.generateFollowUp(formData);
      setContent(response.content);
    } catch (error) {
      console.error('Failed to generate follow up email:', error);
      alert('Failed to generate follow up email.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Header title="Job Ready.AI" />
      <div className="app-layout">
        <LeftSidebar />
        <FollowUpPanel onGenerate={handleGenerate} isLoading={isGenerating} />
        <ResultRightPanel 
          title="Follow Up Email" 
          content={content} 
          isLoading={isGenerating} 
          filename="follow_up_email.docx"
        />
      </div>
    </>
  );
}
