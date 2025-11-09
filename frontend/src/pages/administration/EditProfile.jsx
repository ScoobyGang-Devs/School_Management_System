import { useState } from "react";
import request from "../../reqMethods.jsx"

export default function EditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [formData, setFormData] = useState({
    teacherId: "",
    nic_number: "",
    firstName: "",
    lastName: "",
    surName: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    address: "",
    enrollmentDate: "",
    mobileNumber: "",
    section: "",
    assignedClass: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Profile Updated:", formData);
    alert("Profile saved successfully!");
    
    try {
    const result = await request.POST(
      "http://localhost:8000/api/update_profile/", formData   // me link eka wens krnna mthk krpaaaan&&&&&&&&&&&&&&&&&
    );

    console.log("Server Response:", result);
    alert("Profile saved successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to save profile.");
  }
};

  const handleCancel = () => {
    // ✅ Reset all fields back to original stored data
    setFormData(storedUser);
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Teacher Profile</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teacher ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Teacher ID</label>
          <input
            type="text"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Auto-generated or enter manually"
          />
        </div>

        {/* NIC Number */}
        <div>
          <label className="block text-sm font-medium mb-1">NIC Number</label>
          <input
            type="number"
            name="nic_number"
            value={formData.nic_number}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter NIC number"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter last name"
          />
        </div>

        {/* Surname */}
        <div>
          <label className="block text-sm font-medium mb-1">Surname</label>
          <input
            type="text"
            name="surName"
            value={formData.surName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter surname"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter full name"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter email"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            rows="2"
            placeholder="Enter address"
          ></textarea>
        </div>

        {/* Enrollment Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Enrollment Date</label>
          <input
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter section"
          />
        </div>

        {/* Assigned Class */}
        <div>
          <label className="block text-sm font-medium mb-1">Assigned Class</label>
          <input
            type="text"
            name="assignedClass"
            value={formData.assignedClass}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Enter assigned class ID or name"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 md:w-40 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 md:w-40 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}