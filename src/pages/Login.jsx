import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const saved = localStorage.getItem('lms_users');
      const users = saved ? JSON.parse(saved) : [
        { id: 1, name: 'Alice Smith', email: 'alice@lms.com', role: 'INSTRUCTOR', isActive: true },
        { id: 2, name: 'Bob Jones', email: 'bob@lms.com', role: 'STUDENT', isActive: true },
        { id: 3, name: 'Eve Carter', email: 'eve@lms.com', role: 'INSTRUCTOR', isActive: true },
        { id: 4, name: 'Admin Guy', email: 'admin@lms.com', role: 'ADMIN', isActive: true }
      ];

      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        if (!foundUser.isActive) {
          setError('This account has been deactivated by an Admin.');
          return;
        }
        localStorage.setItem('token', 'mock-jwt-token-' + foundUser.id);
        localStorage.setItem('role', foundUser.role);
        
        if (foundUser.role === 'ADMIN') navigate('/admin');
        else if (foundUser.role === 'INSTRUCTOR') navigate('/instructor');
        else navigate('/student');
      } else {
        setError('Email not found. Please register or ask an Admin to provision your account.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const currentUsers = JSON.parse(localStorage.getItem('lms_users')) || [
    { email: 'admin@lms.com', role: 'ADMIN' },
    { email: 'alice@lms.com', role: 'INSTRUCTOR' },
    { email: 'bob@lms.com', role: 'STUDENT' }
  ];

  return (
    <div className="auth-container">
      {/* Visual Identity Side */}
      <div className="auth-image-side position-relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600" 
          alt="Student reading"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          maxWidth: '80%'
        }}>
          <h2 className="fw-bold fs-1 mb-3">Welcome to Continuous Learning.</h2>
          <p className="fs-5 opacity-75">Access your courses, track your progress, and expand your horizons today.</p>
        </div>
      </div>

      {/* Interactive Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <div className="mb-5 text-center">
            <h1 className="fw-bold" style={{color: '#4f46e5'}}>LMS Platform</h1>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control focus-ring focus-ring-indigo" 
                id="floatingEmail" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Email address</label>
            </div>
            
            <div className="form-floating mb-4">
              <input 
                type="password" 
                className="form-control" 
                id="floatingPassword" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 shadow-sm rounded-3 fw-bold fs-6 mb-4">
              Access Dashboard
            </button>
          </form>

          <div className="text-center text-muted">
            <p>Don't have an account? <Link to="/register" className="text-decoration-none fw-bold" style={{color: '#4f46e5'}}>Register here</Link></p>
          </div>

          {/* Quick Mock Access Guide purely for placement demo */}
          <div className="mt-5 p-3 rounded bg-light border border-dashed small">
            <h6 className="fw-bold text-muted mb-2">Simulate Login (Active Users):</h6>
            <div className="d-flex flex-wrap gap-2">
              {currentUsers.filter(u => u.isActive !== false).map((u, idx) => (
                <span 
                  key={idx} 
                  className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : u.role === 'INSTRUCTOR' ? 'bg-info text-dark' : 'bg-primary'}`} 
                  onClick={() => setEmail(u.email)} 
                  style={{cursor:'pointer'}}
                  title={`Login as ${u.role}`}
                >
                  {u.email}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
