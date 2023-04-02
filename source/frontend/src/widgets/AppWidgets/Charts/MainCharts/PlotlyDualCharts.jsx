
import { useMemo } from 'react';
import { SplitResizableContent } from '../../../LayoutWidgets/SplitMainContent';
import PlotlyChart, { allChartLocations, enableAxisSelect } from './Plotly';
import { usePlotlyLayoutsContext, useUpdatePlotlyLayoutsContext } from './PlotlyContext';
import { useEffect, useState } from 'react';
import { useUiConfigContext } from '../../../../context/config/UiConfigProvider';
import { useVisiblePairsContext } from '../../../../context/config/VisiblePairProvider';
import { useVisibleTimeFramesContext } from '../../../../context/config/VisibleTimeFrameProvider';
import { useBotPlottedElementsContext } from '../../../../context/data/BotPlottedElementsProvider';
import { setPlotData } from './PlotlyGenerateData';
import { useRef } from 'react';

export default function PlotlyDualCharts({ chartLocations = allChartLocations }) {
    const [charts, setCharts] = useState()
    const [splitChartsPercent, setSplitChartsPercent] = useState({ percent: 60, shouldUpdate: false, })
    const layouts = usePlotlyLayoutsContext()
    const setLayouts = useUpdatePlotlyLayoutsContext()
    const plottedElements = useBotPlottedElementsContext()
    const uiConfig = useUiConfigContext()
    const visiblePairs = useVisiblePairsContext();
    const visibleTimeframes = useVisibleTimeFramesContext();
    const mainRef = useRef()
    const subRef = useRef()
    const activeChartLocations = charts ? Object.keys(charts) : []
    const chartExist = activeChartLocations.length > 0
    const subChartExist = activeChartLocations.length > 1
    useEffect(() => {
        setPlotData(
            plottedElements,
            uiConfig, visibleTimeframes,
            visiblePairs, setCharts, setLayouts)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plottedElements, uiConfig])
    useEffect(() => {
        // main chart
        updateChartDimensions(
            activeChartLocations,
            chartLocations[0],
            setLayouts,
            mainRef?.current?.clientHeight,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainRef?.current?.clientHeight, splitChartsPercent])
    useEffect(() => {
        // sub chart
        updateChartDimensions(
            activeChartLocations,
            chartLocations[1],
            setLayouts,
            subRef?.current?.clientHeight
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subRef?.current?.clientHeight, splitChartsPercent])
    useEffect(() => {
        enableAxisSelect()
    }, [charts]);
    return useMemo(() => (subChartExist
        ? <SplitResizableContent
            setPanelPercent={setSplitChartsPercent}
            panelPercent={splitChartsPercent}
            minHeights="0, 0"
            upperContent={
                <div style={{ height: "100%", width: "100%" }} ref={mainRef}>
                    <PlotlyChart
                        chartLocation={chartLocations[0]}
                        setLayouts={setLayouts}
                        layout={layouts[chartLocations[0]]}
                        chartData={charts[chartLocations[0]]}
                    />
                </div>}
            lowerContent={
                <div style={{ height: "100%", width: "100%" }} ref={subRef}>
                    <PlotlyChart
                        chartLocation={chartLocations[1]}
                        setLayouts={setLayouts}
                        layout={layouts[chartLocations[1]]}
                        chartData={charts[chartLocations[1]]}
                    /></div>}
        /> : chartExist &&
        <div style={{ height: "100%", width: "100%" }} ref={mainRef}>
            <PlotlyChart
                chartLocation={chartLocations[0]}
                setLayouts={setLayouts}
                layout={layouts[chartLocations[0]]}
                chartData={charts[chartLocations[0]]}
            /></div>),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [charts, layouts, chartLocations])
}

function updateChartDimensions(
    activeChartLocations,
    chartLocation,
    setLayouts,
    height
) {
    // update layout when dimensions change
    if (activeChartLocations.includes(chartLocation) && height) {
        setLayouts[chartLocation](prevLayout => {
            const newLayout = { ...prevLayout }
            newLayout.height = height
            newLayout.width = window.innerWidth
            return newLayout
        })
    }

}