import React, { useEffect } from 'react';
import AdminDashboard from '../AdminDashboard';
import TeacherDashboard from '../TeacherDashboard';

// Simulate role from backend (replace with real backend logic later)
const fakeRole = 'admin'; // Change to 'teacher' to test teacher dashboard

// Set role globally for sidebar and other components
if (typeof window !== 'undefined') {
  window.fakeRole = fakeRole;
}

const Dashboard = () => {
  useEffect(() => {
    window.fakeRole = fakeRole;
  }, []);
  if (fakeRole === 'admin') {
    return <AdminDashboard />;
  }
  if (fakeRole === 'teacher') {
    return <TeacherDashboard />;
  }
  return <div className="p-8 text-center">No dashboard available for this role.</div>;
};

export default Dashboard;