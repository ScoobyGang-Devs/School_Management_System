import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import request from "@/reqMethods";
import AttendanceResult from "../../components/ui/attendenceResult";

export default function StudentAttendance() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {
      grade: "",
      subClass: "",
    };

  const [date, setDate] = useState("");
  const [resultData, setResultData] = useState(null); // <--- NEW STATE

  const [students, setStudents] = useState([ ]);

 useEffect(() => {
    const grade = user.grade;
    const subclass = user.subClass;

    const fetchStudents = async () => {
      try {
        const res = await request.GET(
          `http://localhost:8000/attendence/student-list/${grade}`,subclass
        );

        if (!res) {
          console.error("Backend returned unexpected data:", res);
          return;
        }

        setStudents(
          res.map((data, ind) => ({
            id: ind + 1,
            name: data.studentName,
            index: data.index,
            present: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Network error or Server error!");
      }
    };

    fetchStudents();
  }, []);

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    );
  };

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("Invalid date!");
      return;
    }

    try {
      const headerObj = {
        className: `${user.grade} ${user.subClass}`,
        date: date,
      };

      const attendanceArray = students.map((s) => ({
        indexNumber: s.index,
        status: s.present ? "present" : "absent",
      }));

      const payload = [headerObj, ...attendanceArray];

      const response = await request.POST(
        "http://localhost:8000//attendence/students/bulk-create/",
        payload
      );

      // Instead of alert → show result form
      setResultData(response);

    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance!");
    }
  };

  // ---------- UI SECTION ----------
  // If attendance submitted → show result UI
  if (resultData) {
    return <AttendanceResult data={resultData} />;
  }

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-lg shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Student Attendance
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Class</span>
              <Input
                value={`${user.grade} ${user.subClass}`}
                readOnly
                className="bg-muted/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Date</span>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-64 border rounded-xl p-3">
            <div className="flex flex-col gap-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center p-3 border rounded-xl"
                >
                  <span className="font-medium w-1/2">{student.name}</span>

                  <span className="font-medium w-1/2 text-center">
                    {student.index}
                  </span>

                  <div className="flex items-center gap-2 w-1/4 justify-end">
                    <Checkbox
                      checked={student.present}
                      onCheckedChange={() => toggleAttendance(student.id)}
                    />
                    <span
                      className={
                        student.present ? "text-green-600" : "text-red-600"
                      }
                    >
                      {student.present ? "Present" : "Absent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Submit Attendance
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
