import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AttendanceResult({ data }) {
  if (!data || !data.Created) return null;

  const info = data.Created;

  return (
    <Card className="w-full max-w-md mx-auto mt-4 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Attendance Saved ✔️
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">

        <div className="flex justify-between">
          <span className="font-medium">Class:</span>
          <span>{info.className}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{info.date}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Marked:</span>
          <Badge variant={info.isMarked ? "default" : "secondary"}>
            {info.isMarked ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Present %:</span>
          <span>{info.presentPercentage}%</span>
        </div>

        <div>
          <span className="font-medium">Absent List:</span>

          <ScrollArea className="h-20 mt-2 rounded-md border p-2">
            {info.absentList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No absentees 🎉</p>
            ) : (
              info.absentList.map((id) => (
                <Badge key={id} className="mr-1 mb-1">
                  {id}
                </Badge>
              ))
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
