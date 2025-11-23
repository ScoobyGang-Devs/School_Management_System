import React, { useState } from "react";
import request from "../../reqMethods.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.userType) newErrors.userType = "Please select the user type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await request.POST(
          "http://localhost:8000/login/",
          {
            username: formData.username,
            password: formData.password,
          }
        );

        if (response && response.access) {
          alert(`✅ Login successful!`);
          localStorage.setItem("access", response.access);
          localStorage.setItem("refresh", response.refresh);
          localStorage.setItem("status",formData.userType);

          const path = formData.userType === "teacher"? "teacher-profile":"admin-profile";
          const header = {"Authorization": `Bearer ${response.access}`}
          const userDetails = await request.GET("http://127.0.0.1:8000", path, header);
          localStorage.setItem("user",userDetails);
          navigate("/"); // Go to dashboard

        } else {
          alert("❌ Username or password is wrong!");
          setFormData({username:"",password:"",userType:""});
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("⚠️ Network or server error. Please try again later.");
        setFormData({username:"",password:"",userType:""});
      }
    }
  };

  const handleSignupClick = () => {
    navigate("/signup"); // Navigate to signup page
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, rgba(200, 200, 200, 0.4), rgba(180, 180, 200, 0.6))",
      backdropFilter: "blur(12px)",
      backgroundAttachment: "fixed",
      color: "#111827",
      overflow: "hidden",
      padding: "2rem",
      boxSizing: "border-box",
    },
    formWrapper: {
      background: "rgba(31, 41, 55, 0.85)",
      color: "#f9fafb",
      borderRadius: "1rem",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(16px) saturate(160%)",
      border: "1px solid rgba(255,255,255,0.1)",
      width: "90%",
      maxWidth: "400px",
      padding: "2rem 1.8rem",
      transformStyle: "preserve-3d",
      transition: "transform 0.4s ease, box-shadow 0.4s ease",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      backgroundColor: "rgba(55, 65, 81, 0.8)",
      color: "#f9fafb",
      outline: "none",
      transition: "all 0.3s ease",
      fontSize: "0.95rem",
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
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
    },
    signupButton: {
      width: "100%",
      padding: "12px 0",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "transparent",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    error: {
      color: "#f87171",
      fontSize: "0.8rem",
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.formWrapper}
        className="hover:[transform:perspective(1000px)_rotateY(4deg)] hover:shadow-2xl"
      >
        <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.username && (
              <span style={styles.error}>{errors.username}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.password && (
              <span style={styles.error}>{errors.password}</span>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium">Login As</label>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="userType"
                  value="teacher"
                  checked={formData.userType === "teacher"}
                  onChange={handleInputChange}
                />
                Teacher
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={formData.userType === "admin"}
                  onChange={handleInputChange}
                />
                Admin
              </label>
            </div>
            {errors.userType && (
              <span style={styles.error}>{errors.userType}</span>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) =>
              (e.target.style.transform = "scale(1.03) translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = "scale(1) translateY(0)")
            }
          >
            Login
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or</span>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="button"
            onClick={handleSignupClick}
            style={styles.signupButton}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.transform = "scale(1.03) translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "scale(1) translateY(0)";
            }}
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;