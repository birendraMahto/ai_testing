import React from 'react';
import { X } from 'lucide-react';

export const PreviewModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: any }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel" style={{
        width: '90%', maxWidth: '900px', maxHeight: '90vh',
        backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}><X size={24} /></button>
        </div>
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      </div>
    </div>
  );
};
