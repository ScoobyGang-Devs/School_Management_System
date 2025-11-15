import React from 'react'
import AttendenceCard from '../Attendance/AttendenceCard'

const SchoolWideAttendance = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center sm:items-stretch py-4">

      <AttendenceCard catogery="Student"/>
      <AttendenceCard catogery="Teachers"/>
    </div>
    
  )
}

export default SchoolWideAttendance