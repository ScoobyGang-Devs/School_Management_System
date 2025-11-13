import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';




const StudentDatabase = () => {


  return (
    <>

<h1 className="text-4xl font-bold mb-8">Student Database</h1>
      
      <Outlet />
</>
  )
}

export default StudentDatabase