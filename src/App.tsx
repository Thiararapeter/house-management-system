import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PropertyManagement from './components/PropertyManagement';
import FinancialManagement from './components/FinancialManagement';
import RoomManagement from './components/RoomManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/property-management" element={<PropertyManagement />} />
            <Route path="/financial-management" element={<FinancialManagement />} />
            <Route path="/room-management" element={<RoomManagement />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;