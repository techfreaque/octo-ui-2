import MUIDataTable from "mui-datatables";
import "./MuiDataTable.css"

export default function MuiDataTable({ title, data, columns, options }) {
    return (
        <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={options}
            className="mui-tables-custom"
        />)
}