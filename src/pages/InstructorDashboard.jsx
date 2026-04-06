import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('COURSES');

  const getCourseImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('java')) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80';
    if (t.includes('react')) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=80';
    if (t.includes('machine') || t.includes('ai')) return 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=500&q=80';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random&color=fff&size=400&font-size=0.25&length=2`;
  };

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('lms_courses');
    return saved ? JSON.parse(saved) : [
      { id: 101, title: 'Introduction to Java', instructor: 'Alice Smith' },
      { id: 102, title: 'React Masterclass', instructor: 'Pending' }
    ];
  });

  const [submissions, setSubmissions] = useState([
    { id: 101, studentName: 'Bob Jones', assignment: 'Lab 1', status: 'Submitted', grade: null },
    { id: 102, studentName: 'Charlie Ray', assignment: 'Lab 1', status: 'Graded', grade: '95/100' }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleGrade = (id) => {
    const grade = prompt("Enter Grade / Feedback:");
    if(grade) setSubmissions(submissions.map(s => s.id === id ? { ...s, grade, status: 'Graded' } : s));
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-header">
          LEARNEDU
        </div>
        <div className="sidebar-nav">
          <div className={`sidebar-link ${activeTab === 'COURSES' ? 'active' : ''}`} onClick={() => setActiveTab('COURSES')}>
             📚 My Courses
          </div>
          <div className={`sidebar-link ${activeTab === 'MATERIALS' ? 'active' : ''}`} onClick={() => setActiveTab('MATERIALS')}>
            📄 Upload Materials
          </div>
          <div className={`sidebar-link ${activeTab === 'ASSIGNMENTS' ? 'active' : ''}`} onClick={() => setActiveTab('ASSIGNMENTS')}>
            📝 Manage Assignments
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="mb-3">
            <div className="small text-muted">ACCOUNT</div>
            <div className="fw-bold">Platform Instructor</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">Sign Out</button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="dashboard-content p-4">
        <h2 className="mb-4 fw-bold" style={{color: '#1f2937'}}>Instructor Studio</h2>

        {/* --- COURSES TAB --- */}
        {activeTab === 'COURSES' && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">My Assigned Courses</h5>
            </div>
            <div className="card-body p-4 bg-light">
              <div className="row g-4">
                {courses.length === 0 && <div className="col-12 text-center text-muted p-4">No courses currently available. Wait for Admin assignment.</div>}
                {courses.map(course => (
                  <div key={course.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="course-card">
                      <div className="course-card-img" style={{backgroundImage: `url(${getCourseImage(course.title)})`}}></div>
                      <div className="course-card-body">
                        <div className="course-card-title" title={course.title}>{course.title}</div>
                        <div className="course-card-subtitle mb-2">{course.instructor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- MATERIALS TAB --- */}
        {activeTab === 'MATERIALS' && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
               <h5 className="fw-bold mb-4">Upload Course Materials</h5>
               <form onSubmit={(e) => { e.preventDefault(); alert('Material uploaded successfully to Backend storage!'); }}>
                 <label className="form-label text-muted small fw-bold">Select Parent Course</label>
                 <select className="form-select mb-3" required>
                    <option value="">-- Choose Course --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                 </select>
                 <label className="form-label text-muted small fw-bold">Target File (PDF / Video)</label>
                 <input type="file" className="form-control mb-4" required />
                 <button type="submit" className="btn btn-primary">Execute Material Upload</button>
               </form>
            </div>
          </div>
        )}

        {/* --- ASSIGNMENTS TAB --- */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="row g-4">
            <div className="col-md-5">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold">Create Assignment</h5>
                </div>
                <div className="card-body bg-light">
                  <form onSubmit={(e) => { e.preventDefault(); alert('Assignment broadcasted to Students!'); }}>
                     <select className="form-select mb-2" required>
                        <option value="">-- Choose Target Course --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                     </select>
                     <input type="text" className="form-control mb-2" placeholder="Assignment Title" required />
                     <textarea className="form-control mb-3" placeholder="Assignment Instructions..." rows="3"></textarea>
                     <button type="submit" className="btn btn-success w-100">Publish Assignment</button>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-md-7">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold">Student Submissions</h5>
                </div>
                <div className="card-body p-0">
                   <ul className="list-group list-group-flush">
                     {submissions.map(sub => (
                       <li key={sub.id} className="list-group-item p-4">
                         <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{sub.studentName}</div>
                              <div className="small text-muted">{sub.assignment}</div>
                            </div>
                            <div className="d-flex align-items-center gap-3 mt-3">
                              <button 
                                onClick={() => alert(`Simulating downloaded Answers PDF from ${sub.studentName}`)} 
                                className="btn btn-sm btn-outline-dark fw-bold"
                              >
                                📄 View Submitted Answers
                              </button>

                              <span className={`badge ${sub.status === 'Graded' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {sub.status}
                              </span>
                              {sub.grade ? (
                                <span className="fw-bold px-2 text-success">Score: {sub.grade}</span>
                              ) : (
                                <button onClick={()=>handleGrade(sub.id)} className="btn btn-primary btn-sm px-3 shadow-sm">Enter Grade</button>
                              )}
                            </div>
                         </div>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstructorDashboard;
