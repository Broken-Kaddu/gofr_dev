import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { KYCForm } from './components/KYCForm';
import { PaymentForm } from './components/PaymentForm';
import { LoginForm } from './components/auth/LoginForm';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';
import { WalletOverview } from './components/dashboard/WalletOverview';
import { CurrencyConverter } from './components/dashboard/CurrencyConverter';
import icon from '../assets/icon.png';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && (
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                      <img src ="/assets/icon.png" alt="logo" className="h-8 w-8" />
                    <span className="text-xl font-bold text-indigo-600">
                      GOPay
                      </span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link to="/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/payment" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                      Send Money
                    </Link>
                    <Link to="/kyc" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                      KYC Verification
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/payment" element={<PrivateRoute element={<PaymentForm />} />} />
            <Route path="/kyc" element={<PrivateRoute element={<KYCForm />} />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;