import { columns} from "./ResultColumn"
import { DataTable } from "./ResultTable"

function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Selith Rubasingha",
      exam: "3rd Term Exam",
      result: "97.6%",
    },
    // ...
  ]
}

const ResultClassPage = () => {

    const data =  getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default ResultClassPage