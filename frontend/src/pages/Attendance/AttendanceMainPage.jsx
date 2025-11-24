import React from 'react'
import AttendenceCard from '../Attendance/AttendenceCard'

const SchoolWideAttendance = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full justify-left items-center sm:items-stretch py-4">

      <AttendenceCard catogery="students"/>
      <AttendenceCard catogery="teachers"/>
    </div>
    
  )
}

export default SchoolWideAttendance