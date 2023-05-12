import {useEffect, useRef, useState} from "react";
import PlotlyChart from "../MainCharts/Plotly";
import {createTradingOrBacktestingTab} from "../../Tables/W2uiDataTable";
import AntSidebar from "../../../../components/Sidebars/AntSidebar/AntSidebar";
export const pieChartName = "pie-chart"
export default function DualPieChart({setLayouts, layouts, charts}) {
    const mainRef = useRef()
    const [menuItems, setMenuItems] = useState()
    const layout = layouts?.[pieChartName]
    const pieCharts = charts?.[pieChartName]
    useEffect(() => { // pie chart
        updateChartDimensions(setLayouts[pieChartName], mainRef?.current?.clientHeight)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        mainRef?.current?.clientHeight,
    ])
    useEffect(() => {
        const newMenuItems = generateSidebarMenu(layout, pieCharts, setLayouts)
        setMenuItems(Object.values(newMenuItems))
    }, [layout, pieCharts, setLayouts])

    return (
        <div ref={mainRef}
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

function updateChartDimensions(setLayout, height) { // update layout when dimensions change
    if (height) {
        setLayout(prevLayout => {
            const newLayout = {
                ...prevLayout
            }
            newLayout.height = height
            newLayout.width = window.innerWidth
            return newLayout
        })
    }

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
