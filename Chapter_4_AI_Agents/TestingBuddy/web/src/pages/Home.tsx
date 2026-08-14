import React from 'react';
import { Zap, PlayCircle, Target, ClipboardList, Bug, ListChecks, FileCheck, Rocket, ShieldCheck, Clock, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'AI-Powered Strategy', desc: 'Generate intelligent test strategies tailored to your project and risks.', icon: <Target size={24} color="#7e22ce" />, bg: '#f3e8ff' },
    { title: 'Smart Test Planning', desc: 'Create comprehensive test plans in minutes with AI assistance.', icon: <ClipboardList size={24} color="#be185d" />, bg: '#fce7f3' },
    { title: 'Defect Intelligence', desc: 'Auto-categorize, prioritize & analyze defects to find issues faster.', icon: <Bug size={24} color="#b45309" />, bg: '#fffbeb' },
    { title: 'Test Case Generation', desc: 'Generate, organize & reuse test cases with intelligent recommendations.', icon: <ListChecks size={24} color="#047857" />, bg: '#ecfdf5' },
    { title: 'Release Confidence', desc: 'Generate release notes instantly and communicate changes with clarity.', icon: <FileCheck size={24} color="#0369a1" />, bg: '#f0f9ff' }
  ];

  const stats = [
    { value: '10x', label: 'Faster Test Planning', icon: <Rocket size={32} /> },
    { value: '95%', label: 'Better Defect Detection', icon: <ShieldCheck size={32} /> },
    { value: '70%', label: 'Reduced Testing Effort', icon: <Clock size={32} /> },
    { value: '100%', label: 'Team Collaboration', icon: <Users size={32} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '2rem' }}>
      
      {/* Hero Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '3rem', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={16} />
          AI-Powered Test Management
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-color)', lineHeight: 1.2, marginBottom: '1.5rem', maxWidth: '800px' }}>
          <span style={{ color: 'var(--primary)' }}>Smarter Testing.</span><br />
          Faster Releases. Better Quality.
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '700px', lineHeight: 1.6, marginBottom: '2rem' }}>
          TestingBuddy.AI is your intelligent test management companion that helps QA and development teams plan, design, execute, and track testing with the power of AI. Deliver high-quality software with confidence and speed.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/settings')} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '0.5rem' }}>
            <Zap size={20} /> Get Started
          </button>
          <button className="btn btn-outline" disabled style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0', cursor: 'not-allowed' }}>
            <PlayCircle size={20} /> Learn More
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '4rem' }}>
        {features.map((f, i) => (
          <div key={i} className="glass-panel" style={{ flex: '1', minWidth: '220px', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <div style={{ backgroundColor: f.bg, padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              {f.icon}
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: f.icon.props.color }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Banner */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #7e22ce)', borderRadius: '1rem', padding: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', color: 'white', marginTop: 'auto' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ opacity: 0.9 }}>{s.icon}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</span>
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;
