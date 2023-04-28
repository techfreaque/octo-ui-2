import { useEffect, useRef } from "react";
import PlotlyChart from "../MainCharts/Plotly";
export const pieChartName = "pie-chart"
export default function DualPieChart({ setLayouts, layouts, charts }) {
    const mainRef = useRef()

    useEffect(() => {
        // pie chart
        updateChartDimensions(setLayouts[pieChartName], mainRef?.current?.clientHeight)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        mainRef?.current?.clientHeight,
    ])
    return (
        <div ref={mainRef}
            style={{ width: "100%", height: "100%"}}
        >
        <PlotlyChart chartLocation={pieChartName}
            setLayouts={setLayouts}
            layout={
                layouts?.[pieChartName]
            }
            chartData={
                charts?.[pieChartName]
            }/>
        </div>
    )
}

function updateChartDimensions(setLayout, height) {
    // update layout when dimensions change
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