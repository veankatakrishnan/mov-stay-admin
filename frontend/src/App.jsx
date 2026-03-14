import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthGuard from './components/layout/AuthGuard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import Listings from './pages/Listings';
import Bookings from './pages/Bookings';
import Matches from './pages/Matches';
import Complaints from './pages/Complaints';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="listings" element={<Listings />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="matches" element={<Matches />} />
            <Route path="complaints" element={<Complaints />} />
          </Route>
        </Route>

        {/* Fallback unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
