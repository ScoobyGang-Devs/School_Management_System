import React from 'react'
import MyClassCard from './MyClassCard'

const MyClasses = () => {
  const classes = [
    {Grade:6, Class:"A"},
    {Grade:7, Class:"C"},
    {Grade:8, Class:"E"},
    {Grade:10, Class:"A"},
    {Grade:11, Class:"D"}]
  return (
    <div className="flex gap-6 flex-wrap">
      {classes.map((clz,index) => {
        return <MyClassCard Grade={clz.Grade} Class={clz.Class} key={index}/>
      })} 
    </div>
    
        
    
  )
}

export default MyClasses