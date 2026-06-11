import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import NotFound from './pages/NotFound';

// If logged in → dashboard; if not → landing page
const RootRedirect = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"           element={<RootRedirect />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/groups/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
          
          {/* Catch-all 404 route */}
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
