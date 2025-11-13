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

const GradesPage = () => {

          const grades = [6, 7, 8, 9, 10, 11];

  return (
    <>


      
      <div className="flex flex-wrap justify-start gap-8">
        {grades.map((grade) => (
          <GradeCard key={grade} gradeLevel={grade} studentCount={Math.floor(Math.random() * 100) + 50} /> 


          // You'd pass real student counts from your data
        ))}
      </div>


</>
  )

}

export default GradesPage