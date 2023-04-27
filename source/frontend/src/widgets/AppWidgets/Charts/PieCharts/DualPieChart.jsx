import PlotlyChart from "../MainCharts/Plotly";
export const pieChartName = "pie-chart"
export default function DualPieChart({setLayouts, layouts, charts}) {
    return (
        <PlotlyChart chartLocation={pieChartName}
            setLayouts={setLayouts}
            layout={
                layouts?.[pieChartName]
            }
            chartData={
                charts?.[pieChartName]
            }/>
    )
}
