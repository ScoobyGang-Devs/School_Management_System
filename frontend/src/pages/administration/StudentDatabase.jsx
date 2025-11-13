import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GradeCard from '@/components/grade-card.jsx'

const StudentDatabase = () => {
  const grades = [6, 7, 8, 9, 10, 11];

  return (
    <>


      <h1 className="text-4xl font-bold mb-8">Student Database</h1>
      
      <div className="flex flex-wrap justify-start gap-8">
        {grades.map((grade) => (
          <GradeCard key={grade} gradeLevel={grade} studentCount={Math.floor(Math.random() * 100) + 50} /> 
          // You'd pass real student counts from your data
        ))}
      </div>


</>
  )
}

export default StudentDatabase