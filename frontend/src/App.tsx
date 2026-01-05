import { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Report } from './pages/Report';
import { LandingPage } from './pages/LandingPage';
import { AnalysisProvider } from './context/AnalysisContext';

export interface UserInfo {
  name: string;
  email: string;
}

const UserContext = createContext<UserInfo | null>(null);

export const useUser = () => useContext(UserContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleLogin = (user: UserInfo) => {
    setUserInfo(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <UserContext.Provider value={userInfo}>
      <AnalysisProvider>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AnalysisProvider>
    </UserContext.Provider>
  )
}

export default App
