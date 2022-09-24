// import { useBacktestingRunDataContext } from "../../../context/BacktestingRunDataProvider";
// import { Button, Chip } from "@mui/material";
// import { useBotDomainContext } from "../../../context/BotDomainProvider";
// import { useFetchPlotData } from "../../../context/BotPlottedElementsProvider";
// import { saveTentaclesConfig } from "../../../api/botData";
// import MuiDataTable from "../../../components/Tables/MuiDataTable";

// export default function RunDataTable(props) {
//     const { dimensions, currentPanel } = props;
//     const runData = useBacktestingRunDataContext()
//     const botDomain = useBotDomainContext();
//     const _useFetchPlotData = useFetchPlotData();
//     function restoreSettings(settings) {
//         console.log("test", settings);
//         saveTentaclesConfig(settings, botDomain)
//         _useFetchPlotData()
//     }

//     const columns = []
//     runData && runData.data && runData.data[0]
//         && Object.keys(runData.data[0]).forEach(key => {
//             if (key === "user inputs") {
//                 columns.push({
//                     name: "user inputs",
//                     options: {
//                         filter: true,
//                         customBodyRender: (value, tableMeta, updateValue) => {
//                             return (
//                                 <Button
//                                     value={value}
//                                     index={tableMeta.columnIndex}
//                                     onClick={() => restoreSettings(value)}
//                                 >apply settings</Button>
//                             );
//                         },
//                     }
//                 })
//             } else if (key === "symbols" || key === "time frames") {
//                 columns.push({
//                     name: key,
//                     options: {
//                         filter: true,
//                         customBodyRender: (value, tableMeta, updateValue) => {
//                             return value.map(_key => (<Chip label={_key} />))
//                         },
//                     }
//                 })
//             } else if (key === "end portfolio" || key === "start portfolio") {
//                 columns.push({
//                     name: key,
//                     options: {
//                         filter: true,
//                         customBodyRender: (value, tableMeta, updateValue) => {
//                             const portfolio = JSON.parse(value.replace(/'/g, '"'))
//                             return Object.keys(portfolio).map(key => {
//                                 if (portfolio[key].total || portfolio[key].position) {
//                                     const posLabel = portfolio[key].position ? ` (Position: ${portfolio[key].position})` : "";
//                                     return <Chip label={`${key}: ${portfolio[key].total}${posLabel}`} />
//                                 }
//                                 return <></>
//                             }
//                             );
//                         },
//                     }
//                 })
//             } else if (key === "backtesting files") {
//                 columns.push({
//                     name: key,
//                     options: {
//                         filter: true,
//                         display: false
//                     }
//                 })
//             } else if (key === "end time" || key === "start time" || key === "timestamp") {
//                 columns.push({
//                     name: key,
//                     options: {
//                         filter: true,
//                         customBodyRender: (value, tableMeta, updateValue) => {
//                             const date = new Date(value * 1000)
//                             return <div>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</div>
//                         }
//                     }
//                 })
//             } else {
//                 columns.push(key)
//             }
//         })
//     const options = {
//         onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected,) => {
//             rowsSelected.forEach(row => {
//                 console.log("test22", runData.data[row].id)
//             })
//         },
//         draggableColumns: {
//             enabled: true,
//         },
//         responsive: 'standard',
//         fixedHeader: true,
//         fixedSelectColumn: true,
//         tableBodyHeight: dimensions.main - currentPanel.height - 115 + "px",
//         print: false
//         // filterType: 'checkbox',
//     };
//     return runData && runData.data && runData.data[0] && columns && columns[0] &&
//         (
//             <MuiDataTable
//                 title={"Backtesting Runs"}
//                 data={runData.data}
//                 columns={columns}
//                 options={options}
//             />
//         )
// }