import React from 'react';
import MyClassCard from './MyClassCard';

const MyClasses = () => {
  // 1. Retrieve the user object from Local Storage
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 2. Extract the teachingClasses array (Default to empty array if missing)
  // Example data: ['6 C', '7 A', '8 C', '9 B']
  const teachingClasses = user.teachingClasses || [];

  return (
    <div className="flex gap-6 flex-wrap">
      {teachingClasses.length > 0 ? (
        teachingClasses.map((classString, index) => {
          // 3. Split the string "6 C" into ["6", "C"]
          const [gradeStr, classStr] = classString.split(' ');

          return (
            <MyClassCard 
              key={index}
              Grade={parseInt(gradeStr)} // Convert "6" to 6 (number)
              Class={classStr}           // "C"
            />
          );
        })
      ) : (
        // Optional: Show a message if no classes are assigned
        <p className="text-gray-500 italic">No classes assigned yet.</p>
      )}
    </div>
  );
};

export default MyClasses;
