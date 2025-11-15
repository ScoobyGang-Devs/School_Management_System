import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';




const SchoolWideAttendance = () => {


  return (
    <>

<h1 className="text-4xl font-bold mb-8">Attendance</h1>
      
      <Outlet />
</>
  )
}

export default SchoolWideAttendance