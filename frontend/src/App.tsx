import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AccountCreationPage from './pages/Auth/AccountCreationPage';
import LoginPage from './pages/Auth/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<AccountCreationPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
