import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('CATALOG');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const getCourseImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('java')) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80';
    if (t.includes('react')) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=80';
    if (t.includes('machine') || t.includes('ai')) return 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=500&q=80';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random&color=fff&size=400&font-size=0.25&length=2`;
  };

  // Mocks
  const [allCourses, setAllCourses] = useState(() => {
    const saved = localStorage.getItem('lms_courses');
    return saved ? JSON.parse(saved) : [
      { id: 101, title: 'Introduction to Java', instructor: 'Alice Smith' },
      { id: 102, title: 'React Masterclass', instructor: 'Pending' }
    ];
  });
  
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([101]);

  const [studentAssignments, setStudentAssignments] = useState([
    { id: 'a1', courseId: 101, title: 'Java Basics Lab', status: 'Not Submitted', grade: null }
  ]);

  const availableCourses = useMemo(() => {
    return allCourses.filter(c => !enrolledCourseIds.includes(c.id));
  }, [allCourses, enrolledCourseIds]);

  const enrolledCourses = useMemo(() => {
    return allCourses.filter(c => enrolledCourseIds.includes(c.id));
  }, [allCourses, enrolledCourseIds]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleEnroll = (courseId) => {
    setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    handleTabChange('DASHBOARD');
  };

  const handleSubmitWork = (e, assigId) => {
    e.preventDefault();
    setStudentAssignments(studentAssignments.map(a => a.id === assigId ? { ...a, status: 'Submitted' } : a));
    alert("Assignment Answer PDF uploaded successfully! Sent to Instructor for grading.");
  };

  const handleDownloadMaterial = (title) => {
    alert(`Simulating downloaded Material PDF: ${title}`);
  };

  const handleDownloadQuestions = (title) => {
    alert(`Simulating downloaded Questions PDF for: ${title}`);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedCourse(null);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-header">
          LEARNEDU
        </div>
        <div className="sidebar-nav">
          <div className={`sidebar-link ${activeTab === 'CATALOG' ? 'active' : ''}`} onClick={() => handleTabChange('CATALOG')}>
            📖 Browse Courses
          </div>
          <div className={`sidebar-link ${activeTab === 'DASHBOARD' ? 'active' : ''}`} onClick={() => handleTabChange('DASHBOARD')}>
            📚 My Courses
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="mb-3">
            <div className="small text-muted">ACCOUNT</div>
            <div className="fw-bold">Platform Student</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">Sign Out</button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="dashboard-content p-4">
        <h2 className="mb-4 fw-bold" style={{color: '#1f2937'}}>Student Portal</h2>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'DASHBOARD' && (
          <div className="mb-4">
            {selectedCourse ? (
              <div className="course-hub-view">
                <button 
                  className="btn btn-sm btn-outline-secondary mb-4" 
                  onClick={() => setSelectedCourse(null)}
                >
                  &larr; Back to My Courses
                </button>
                <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                  <div className="course-card-img" style={{height: '180px', backgroundImage: `url(${getCourseImage(selectedCourse.title)})`, backgroundPosition: 'center', backgroundSize: 'cover'}}></div>
                  <div className="card-body p-4 bg-white">
                    <h3 className="fw-bold mb-1">{selectedCourse.title}</h3>
                    <p className="text-muted">Instructor: {selectedCourse.instructor}</p>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Materials Section */}
                  <div className="col-md-5">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold">Study Materials</h5>
                      </div>
                      <div className="card-body bg-light">
                        <div className="d-flex flex-column gap-3">
                          <button onClick={() => handleDownloadMaterial('Syllabus_Overview.pdf')} className="btn btn-light border text-start d-flex align-items-center justify-content-between p-3 shadow-sm">
                            <span className="fw-bold text-dark">📄 Syllabus Overview.pdf</span>
                            <span className="text-primary small fw-bold">Download</span>
                          </button>
                          <button onClick={() => handleDownloadMaterial('Chapter_1_Notes.pdf')} className="btn btn-light border text-start d-flex align-items-center justify-content-between p-3 shadow-sm">
                            <span className="fw-bold text-dark">📄 Chapter 1 Notes.pdf</span>
                            <span className="text-primary small fw-bold">Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignments Section */}
                  <div className="col-md-7">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold">Home Assignments</h5>
                      </div>
                      <div className="card-body">
                        {studentAssignments.filter(a => a.courseId === selectedCourse.id).length === 0 && (
                          <div className="text-muted p-4 text-center">No assignments posted.</div>
                        )}
                        {studentAssignments.filter(a => a.courseId === selectedCourse.id).map(assig => (
                          <div key={assig.id} className="assignment-item border rounded p-4 mb-3 bg-light shadow-sm">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="fw-bold fs-5 mb-1">{assig.title}</h6>
                                <span className={`badge ${assig.status === 'Graded' ? 'bg-success' : assig.status === 'Submitted' ? 'bg-primary' : 'bg-danger'}`}>
                                  Status: {assig.status}
                                </span>
                                {assig.grade && <span className="ms-2 fw-bold text-success fs-6">Score: {assig.grade}</span>}
                              </div>
                              <button 
                                onClick={() => handleDownloadQuestions(assig.title)} 
                                className="btn btn-sm btn-outline-dark fw-bold shadow-sm"
                              >
                                📥 Download Questions PDF
                              </button>
                            </div>

                            {assig.status === 'Not Submitted' && (
                              <div className="mt-4 pt-3 border-top">
                                <label className="form-label small fw-bold text-muted">Upload Assignment Answers (PDF)</label>
                                <form onSubmit={(e) => handleSubmitWork(e, assig.id)} className="d-flex gap-2">
                                  <input type="file" className="form-control" accept=".pdf" required />
                                  <button className="btn btn-primary px-4 fw-bold shadow-sm" type="submit">Upload Answers</button>
                                </form>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold">My Enrolled Courses</h5>
                </div>
                <div className="card-body p-4 bg-light">
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center text-muted p-5">You are not enrolled in any courses yet.</div>
                  ) : (
                    <div className="row g-4">
                      {enrolledCourses.map(course => (
                        <div key={course.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                          <div className="course-card" onClick={() => setSelectedCourse(course)}>
                            <div className="course-card-img" style={{backgroundImage: `url(${getCourseImage(course.title)})`}}></div>
                            <div className="course-card-body">
                              <div className="course-card-title" title={course.title}>{course.title}</div>
                              <div className="course-card-subtitle">{course.instructor}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- CATALOG TAB --- */}
        {activeTab === 'CATALOG' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">Available Courses</h5>
            </div>
            <div className="card-body p-4 bg-light">
              <div className="row g-4">
                {availableCourses.length === 0 && <div className="col-12 text-center text-muted p-4">You are enrolled in all currently available courses!</div>}
                {availableCourses.map(course => (
                  <div key={course.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="course-card">
                      <div className="course-card-img" style={{backgroundImage: `url(${getCourseImage(course.title)})`}}></div>
                      <div className="course-card-body">
                        <div className="course-card-title" title={course.title}>{course.title}</div>
                        <div className="course-card-subtitle mb-3">{course.instructor}</div>
                        <button 
                          className="btn btn-outline-primary btn-sm w-100 mt-auto fw-bold shadow-sm"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
