import { Link, useNavigate } from "react-router-dom";

export default function ProfileCard({ onClose }) {
  const navigate = useNavigate();
  
  const status = localStorage.getItem("status");
  const user = JSON.parse(localStorage.getItem("user"));

  // Create combined fields
  let combinedName = null;
  if(!user.nameWithInitials){
    if(user.fullName) combinedName = user.title? `${user.title}. ${user.fullName}`:user.fullName;
    else combinedName = null;
  }
  else{
    if(user.title) combinedName = `${user.title}. ${user.nameWithInitials}`;
    else combinedName = user.nameWithInitials;
  }

  let visibleFields = {
      combinedName: combinedName,
      nic_number: user.nic_number,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: (user.gender && user.gender==="M"? 'Male':"Female"),
      mobileNumber: user.mobileNumber,
      email: user.email,
      enrollmentDate: user.enrollmentDate
    };

  // Pretty labels for each key
  let fieldLabels = {
    combinedName: "Name",
    nic_number: "NIC Number",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    email: "Email",
    address: "Address",
    enrollmentDate: "Enrollment Date",
    mobileNumber: "Mobile Number",
  };

  if(status === 'teacher'){
    visibleFields.section = user.section;
    visibleFields.assignedClass = user.assignedClass;
    visibleFields.teachingClasses = user.teachingClasses.join(", ");
    fieldLabels.section = "Section";
    fieldLabels.assignedClass = "My Class";
    fieldLabels.teachingClasses = "Teaching Classes";
  }
  else{
    visibleFields.position = user.position;
    fieldLabels.position = "Position";
  }

  visibleFields = Object.fromEntries(Object.entries(visibleFields).filter(([key, value]) => {
      if (value === null || value === undefined) return false;
      if (value === "") return false;
      return true;
    })
  );


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
        {Object.entries(visibleFields).map(([key, value]) => (
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