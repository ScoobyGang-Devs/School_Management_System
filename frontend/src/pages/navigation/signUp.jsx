import React, { useState } from "react";
import request from "../../reqMethods.jsx";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const SignupForm = () => {

  const [isTeacher, setIsTeacher] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    nic_number: "",
    password1: "",
    password2: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.nic_number.trim()) newErrors.nic_number = "NIC number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password1) newErrors.password1 = "Password is required";
    if (!formData.password2) newErrors.password2 = "Please re-enter password";

    if (formData.password1 !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const responseData = await request.POST(
          `${API_BASE}/signup/`,
          {
            username: formData.username,
            password1: formData.password1,
            password2: formData.password2,
            nic_number: formData.nic_number,
            email: formData.email,
            is_teacher: isTeacher,
          }
        );

        if (responseData) {
          alert("✅ Signup successful!");
          localStorage.setItem("status",isTeacher? "teacher":"admin");
          localStorage.setItem("access",responseData.access);
          localStorage.setItem("refresh",responseData.refresh);

          const path = isTeacher? "teacher-profile":"admin-profile";
          const header = {"Authorization": `Bearer ${responseData.access}`}
          const userDetails = await request.GET(`${API_BASE}`, path, header);
          localStorage.setItem("user",JSON.stringify(userDetails));
          navigate("/");
        } else {
          alert("❌ Signup failed. Try again.");
        }
      } catch (error) {
        alert("⚠️ Server Error or Unauthorized NIC number!");
      }
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, rgba(200,200,200,0.4), rgba(180,180,200,0.6))",
      backdropFilter: "blur(12px)",
      padding: "2rem",
    },
    formWrapper: {
      background: "rgba(31, 41, 55, 0.85)",
      color: "#f9fafb",
      borderRadius: "1rem",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.1)",
      width: "90%",
      maxWidth: "420px",
      padding: "2rem",
    },
    button: {
      width: "100%",
      padding: "12px 0",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(90deg, #2563eb, #3b82f6)",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
      transition: "0.3s",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(55,65,81,0.8)",
      color: "#f9fafb",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>

        <h2 className="text-center text-2xl font-semibold mb-6">
          Choose Account Type
        </h2>

        <div className="flex gap-3 mb-6">
          <button
            style={{
              ...styles.button,
              background: isTeacher
                ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                : "rgba(55,65,81,0.8)",
            }}
            onClick={() => setIsTeacher(true)}
          >
            Teacher
          </button>

          <button
            style={{
              ...styles.button,
              background: !isTeacher
                ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                : "rgba(55,65,81,0.8)",
            }}
            onClick={() => setIsTeacher(false)}
          >
            Admin
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Selected: <b>{isTeacher ? "Teacher" : "Admin"}</b>
        </p>

        <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Username */}
          <div>
            <label>Username</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && <p className="text-red-400">{errors.username}</p>}
          </div>

          {/* NIC */}
          <div>
            <label>NIC Number</label>
            <input
              style={styles.input}
              type="text"
              name="nic_number"
              value={formData.nic_number}
              onChange={handleInputChange}
            />
            {errors.nic_number && <p className="text-red-400">{errors.nic_number}</p>}
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-400">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleInputChange}
            />
            {errors.password1 && <p className="text-red-400">{errors.password1}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleInputChange}
            />
            {errors.password2 && <p className="text-red-400">{errors.password2}</p>}
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>

        </form>
      </div>
    </div>
  );
};

export default SignupForm;
