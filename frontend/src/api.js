import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


// (I added a fallback to localhost:8000 just in case .env is missing)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
});

// 2. INTERCEPTOR: I uncommented this so the Token is actually sent!
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); 
    if (token) {
       // Django SimpleJWT expects 'Bearer <token>'
       config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 3. NEW API FUNCTIONS (Add these for your Dashboard) ---

// User Profile (Decides if user is Teacher or Admin)
// api.js

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('teacher-profile/');
    return { role: 'teacher', ...response.data };
  } catch (error) {
    // If the error is 401 (Unauthorized), throw it so App.jsx can redirect to login
    if (error.response && error.response.status === 401) {
        throw error; 
    }
    // If it's 404 (Not Found), it means the user exists but isn't a teacher -> assume Admin
    return { role: 'admin' };
  }
};

// Admin Dashboard Stats
export const fetchAdminDashboard = async () => {
  const response = await api.get('dashboard/admin_dashboard/');
  return response.data;
};

// Teacher Dashboard: Get Classes
export const fetchTeacherClasses = async (teacherId) => {
  // Backend requires POST with teacherId
  const response = await api.post('teacherclassview/', { teacherId: teacherId });
  return response.data;
};

// Teacher Dashboard: Get Attendance
export const fetchTeacherAttendance = async (grade, className) => {
  try {
    const response = await api.get(`attendence/classattendance/${grade}/${className}`);
    return response.data;
  } catch (err) {
    return [];
  }
};

export default api;