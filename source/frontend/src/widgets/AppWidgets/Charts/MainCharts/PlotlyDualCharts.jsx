import {useMemo} from 'react';
import {getSplitterClasses} from '../../../LayoutWidgets/SplitMainContent';
import PlotlyChart, {allChartLocations, enableAxisSelect} from './Plotly';
import {useEffect} from 'react';
import "./crosshair.css"
import Crosshair, {handleCrosshairOnMouseEnter, handleCrosshairOnMouseLeave} from './Crosshair';
import useMeasure from 'react-use-measure';
import Splitter, {SplitDirection} from '@devbookhq/splitter'
import {useColorModeContext} from '../../../../context/config/ColorModeProvider';


export default function PlotlyDualCharts({
    chartLocations = allChartLocations,
    charts,
    setLayouts,
    layouts
}) { 
    useEffect(() => {
        enableAxisSelect()
    }, [charts]);

    return useMemo(() => {
        const activeChartLocations = charts ? Object.keys(charts).filter(chart => (allChartLocations.includes(chart))) : []
        const chartExist = activeChartLocations.length > 0
        const subChartExist = activeChartLocations.length > 1
        return (
            <> {
                !window.matchMedia("(pointer: coarse)").matches && (
                    <Crosshair/>)
            }
                {
                subChartExist ? (
                    <DualChart chartLocations={chartLocations}
                        setLayouts={setLayouts}
                        layouts={layouts}
                        charts={charts}/>
                ) : chartExist && (
                    <div style={
                        {
                            height: "100%",
                            width: "100%"
                        }
                    }>
                        <Chart chartLocations={
                                chartLocations[0]
                            }
                            setLayouts={setLayouts}
                            layout={
                                layouts[chartLocations[0]]
                            }
                            chart={
                                charts[chartLocations[0]]
                            }/></div>
                )
            } </>
        )
    }, [charts, chartLocations, setLayouts, layouts])
}


function DualChart({chartLocations, setLayouts, layouts, charts}) {
    const botColorMode = useColorModeContext();
    return useMemo(() => {
        const gutterClassName = Math.random().toString(36).slice(2, 7)
        return (
            <Splitter direction={
                    SplitDirection.Vertical
                }
                initialSizes={
                    [60, 40]
                }
                minHeights={[0, 0]}
                classes={
                    getSplitterClasses(botColorMode)
                }
                gutterClassName={gutterClassName}>
                <div style={
                        {
                            height: "100%",
                            width: "100%"
                        }
                    }
                    onMouseEnter={handleCrosshairOnMouseEnter}
                    onMouseLeave={handleCrosshairOnMouseLeave}>
                    <Chart chartLocation={
                            chartLocations[0]
                        }
                        setLayouts={setLayouts}
                        layout={
                            layouts[chartLocations[0]]
                        }
                        chart={
                            charts[chartLocations[0]]
                        }/>
                </div>
                <div style={
                        {
                            height: "100%",
                            width: "100%"
                        }
                    }
                    onMouseEnter={handleCrosshairOnMouseEnter}
                    onMouseLeave={handleCrosshairOnMouseLeave}>
                    <Chart chartLocation={
                            chartLocations[1]
                        }
                        setLayouts={setLayouts}
                        layout={
                            layouts[chartLocations[1]]
                        }
                        chart={
                            charts[chartLocations[1]]
                        }/>
                </div>
            </Splitter>
        )
    }, [
        botColorMode,
        chartLocations,
        charts,
        layouts,
        setLayouts
    ])

}

function Chart({chartLocation, setLayouts, layout, chart}) {
    const [containerRef, {
            width,
            height
        }
    ] = useMeasure();
    return useMemo(() => (
        <div  style={
                {
                    height: "100%",
                    width: "100%"
                }
            }
            ref={containerRef}>
            <PlotlyChart chartLocation={chartLocation}
                setLayouts={setLayouts}
                layout={
                    {
                        ...layout,
                        width,
                        height
                    }
                }
                chartData={chart}/>
        </div>
    ), [
        chart,
        chartLocation,
        containerRef,
        height,
        layout,
        setLayouts,
        width
    ])
}
