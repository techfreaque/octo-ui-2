import {Radio} from "antd";
import W2uiDataTable from "../Tables/W2uiDataTable";
import PlotlyDualCharts from "./MainCharts/PlotlyDualCharts";
import {faChartLine, faListUl} from "@fortawesome/free-solid-svg-icons";
import {FaIconByReactFunc} from "../../../components/Icons/FontAwesome";
import {sizes} from "../../../constants/frontendConstants";
import {useChartTypeContext, useUpdateChartTypeContext} from "../../../context/config/CurrentChartTypeProvider";
import {useState} from "react";

export const chartTypes = {
    CHART: "chart",
    TABLE: "table",
    PIE: "pie",
    STATS: "stats"
}

export function ChartTypeSelector() {
    const updateChartType = useUpdateChartTypeContext()
    const chartType = useChartTypeContext()

    const chartTypes = [
        {
            label: (<FaIconByReactFunc icon={faChartLine}
                size={
                    sizes.medium
                }/>),
            value: 'chart',
            // disabled: true
        }, {
            label: (<FaIconByReactFunc icon={faListUl}
                size={
                    sizes.medium
                }/>),
            value: 'table',
            // disabled: true
        },
        // {
        //     label: (<FaIconByReactFunc icon={faChartPie}
        //         size={
        //             sizes.medium
        //         }/>),
        //     value: 'pie',
        //     disabled: true
        // }, {
        //     label: (<FaIconByReactFunc icon={faChartLine}
        //         size={
        //             sizes.medium
        //         }/>),
        //     value: 'stats',
        //     disabled: true
        // },
    ]
    function handleChartLocationChange(event) {
        updateChartType(event.target.value)
    }

    return (<Radio.Group options={chartTypes}
        onChange={handleChartLocationChange}
        value={chartType}
        optionType="button"
        size="large"
        buttonStyle="outlined"/>)
}

export default function ChartTablePieCombo() {
    const [charts, setCharts] = useState()

    const chartType = useChartTypeContext()
    if (chartType === chartTypes.CHART) {
        return (<PlotlyDualCharts charts={charts}
            setCharts={setCharts}/>)
    } else if (chartType === chartTypes.TABLE) {
        return (<W2uiDataTable/>)
    }
}
