import React, { useState } from "react";
import request from "../../reqMethods.jsx";
import { useNavigate } from "react-router-dom";
import { passiveEventSupported } from "@tanstack/react-table";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    nic_number: "",
    password1: "",
    password2: "",
    email:""
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
    if (!formData.nic_number.trim()) newErrors.nic_number = "NIC number is required";
    if (!formData.password1) newErrors.password1 = "Password is required";
    if (!formData.password2) newErrors.password2 = "Please re-enter password";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    //checking validity of the email with REGEX
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
    }

    if (formData.password1 && formData.password2 && formData.password1 !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {

      try {
        const response = await request.POST(
          `http://localhost:8000/signup/teacherprofiles`,  // link eka wens krpn
          {
            username: formData.username,
            nic_number: formData.nic_number,
            password1: formData.password1,
            password2: formData.password2,
            email:formData.email
          }
        );

        if (response.ok) {
          alert(`✅ Signup successful!`);
          navigate("/Dashboard");
        } else {
          alert("❌ Signup failed. Please try again!");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("⚠️ Network or server error. Please try again later.");
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
        <h2 className="text-center text-2xl font-semibold mb-6">Sign Up</h2>
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

          {/* NIC Number */}
          <div>
            <label htmlFor="nic_number" className="block mb-1 text-sm font-medium">
              NIC Number
            </label>
            <input
              type="text"
              id="nic_number"
              name="nic_number"
              placeholder="Enter your NIC number"
              value={formData.nic_number}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.nic_number && (
              <span style={styles.error}>{errors.nic_number}</span>
            )}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password1" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              placeholder="Enter your password"
              value={formData.password1}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.password1 && (
              <span style={styles.error}>{errors.password1}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="password2" className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Re-enter your password"
              value={formData.password2}
              onChange={handleInputChange}
              style={styles.input}
            />
            {errors.password2 && (
              <span style={styles.error}>{errors.password2}</span>
            )}
          </div>


          {/* Submit */}
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
            Sign Up
          </button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 underline cursor-pointer bg-transparent border-none"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;