import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { Shield, LogOut, UserPlus, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    if (token) setLoggedIn(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setLoggedIn(false);
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow rounded">
        <div className="d-flex align-items-center">
          <div className="p-2 bg-primary text-white rounded me-3">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="h4 mb-0">Student Registration</h1>
            <small className="text-muted">Secure 2-Level Encryption System</small>
          </div>
        </div>
        {loggedIn && (
          <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
            <LogOut className="me-2 w-4 h-4" /> Logout
          </button>
        )}
      </div>

      {/* Main Content */}
      {!loggedIn ? (
        <div className="d-flex justify-content-center">
          <div className="col-md-5">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Student Form */}
          <div className="col-lg-6">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="p-2 bg-success text-white rounded me-2">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h5 className="mb-0">Register New Student</h5>
                </div>
                <StudentForm apiBase={API} />
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="col-lg-6">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="p-2 bg-secondary text-white rounded me-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <h5 className="mb-0">Student Database</h5>
                </div>
                <StudentList apiBase={API} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
