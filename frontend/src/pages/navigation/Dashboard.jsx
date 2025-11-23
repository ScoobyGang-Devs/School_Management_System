import React from 'react';
import AdminDashboard from '../AdminDashboard';
import TeacherDashboard from '../TeacherDashboard';

// CHANGED: Removed all 'fakeRole' logic and window assignments.rely on real API data now.

const Dashboard =({ user }) => {
  // Loading State
  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Loading Dashboard...</div>;
  }

  // Admin View
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Teacher View (Pass the user object so it can access teacherId)
  if (user.role === 'teacher') {
    return <TeacherDashboard user={user} />;
  }

  // Fallback for errors
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold text-red-500">Access Restricted</h2>
      <p className="text-gray-600">No dashboard available for role: {user.role}</p>
    </div>
  );

};

export default Dashboard;




