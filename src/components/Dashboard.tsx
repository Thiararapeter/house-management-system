import React from 'react';
import { Link } from 'react-router-dom';
import { Home, DollarSign, Key } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/property-management"
                className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <Home className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4 text-lg font-medium text-gray-900">Property Management</div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Manage properties, owners, and caretakers
                </div>
              </Link>
              <Link
                to="/financial-management"
                className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4 text-lg font-medium text-gray-900">Financial Management</div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Track rent payments, expenses, and generate reports
                </div>
              </Link>
              <Link
                to="/room-management"
                className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <Key className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4 text-lg font-medium text-gray-900">Room Management</div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Manage rooms, tenants, and occupancy
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;