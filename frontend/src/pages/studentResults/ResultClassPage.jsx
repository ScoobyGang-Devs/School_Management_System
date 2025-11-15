import { columns} from "./ResultColumn"
import { DataTable } from "./ResultTable"
import ResultButtonBar from "./ExamButton"

function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "240575F",
      name: "Selith Rubasingha",
      exam: "3rd Term Exam",
      result: "97.6%",
    },
    {
      id: "240576A",
      name: "Aisha Perera",
      exam: "3rd Term Exam",
      result: "88.2%",
    },
    {
      id: "240577B",
      name: "Kamal Fernando",
      exam: "3rd Term Exam",
      result: "91.4%",
    },
    {
      id: "240578C",
      name: "Nisha Wijesinghe",
      exam: "3rd Term Exam",
      result: "85.0%",
    },
    {
      id: "240579D",
      name: "Ruwan Silva",
      exam: "3rd Term Exam",
      result: "78.9%",
    },

    // ...
  ]
}

const ResultClassPage = () => {

    const data =  getData()

  return (
    <>
    <ResultButtonBar/>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    </>
  )
}

export default ResultClassPage