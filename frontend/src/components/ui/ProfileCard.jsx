import { Link, useNavigate } from "react-router-dom";

export default function ProfileCard({ onClose }) {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {
      teacherId: "",
      nic_number: "",
      title: "",
      nameWithInitials: "",
      fullName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      address: "",
      enrollmentDate: "",
      mobileNumber: "",
      grade: "",
      subClass: "",
      assignedToClass: "",
    };

  // Create combined fields
  const combinedName =
    user.title && user.nameWithInitials
      ? `${user.title} ${user.nameWithInitials}`
      : null;

  const combinedClass =
    user.grade && user.subClass
      ? `${user.grade} ${user.subClass}`
      : user.grade || user.subClass || null;

  // Convert key-value pairs to show only filled fields, excluding combined ones
  const visibleFields = Object.entries(user).filter(
    ([key, value]) =>
      value &&
      value.trim() !== "" &&
      !["title", "nameWithInitials", "grade", "subClass", "fullName"].includes(
        key
      )
  );

  // Add combined fields if they exist
  if (combinedClass) {
    visibleFields.unshift(["combinedClass", combinedClass]);
  }
  if (combinedName) {
    visibleFields.unshift(["combinedName", combinedName]);
  }

  // Pretty labels for each key
  const fieldLabels = {
    combinedName: "Name",
    combinedClass: "Class",
    teacherId: "Teacher ID",
    nic_number: "NIC Number",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    email: "Email",
    address: "Address",
    enrollmentDate: "Enrollment Date",
    mobileNumber: "Mobile Number",
    assignedToClass: "Assigned To A Class?",
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  // Common button styles
  const btnBase =
    "mt-2 w-full text-center font-medium py-2 rounded-md transition duration-200";

  return (
    <div className="absolute top-14 right-6 bg-white dark:bg-neutral-800 border border-border rounded-xl shadow-2xl p-4 w-72 z-50 animate-fadeIn">
      <h2 className="text-lg font-semibold mb-3 text-center">Profile</h2>

      <div className="space-y-1 text-sm mb-4">
        {visibleFields.map(([key, value]) => (
          <p key={key}>
            <strong>{fieldLabels[key] || key}:</strong> {value}
          </p>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {/* Edit Profile */}
        <Link
          to="/edit-profile"
          onClick={onClose}
          className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white shadow-md`}
        >
          Edit My Profile
        </Link>

        {/* Close */}
        <button
          onClick={onClose}
          className={`${btnBase} border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-neutral-700`}
        >
          Close
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`${btnBase} bg-red-500 hover:bg-red-600 text-white shadow-md`}
        >
          Logout
        </button>
      </div>
    </div>
  );
}