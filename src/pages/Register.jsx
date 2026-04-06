import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess('Registration simulated successfully! Redirecting...');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="auth-container">
      {/* Visual Identity Side */}
      <div className="auth-image-side position-relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1546410531-ff4cb3cb7361?auto=format&fit=crop&q=80&w=1600" 
          alt="Student reading"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          maxWidth: '80%',
          textAlign: 'right'
        }}>
          <h2 className="fw-bold fs-1 mb-3">Begin Your Journey.</h2>
          <p className="fs-5 opacity-75">Join thousands of students and instructors driving the future of learning.</p>
        </div>
      </div>

      {/* Interactive Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <div className="mb-5">
            <h1 className="fw-bold" style={{color: '#4f46e5'}}>Create Account</h1>
            <p className="text-muted">Register to access the LMS</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
          {success && <div className="alert alert-success shadow-sm border-0">{success}</div>}

          <form onSubmit={handleRegister}>
            
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="floatingName" 
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingName">Full Name</label>
            </div>

            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="floatingEmailR" 
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingEmailR">Email address</label>
            </div>
            
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="floatingPasswordR" 
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPasswordR">Password</label>
            </div>

            <div className="form-floating mb-4">
              <select 
                className="form-select" 
                id="floatingSelect" 
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <label htmlFor="floatingSelect">Desired Role</label>
            </div>

            <button type="submit" className="btn btn-success w-100 py-3 shadow-sm rounded-3 fw-bold fs-6 mb-4">
              Register Now
            </button>
          </form>

          <div className="text-center text-muted">
            <p>Already have an account? <Link to="/login" className="text-decoration-none fw-bold" style={{color: '#059669'}}>Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
