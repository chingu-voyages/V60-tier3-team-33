import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountCreationPage from './pages/Auth/AccountCreationPage';
import LoginPage from './pages/Auth/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<AccountCreationPage />} />
      </Routes>
    </Router>
  );
}
