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
import ResultGradeCard from '@/pages/studentResults/ResultGradeCard.jsx'

const ResultGradesPage = () => {

          const grades = [6, 7, 8, 9, 10, 11];

  return (
    <>


      
      <div className="flex flex-wrap justify-start gap-8">
        {grades.map((grade) => (
          <ResultGradeCard key={grade} gradeLevel={grade} studentCount={Math.floor(Math.random() * 100) + 50} /> 


          // You'd pass real student counts from your data
        ))}
      </div>


</>
  )

}

export default ResultGradesPage