import W2uiDataTable from "../Tables/W2uiDataTable";
import PlotlyDualCharts from "./MainCharts/PlotlyDualCharts";
import {sizes} from "../../../constants/frontendConstants";
import {useChartTypeContext, useUpdateChartTypeContext} from "../../../context/config/CurrentChartTypeProvider";
import {useState} from "react";
import {LineChartOutlined, PieChartOutlined, SettingOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {AntIconByReactFunc} from "../../../components/Icons/AntIcon";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import { Trans } from "react-i18next";

export const chartTypes = {
    CHART: "chart",
    TABLE: "table",
    PIE: "pie",
    STATS: "stats",
    RUN_ANALYSIS: "runAnalysis"
}

export function ChartTypeSelector() {
    const updateChartType = useUpdateChartTypeContext()
    const chartType = useChartTypeContext()

    const _chartTypes = [
        {
            label: (
                <AntIconByReactFunc AntReactIcon={LineChartOutlined}
                    size={
                        sizes.small
                    }/>
            ),
           
            toolTipText:(<Trans  i18nKey="plotting.switchtotheChartsView" />),
            key: chartTypes.CHART,
            // disabled: true
        },
        {
            label: (
                <AntIconByReactFunc AntReactIcon={PieChartOutlined}
                    size={
                        sizes.small
                    }/>
            ),
            
            toolTipText:(<Trans  i18nKey="plotting.switchToThePieChartView" />),
            key: chartTypes.PIE,
            // disabled: true
        },
        {
            label: (
                <AntIconByReactFunc AntReactIcon={UnorderedListOutlined}
                    size={
                        sizes.small
                    }/>
            ),
            
            toolTipText:(<Trans  i18nKey="plotting.switchtotheTablesView" />),
            key: chartTypes.TABLE,
            // disabled: true
        },
        {
            label: (
                <AntIconByReactFunc AntReactIcon={SettingOutlined}
                    size={
                        sizes.small
                    }/>
            ),
            
            toolTipText:(<Trans  i18nKey="plotting.switchtotheDisplaySettings" />),
            key: chartTypes.RUN_ANALYSIS,
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

    return (
        <RadioButtonGroup menuItems={_chartTypes}
            onChange={updateChartType}
            selected={chartType}
            />
    )
}

export default function ChartTablePieCombo({settingsContent}) {
    const [charts, setCharts] = useState()

    const chartType = useChartTypeContext()
    if (chartType === chartTypes.CHART) {
        return (
            <PlotlyDualCharts charts={charts}
                setCharts={setCharts}/>
        )
    } else if (chartType === chartTypes.TABLE) {
        return (
            <W2uiDataTable/>)
    } else if (chartType === chartTypes.RUN_ANALYSIS) {
        return settingsContent && (<AppWidgets layout={settingsContent}/>)
    }
}
