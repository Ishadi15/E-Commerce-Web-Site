import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, error, setError } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let result;
    if (activeTab === 'login') {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    setIsLoading(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-gray-100 transform transition-all duration-300 scale-100 ease-out animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand/Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-black tracking-tighter text-black uppercase">
            FASHION<span className="text-brand-500">STORE</span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-medium">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'text-brand-500 border-brand-500'
                : 'text-gray-400 border-transparent hover:text-gray-700'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'text-brand-500 border-brand-500'
                : 'text-gray-400 border-transparent hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alert Error Box */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-lg text-xs font-semibold mb-4 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-gray-50/50 text-gray-900"
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-gray-50/50 text-gray-900"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-gray-50/50 text-gray-900"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-500 text-white rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-black transition-all active:scale-[0.98] cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : activeTab === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer info switch */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => handleTabChange('register')}
                  className="text-brand-500 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Create one here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => handleTabChange('login')}
                  className="text-brand-500 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
