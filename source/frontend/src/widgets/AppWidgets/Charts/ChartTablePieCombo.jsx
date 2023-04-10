import {Radio} from "antd";
import W2uiDataTable from "../Tables/W2uiDataTable";
import PlotlyDualCharts from "./MainCharts/PlotlyDualCharts";
import {sizes} from "../../../constants/frontendConstants";
import {useChartTypeContext, useUpdateChartTypeContext} from "../../../context/config/CurrentChartTypeProvider";
import {useState} from "react";
import { LineChartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { AntIconByReactFunc } from "../../../components/Icons/AntIcon";

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
            label: (<AntIconByReactFunc AntReactIcon={LineChartOutlined} size={sizes.medium}  />),
            value: 'chart',
            // disabled: true
        }, {
            label: (<AntIconByReactFunc AntReactIcon={UnorderedListOutlined} size={sizes.medium} />),
            value: 'table',
            // disabled: true
        },

        // <PieChartOutlined />


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
