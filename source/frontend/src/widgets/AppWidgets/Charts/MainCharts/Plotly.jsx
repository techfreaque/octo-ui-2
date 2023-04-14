import { useMemo } from 'react';
import Plot from 'react-plotly.js';

export const allChartLocations = ["main-chart", "sub-chart"]

export default function PlotlyChart({ chartLocation, setLayouts, layout, chartData }) {
    const divId = getDivId(chartLocation)

    return useMemo(() => (
        chartData && layout
        && <Plot
            data={chartData}
            layout={{ ...layout }}
            config={getPlotlyConfig()}
            divId={divId}
            onRelayout={(chart) => relayout(chart, chartLocation, setLayouts)}
        />
    ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chartData, layout, divId, chartLocation])
}


function relayout(ed, chartLocation, setLayouts) {
    if (
        Object.entries(ed).length === 0
        // || Object.keys(ed)[0].includes("yaxis")
    ) { return; }
    // setLayouts(prevLayout => {
    const thisChartDiv = document.getElementById(getDivId(chartLocation));
    Object.keys(setLayouts).forEach((otherChartLocation) => {
        if (otherChartLocation !== chartLocation) {
            const chartDiv = document.getElementById(getDivId(otherChartLocation));
            if (chartDiv) {
                const newLayout = { ...chartDiv.layout }
                const x = newLayout.xaxis
                const y = newLayout.yaxis
                const y2 = newLayout.yaxis2
                const y3 = newLayout.yaxis3
                const y4 = newLayout.yaxis4

                if (ed[xAutorange] && ed[yAutorange]) {
                    x.range = []
                    x.range[0] = thisChartDiv.layout.xaxis.maxRange[0]
                    x.range[1] = thisChartDiv.layout.xaxis.maxRange[1]
                    x.autorange = false
                    if (y) {
                        y.autorange = true
                        y.range[0] = undefined
                        y.range[1] = undefined
                    }
                    if (y2) {
                        y2.autorange = true
                        y2.range[0] = undefined
                        y2.range[1] = undefined
                    }
                    if (y3) {
                        y3.autorange = true
                        y3.range[0] = undefined
                        y3.range[1] = undefined
                    }
                    if (y4) {
                        y4.autorange = true
                        y4.range[0] = undefined
                        y4.range[1] = undefined
                    }

                    setLayouts[otherChartLocation](newLayout)
                } else if (ed[xRange0]) {
                    if (otherChartLocation !== chartLocation) {
                    }
                    x.autorange = false
                    x.range = []
                    x.range[0] = ed[xRange0];
                    x.range[1] = ed[xRange1]
                    if (y) {
                        y.autorange = true
                        y.range[0] = undefined
                        y.range[1] = undefined
                    }
                    if (y2) {
                        y2.autorange = true
                        y2.range[0] = undefined
                        y2.range[1] = undefined
                    }
                    if (y3) {
                        y3.autorange = true
                        y3.range[0] = undefined
                        y3.range[1] = undefined
                    }
                    if (y4) {
                        y4.autorange = true
                        y4.range[0] = undefined
                        y4.range[1] = undefined
                    }
                    setLayouts[otherChartLocation](newLayout)
                } else if (ed[yAutorange]) {
                    // x.range = []
                    // x.range[0] = thisChartDiv.layout.xaxis.maxRange[0]
                    // x.range[1] = thisChartDiv.layout.xaxis.maxRange[1]
                    // x.autorange = false
                    // y.autorange = true
                    // y.range[0] = undefined
                    // y.range[1] = undefined

                } else if (ed[yRange0]) {
                    // if (otherChartLocation !== chartLocation) {
                    //     y.autorange = true
                    //     y.range[0] = undefined
                    //     y.range[1] = undefined
                    // } else {
                    //     // y.range[0] = ed[yRange0];
                    //     // y.range[1] = ed[yRange1]
                    // }
                }
            }
        }
        // if (otherChartLocation !== chartLocation) {
        //     //     //     // TODO remove when range isnt messed up anymore

        //     //     //     // y.range[0] = chartDiv.layout.yaxis.range[0]
        //     //     //     // y.range[1] = chartDiv.layout.yaxis.range[1]
        //     //     //     y.autorange = chartDiv.layout.yaxis.autorange

        //     y.autorange = true
        //     y.range[0] = undefined
        //     y.range[1] = undefined
        //     //     delete y.range
        // } else {
        //     y.autorange = false

        // }
    });
    // return newLayouts
    // })
}

const xAutorange = 'xaxis.autorange'
const xRange0 = 'xaxis.range[0]'
const xRange1 = 'xaxis.range[1]'
const yAutorange = 'yaxis.autorange'
const yRange0 = 'yaxis.range[0]'
// const yRange1 = 'yaxis.range[1]'

function getDivId(chartLocation) {
    return "plotly" + chartLocation
}

function getPlotlyConfig() {
    return {
        scrollZoom: true,
        modeBarButtonsToRemove: ["select2d", "lasso2d", "toggleSpikelines"],
        responsive: true,
        showEditInChartStudio: false,
        displaylogo: false // no logo to avoid 'rel="noopener noreferrer"' security issue (see https://webhint.io/docs/user-guide/hints/hint-disown-opener/)
    };
}

export function enableAxisSelect() {
    // allow moving chart for selected y scale layer
    const yaxis_resize_layers = document.getElementsByClassName('nsdrag drag cursor-ns-resize');
    Object.values(yaxis_resize_layers).forEach((yaxis_drag_layer) => {
        if (yaxis_drag_layer.getAttribute('listener') !== 'true') {
            yaxis_drag_layer.addEventListener('click', (e) => {
                yaxis_drag_layer.parentElement.parentElement.append(yaxis_drag_layer.parentElement)
            });
            yaxis_drag_layer.setAttribute('listener', 'true');
        }
    })
}