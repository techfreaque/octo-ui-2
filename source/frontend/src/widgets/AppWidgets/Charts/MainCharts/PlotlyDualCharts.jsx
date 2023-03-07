
import { useMemo } from 'react';
import { SplitResizableContent } from '../../../LayoutWidgets/SplitMainContent';
import PlotlyChart, { allChartLocations } from './Plotly';
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
    const containerRefs = { [chartLocations[0]]: mainRef }
    const subChartExist = activeChartLocations.length > 1
    if (subChartExist) {
        containerRefs[chartLocations[1]] = subRef
    }

    useEffect(() => {
        setPlotData(
            plottedElements,
            uiConfig, visibleTimeframes,
            visiblePairs, setCharts, setLayouts)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plottedElements, uiConfig])
    let containerRefsInitialized = chartExist
    const containerRefsDimensions = activeChartLocations.map((chartLocation => {
        const height = containerRefs[chartLocation]?.current?.clientHeight
        const width = containerRefs[chartLocation]?.current?.clientWidth
        containerRefsInitialized = Boolean(containerRefsInitialized && height && width)
        return {
            height: height,
            width: width,
        }
    }))
    containerRefsInitialized = containerRefsDimensions ? containerRefsInitialized : false
    useEffect(() => {
        updateChartDimensions(
            containerRefsInitialized,
            activeChartLocations,
            setLayouts,
            containerRefsDimensions,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(containerRefsDimensions), splitChartsPercent])
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
    containerRefsInitialized,
    activeChartLocations,
    setLayouts,
    containerRefsDimensions,
) {
    // update layout when dimensions change
    if (containerRefsInitialized) {
        activeChartLocations.forEach((chartLocation, index) => {
            setLayouts[chartLocation](prevLayout => {
                const newLayout = { ...prevLayout }
                newLayout.height = containerRefsDimensions[index].height
                newLayout.width = containerRefsDimensions[index].width
                return newLayout
            })
        })
    }
}