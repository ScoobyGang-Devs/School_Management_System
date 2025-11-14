import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';

const SchoolWideResults = () => {
  return (
    <>

<h1 className="text-4xl font-bold mb-8">Student Results</h1>
      
      <Outlet />
</>
  )
}

export default SchoolWideResults