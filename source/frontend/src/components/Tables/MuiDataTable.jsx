import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    Alert,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import {useState} from "react"
import {useIsBotOnlineContext} from "../../context/data/IsBotOnlineProvider"


export default function DataTableMui({
    tableData,
    tableColumns,
    tableTitle,
    toolbarContent,
    onActionClick,
    actionTitle,
}) {
    return (
        <Box sx={
            {margin: "1"}
        }>
            <h3 style={
                {
                    marginTop: "15px",
                    marginBottom: "0px",
                    padding: "0"
                }
            }>
                {tableTitle && tableTitle} </h3>
            <div style={
                {float: "right"}
            }>
                {toolbarContent && toolbarContent}</div>
            <TableContainer> {
                (tableData?.length && tableColumns) ? (<Table size="small">
                    <TableHead>
                        <TableRow> {
                            Object.values(tableColumns).map(column => (
                                <TableCell key={
                                    column.title
                                }>
                                    {
                                    column.title
                                }</TableCell>
                            ))
                        }
                            {
                            actionTitle && <TableCell>{actionTitle}</TableCell>
                        } </TableRow>
                    </TableHead>
                    <TableBody> {
                        tableData.map((row, index) => (
                            <TableRow key={index}>
                                {
                                Object.keys(tableColumns).map((columnKey) => (
                                    <TableCell key={columnKey}>
                                        {
                                        row[columnKey]
                                    }</TableCell>
                                ))
                            }
                                {
                                actionTitle && <ActionButton row={row}
                                    onActionClick={onActionClick}/>
                            } </TableRow>
                        ))
                    } </TableBody>
                </Table>) : (tableData?.length ? (<div>{tableTitle}
                    is loading</div>) : (<Alert>No {tableTitle}</Alert>))
            } </TableContainer>
        </Box>
    )
}

function ActionButton({row, onActionClick}) {
    const [isClosing, setIsClosing] = useState()
    const isOnline = useIsBotOnlineContext()
    return (
        <TableCell>
            <Button color="error"
                disabled={
                    isClosing || ! isOnline
                }
                onClick={
                    () => onActionClick(row, setIsClosing)
            }><FontAwesomeIcon icon={faXmark}/></Button>
        </TableCell>
    )
}
