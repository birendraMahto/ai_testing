import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Settings, Target, ClipboardList, Bug, ListChecks, FileCheck } from 'lucide-react';

const Sidebar = () => {
  const { toolStatus, llmStatus } = useAppContext();

  const navItems = [
    { name: 'Test Strategy', path: '/strategy', bgColor: '#f3e8ff', borderColor: '#d8b4fe', textColor: '#7e22ce', icon: <Target size={18} /> },
    { name: 'Test Plan', path: '/plan', bgColor: '#fce7f3', borderColor: '#f9a8d4', textColor: '#be185d', icon: <ClipboardList size={18} /> },
    { name: 'Defect Report', path: '/defects', bgColor: '#fffbeb', borderColor: '#fde68a', textColor: '#b45309', icon: <Bug size={18} /> },
    { name: 'Test Cases', path: '/cases', bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#047857', icon: <ListChecks size={18} /> },
    { name: 'Release Note', path: '/release', bgColor: '#f0f9ff', borderColor: '#bae6fd', textColor: '#0369a1', icon: <FileCheck size={18} /> },
  ];

  return (
    <div className="glass-panel" style={{ width: '260px', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--border-color)', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0 }}>
      <div style={{ height: '73px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <img src="/logo.jpg" alt="TestingBuddy.AI Logo" style={{ height: '40px', width: 'auto' }} />
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem 1rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="nav-link-custom"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              border: `1px solid ${isActive ? item.textColor : item.borderColor}`,
              backgroundColor: isActive ? item.textColor : item.bgColor,
              color: isActive ? '#ffffff' : item.textColor,
              boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', padding: '1.5rem 1rem' }}>
        <NavLink 
          to="/settings" 
          className="nav-link-custom"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            border: `1px solid ${isActive ? '#475569' : '#cbd5e1'}`,
            backgroundColor: isActive ? '#475569' : '#f1f5f9',
            color: isActive ? '#ffffff' : '#334155',
            boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
          })}
        >
          <Settings size={18} /> <span>Settings</span>
        </NavLink>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Tool Status</span>
            <span className={`status-indicator ${toolStatus ? 'status-green' : 'status-red'}`}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>LLM Status</span>
            <span className={`status-indicator ${llmStatus ? 'status-green' : 'status-red'}`}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
