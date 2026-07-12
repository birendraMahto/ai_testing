import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { HomePage } from './pages/HomePage';
import { LLMSettingsPage } from './pages/LLMSettingsPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { FollowUpEmailPage } from './pages/FollowUpEmailPage';
import './styles/index.css';
import './styles/components/layout.css';
import './styles/components/common.css';

function App() {
  return (
    <ThemeProvider>
      <ConnectionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/follow-up-email" element={<FollowUpEmailPage />} />
            <Route path="/settings" element={<LLMSettingsPage />} />
          </Routes>
        </Router>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;
