import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Mocks
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Alice Smith', email: 'alice@lms.com', role: 'INSTRUCTOR', isActive: true },
      { id: 2, name: 'Bob Jones', email: 'bob@lms.com', role: 'STUDENT', isActive: true },
      { id: 3, name: 'Eve Carter', email: 'eve@lms.com', role: 'INSTRUCTOR', isActive: true },
      { id: 4, name: 'Admin Guy', email: 'admin@lms.com', role: 'ADMIN', isActive: true }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('lms_users', JSON.stringify(users));
  }, [users]);

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('lms_courses');
    return saved ? JSON.parse(saved) : [
      { id: 101, title: 'Introduction to Java', instructor: 'Alice Smith' },
      { id: 102, title: 'React Masterclass', instructor: 'Pending' }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('lms_courses', JSON.stringify(courses));
  }, [courses]);
  
  // Dynamically calculate enrollments based on number of active students
  const totalEnrollments = users.filter(u => u.role === 'STUDENT').length; 

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'STUDENT', isActive: true });
  const [newCourse, setNewCourse] = useState({ title: '', instructor: 'Pending' });

  const instructors = useMemo(() => users.filter(u => u.role === 'INSTRUCTOR' && u.isActive), [users]);

  // Methods
  const handleAssignRole = (id, newRole) => setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  const handleToggleActive = (id) => setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  
  const handleAddUser = (e) => {
    e.preventDefault();
    if(newUser.name) { setUsers([...users, { id: Date.now(), ...newUser }]); setNewUser({ name: '', email: '', role: 'STUDENT', isActive: true }); }
  };
  
  const handleAddCourse = (e) => {
    e.preventDefault();
    if(newCourse.title) { setCourses([...courses, { id: Date.now(), ...newCourse }]); setNewCourse({ title: '', instructor: 'Pending' }); }
  };
  const handleDeleteCourse = (id) => setCourses(courses.filter(c => c.id !== id));
  
  const handleAssignInstructor = (courseId, instructorName) => {
    setCourses(courses.map(c => c.id === courseId ? { ...c, instructor: instructorName } : c));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-header">
          LEARNEDU
        </div>
        <div className="sidebar-nav">
          <div className={`sidebar-link ${activeTab === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setActiveTab('OVERVIEW')}>
            📊 Dashboard Overview
          </div>
          <div className={`sidebar-link ${activeTab === 'USERS' ? 'active' : ''}`} onClick={() => setActiveTab('USERS')}>
            👥 Manage Users
          </div>
          <div className={`sidebar-link ${activeTab === 'COURSES' ? 'active' : ''}`} onClick={() => setActiveTab('COURSES')}>
            📚 Platform Courses
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="mb-3">
            <div className="small text-muted">ACCOUNT</div>
            <div className="fw-bold">System Manager</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">Sign Out</button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="dashboard-content p-4">
        <h2 className="mb-4 fw-bold" style={{color: '#1f2937'}}>Admin Dashboard</h2>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'OVERVIEW' && (
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-primary border-5 h-100 py-2">
                <div className="card-body">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">Total Users</div>
                  <div className="h2 mb-0 fw-bold text-gray-800">{users.length}</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-success border-5 h-100 py-2">
                <div className="card-body">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">Active Courses</div>
                  <div className="h2 mb-0 fw-bold text-gray-800">{courses.length}</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-warning border-5 h-100 py-2">
                <div className="card-body">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">Total Enrollments</div>
                  <div className="h2 mb-0 fw-bold text-gray-800">{totalEnrollments}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'USERS' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">User Directory</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive mb-4">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Assign Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="fw-medium">{user.name}</td>
                        <td className="text-muted">{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : user.role === 'INSTRUCTOR' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.isActive ? 
                            <span className="badge bg-success bg-opacity-75">Active</span> : 
                            <span className="badge bg-secondary bg-opacity-75">Deactivated</span>
                          }
                        </td>
                        <td>
                          <select className="form-select form-select-sm w-auto" value={user.role} onChange={(e) => handleAssignRole(user.id, e.target.value)}>
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => handleToggleActive(user.id)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold mb-3 text-primary">+ Provision New User</h6>
                <form className="row g-2 align-items-center" onSubmit={handleAddUser}>
                  <div className="col-md-4"><input type="text" className="form-control" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required/></div>
                  <div className="col-md-4"><input type="email" className="form-control" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required/></div>
                  <div className="col-md-2">
                    <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                      <option value="STUDENT">Student</option><option value="INSTRUCTOR">Instructor</option><option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Add User</button></div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- COURSES TAB --- */}
        {activeTab === 'COURSES' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">Platform Courses Oversight</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-4">
                {courses.length === 0 && <li className="list-group-item text-muted">No courses available.</li>}
                {courses.map(course => (
                  <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center p-3 border rounded mb-2 flex-wrap gap-2">
                    <div>
                      <h6 className="mb-1 fw-bold">{course.title}</h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="small fw-bold text-muted">Instructor: </span>
                        <select 
                          className="form-select form-select-sm" 
                          value={course.instructor}
                          onChange={(e) => handleAssignInstructor(course.id, e.target.value)}
                          style={{width:'auto'}}
                        >
                          <option value="Pending">-- Unassigned --</option>
                          {instructors.map(inst => (
                            <option key={inst.id} value={inst.name}>{inst.name}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-sm btn-danger shadow-sm">Delete Course</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold mb-3 text-success">+ Add Global Course</h6>
                <form onSubmit={handleAddCourse} className="d-flex gap-2">
                  <input type="text" className="form-control" placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required/>
                  <button type="submit" className="btn btn-success px-4">Publish</button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
