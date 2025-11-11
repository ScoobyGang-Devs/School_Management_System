import { Link } from "react-router-dom";

export default function ProfileCard({ onClose }) {
  const user =
    JSON.parse(localStorage.getItem("user")) || {
      teacherId: "",
      nic_number: "",
      title: "Mr.",
      nameWithInitials: "test",
      fullName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      address: "",
      enrollmentDate: "",
      mobileNumber: "",
      grade: "7",
      subClass: "",
      assignedToClass: "",
    };

  // Create combined fields
  const combinedName = user.title && user.nameWithInitials 
    ? `${user.title} ${user.nameWithInitials}`
    : null;

  const combinedClass = user.grade && user.subClass 
    ? `${user.grade} ${user.subClass}`
    : user.grade || user.subClass || null;

  // Convert key-value pairs to show only filled fields, excluding combined ones
  const visibleFields = Object.entries(user).filter(
    ([key, value]) => 
      value && 
      value.trim() !== "" && 
      !['title', 'nameWithInitials', 'grade', 'subClass','fullName'].includes(key)
  );

  // Add combined fields if they exist
  if (combinedClass) {
    visibleFields.unshift(['combinedClass', combinedClass]);
  }
  if (combinedName) {
    visibleFields.unshift(['combinedName', combinedName]);
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

  return (
    <div className="absolute top-14 right-6 bg-white dark:bg-neutral-800 border border-border rounded-lg shadow-lg p-4 w-72 z-50">
      <h2 className="text-lg font-semibold mb-3">Profile</h2>

      <div className="space-y-1 text-sm">
        {visibleFields.map(([key, value]) => (
          <p key={key}>
            <strong>{fieldLabels[key] || key}:</strong> {value}
          </p>
        ))}
      </div>

      <Link
        to="/edit-profile"
        className="mt-4 inline-block px-3 py-1 border rounded text-center w-full hover:bg-muted"
        onClick={onClose}
      >
        Edit My Profile
      </Link>

      <button
        className="mt-2 px-3 py-1 border rounded w-full hover:bg-muted"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}