import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin();
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded shadow-sm border p-4">
      <div className="text-center mb-4">
        <div className="bg-primary bg-gradient rounded-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
          <Lock className="text-white" size={32} />
        </div>
        <h2 className="h4 fw-bold text-dark mb-2">
          Welcome Back
        </h2>
        <p className="text-muted small">
          Sign in to access the student portal
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Email Address
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={20} className="text-muted" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Lock size={20} className="text-muted" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-outline-secondary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-100 btn btn-primary mb-3 ${isLoading ? 'disabled' : ''}`}
        >
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        {!isValid && email && password && (
          <div className="alert alert-danger">
            <p className="mb-0 small">
              Please enter a valid email and password (minimum 6 characters)
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-muted small">
            Demo credentials: any valid email and 6+ character password
          </p>
        </div>
      </form>
    </div>
  );
}