import { useState } from "react";
import request from "../../reqMethods.jsx"

export default function EditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [formData, setFormData] = useState({
    nic_number: "",
    nameWithInitials: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    address: "",
    enrollmentDate: "",
    mobileNumber: "",
    subClass: "",
    assignedClass: "",
    assignToClass: false, // Add checkbox state
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await request.POST(
        "http://localhost:8000/teacherdetails/", formData
      );

      console.log("Server Response:", result);
      if (result){
        console.log("Profile Updated:", formData);
        alert("Profile saved successfully!");
      }
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

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
          >
            <option value="">Select title</option>
            <option value="Ven.">Ven</option>
            <option value="Mr.">Mr</option>
            <option value="Mrs.">Mrs</option>
            <option value="Miss.">Miss</option>
          </select>
        </div>

        {/* Name With Initials*/}
        <div>
          <label className="block text-sm font-medium mb-1">Name with initials</label>
          <input
            type="text"
            name="nameWithInitials"
            value={formData.nameWithInitials}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
            placeholder="Ex: J.Sinc"
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
            placeholder="Ex: Jonny sinc"
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

        {/* Checkbox for Class Assignment */}
        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="assignToClass"
              checked={formData.assignToClass}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium">Assigned to a class?</span>
          </label>
        </div>

        {/* Conditionally render Section and Assigned Class based on checkbox */}
        {formData.assignToClass && (
          <>
            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <select
        name="assignedClass"
        value={formData.assignedClass}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
      >
        <option value="">Select Grade</option>
        <option value="Grade 1">Grade 1</option>
        <option value="Grade 2">Grade 2</option>
        <option value="Grade 3">Grade 3</option>
        <option value="Grade 4">Grade 4</option>
        <option value="Grade 5">Grade 5</option>
        <option value="Grade 6">Grade 6</option>
        <option value="Grade 7">Grade 7</option>
        <option value="Grade 8">Grade 8</option>
        <option value="Grade 9">Grade 9</option>
        <option value="Grade 10">Grade 10</option>
        <option value="Grade 11">Grade 11</option>
        <option value="Grade 12">Grade 12</option>
        <option value="Grade 13">Grade 13</option>
      </select>
            </div>

            {/* SubClass */}
            <div>
              <label className="block text-sm font-medium mb-1">Sub Class</label>
              <input
                type="text"
                name="subClass"
                value={formData.subClass}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring"
                placeholder="Ex: A"
              />
            </div>
          </>
        )}

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