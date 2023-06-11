import {useEffect, useState} from "react";
import PlotlyChart from "../MainCharts/Plotly";
import {createTradingOrBacktestingTab} from "../../Tables/W2uiDataTable";
import AntSidebar from "../../../../components/Sidebars/AntSidebar/AntSidebar";
import useMeasure from "react-use-measure";
export const pieChartName = "pie-chart"
export default function DualPieChart({setLayouts, layouts, charts}) {
    const [containerRef, {
        width,
        height
    }
    ] = useMeasure();
    const [menuItems, setMenuItems] = useState()
    const layout = layouts?.[pieChartName]
    const pieCharts = charts?.[pieChartName]
    useEffect(() => {
        const newMenuItems = generateSidebarMenu({...layout, width, height}, pieCharts, setLayouts)
        setMenuItems(Object.values(newMenuItems))
    }, [height, layout, pieCharts, setLayouts, width])

    return (
        <div ref={containerRef}
            style={
                {
                    width: "100%",
                    height: "100%"
                }
        }>
            <AntSidebar menuItems={menuItems}/>
        </div>
    )
}

function generateSidebarMenu(layout, pieCharts, setLayouts) {
    const newMenuItems = {}
    pieCharts?.forEach(chart => {
        const liveOrBacktest = chart.backtesting_id === undefined ? "live" : "backtesting"
        if (! newMenuItems[liveOrBacktest]) {
            newMenuItems[liveOrBacktest] = createTradingOrBacktestingTab(liveOrBacktest)
        }

        newMenuItems[liveOrBacktest].children.push({
            label: chart.name,
            // antIcon: element.config ?. antIcon,
            // faIcon: element.config ?. faIcon,
            noPadding: true,
            content: (
                <PlotlyChart chartLocation={pieChartName}
                    setLayouts={setLayouts}
                    layout={layout}
                    chartData={
                        [chart]
                    }/>
            )
        })

    })
    return newMenuItems
}
