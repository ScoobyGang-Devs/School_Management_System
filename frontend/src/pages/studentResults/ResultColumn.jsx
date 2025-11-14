// This is the JavaScript equivalent of the Payment type definition
// It defines the expected shape of your data objects.
export const Payment = {
  id: "string",
  amount: "number",
  status: "pending" || "processing" || "success" || "failed",
  email: "string",
}

// These are the column definitions for the table.
// The array is defined directly without the TypeScript generic type annotation.
export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "exam",
    header: "Exam",
  },
  {
    accessorKey: "result",
    header: "Result",
  },
]