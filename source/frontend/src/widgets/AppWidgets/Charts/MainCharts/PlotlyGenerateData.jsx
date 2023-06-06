import {ALL_PLOT_SOURCES, CANDLES_PLOT_SOURCES, DISPLAY_SETTINGS_KEY, GRAPHS_KEY} from '../../../../constants/backendConstants';


export function setPlotData(plottedElements, uiConfig, visibleTimeframes, visiblePairs, setCharts, setLayouts) {
    if (!(plottedElements.live || plottedElements.backtesting)) {
        return;
    }
    const layouts = {}
    const chartsInfo = {
        maxRange: {
            start: undefined,
            end: undefined
        },
        chartsWithData: {}
    }
    const plotData = formatplottedData(plottedElements, uiConfig, visibleTimeframes, visiblePairs, layouts, chartsInfo)
    const plotDataToStore = {}
    let hasCharts = false
    const start = chartsInfo.maxRange.start && formatAsRangeTime(chartsInfo.maxRange.start)
    const end = chartsInfo.maxRange.end && formatAsRangeTime(chartsInfo.maxRange.end)
    Object.keys(setLayouts).forEach(thisChartLocation => {
        if (chartsInfo.chartsWithData[thisChartLocation]) {
            layouts[thisChartLocation].xaxis.range = [start, end]
            layouts[thisChartLocation].xaxis.maxRange = [start, end]
            setLayouts[thisChartLocation](layouts[thisChartLocation])
            plotDataToStore[thisChartLocation] = plotData[thisChartLocation]
            hasCharts = true
            return;
        } else if (thisChartLocation === "pie-chart" && plotData[thisChartLocation]) {
            setLayouts[thisChartLocation]({
                ...layouts[thisChartLocation],
                grid: {
                    rows: 1,
                    columns: 2
                }
            })
            plotDataToStore[thisChartLocation] = plotData[thisChartLocation]
            hasCharts = true
        } else {
            setLayouts[thisChartLocation]()
        }
    })
    if (hasCharts) {
        setCharts(plotDataToStore)
    } else {
        setCharts()
    }
}

function setLayout(layouts, layout, chartLocation) {
    layouts[chartLocation] = layout
}

function getOrGenerateLayout(layouts, uiConfig, chartLocation) {
    if (layouts[chartLocation]) {
        return layouts[chartLocation]
    }
    const layout = {
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 30,
            t: 0,
            pad: 0
        },
        showlegend: true,
        legend: {
            x: 0.01,
            xanchor: 'left',
            y: 0.99,
            yanchor: "top"
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        dragmode: "pan",
        font: {
            color: "#b2b5be"
        },
        width: window.innerWidth
    };
    if (uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_unified_tooltip) {
        layout.hovermode = "x unified";
        layout.hoverlabel = {
            bgcolor: "#131722",
            bordercolor: "#2a2e39"
        };
    } else {
        layout.hovermode = false;
    }
    return layout;
}


function formatplottedData(plottedElements, uiConfig, visibleTimeframes, visiblePairs, layouts, chartsInfo) {
    const plotData = {}
    plottedElements && Object.keys(plottedElements).forEach((liveOrBacktest) => {
        if (liveOrBacktest === "backtesting") {
            plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((optimizerCampaign) => {
                plottedElements[liveOrBacktest][optimizerCampaign] && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign]).forEach((optimizerId) => {
                    plottedElements[liveOrBacktest][optimizerCampaign][optimizerId] && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign][optimizerId]).forEach((backtestingId) => {
                        formatSubData({
                            subElements: plottedElements[liveOrBacktest][optimizerCampaign][optimizerId][backtestingId],
                            backtestingId,
                            optimizerCampaign,
                            optimizerId,
                            uiConfig,
                            plotData,
                            layouts,
                            visibleTimeframes,
                            visiblePairs,
                            chartsInfo
                        })
                    })
                })
            })
        } else if (liveOrBacktest === "live") {
            plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((liveId) => {
                formatSubData({
                    subElements: plottedElements[liveOrBacktest][liveId],
                    liveId,
                    uiConfig,
                    layouts,
                    plotData,
                    visibleTimeframes,
                    visiblePairs,
                    chartsInfo
                })
            })
        }
    })
    return plotData
}

function formatSubData({
    subElements,
    liveId,
    backtestingId,
    optimizerCampaign,
    optimizerId,
    uiConfig,
    layouts,
    plotData,
    visibleTimeframes,
    visiblePairs,
    chartsInfo
}) {
    subElements && Object.keys(subElements).forEach((pair) => {
        if (pair === visiblePairs) {
            subElements[pair] && Object.keys(subElements[pair]).forEach((timeframe) => {
                if (timeframe !== visibleTimeframes) {
                    return;
                }
                const chartIdentifier = backtestingId ? optimizerId ? `${backtestingId}:${optimizerId} - ${optimizerCampaign}` : `${backtestingId} - ${optimizerCampaign}` : `live ${liveId}`;
                const thisData = subElements[pair][timeframe]?.data?.sub_elements;
                thisData?.forEach((sub_element) => {
                    if (sub_element.type !== "chart") {
                        return;
                    }
                    const chartLocation = sub_element.name
                    if (!plotData[chartLocation]) {
                        plotData[chartLocation] = []
                    }
                    const layout = getOrGenerateLayout(layouts, uiConfig, chartLocation)
                    let yAxisId = 1
                    let xAxisId = 1;
                    sub_element?.data?.elements?.forEach((chartDetails) => {
                        if (chartDetails.own_yaxis && yAxisId < 4) {
                            yAxisId++;
                        }
                        if (chartDetails.own_xaxis && xAxisId < 2) {
                            xAxisId++;
                        }
                        createAxisIfNotExists("y", yAxisId, layout, uiConfig, chartDetails)
                        createAxisIfNotExists("x", xAxisId, layout, uiConfig, chartDetails)
                        _createCharts({
                            chartDetails,
                            plotData,
                            yAxisId,
                            xAxisId,
                            layout,
                            backtestingId,
                            optimizerId,
                            optimizerCampaign,
                            chartIdentifier,
                            uiConfig,
                            chartsInfo,
                            chartLocation
                        });
                    })
                    setLayout(layouts, layout, chartLocation)
                })
            })
        }
    })
}


function _createCharts({
    chartDetails,
    plotData,
    yAxisId,
    xAxisId,
    backtestingId,
    optimizerId,
    optimizerCampaign,
    chartIdentifier,
    uiConfig,
    chartsInfo,
    chartLocation
}) {
    if (chartDetails.x === null) {
        if (chartDetails.values) {
            plotData[chartLocation].push(_createPieChartElement({
                chartsInfo,
                chartDetails,
                chartIdentifier,
                backtestingId,
                optimizerId,
                optimizerCampaign
            }))
        }
        return
    }
    if (chartDetails.kind === "candlestick" && displayCandlesAsLines(chartDetails.x.length, uiConfig)) {
        chartDetails.kind = "scattergl";
        chartDetails.mode = "line";
        const originTitle = chartDetails.title;
        const displayedCandlesSources = getDisplayedCandlesLinesSources(uiConfig);
        CANDLES_PLOT_SOURCES.forEach(plotSource => {
            if (! displayedCandlesSources.includes(plotSource)) {
                return;
            }
            chartDetails.y = chartDetails[plotSource];
            chartDetails.title = `${originTitle} [${plotSource}]`
            plotData[chartLocation].push(_createChartedElement({
                chartDetails,
                yAxisId,
                xAxisId,
                backtestingId,
                optimizerId,
                optimizerCampaign,
                chartIdentifier,
                plotOnlyY: true,
                chartsInfo,
                chartLocation
            }));
        })
        return;
    }
    plotData[chartLocation].push(_createChartedElement({
        chartDetails,
        yAxisId,
        xAxisId,
        backtestingId,
        optimizerId,
        optimizerCampaign,
        chartIdentifier,
        plotOnlyY: false,
        chartsInfo,
        chartLocation
    }));
}

function displayCandlesAsLines(candlesCount, uiConfig) {
    const default_max_candles_before_lines = 5000;
    const settings = uiConfig?.[DISPLAY_SETTINGS_KEY];
    if (typeof settings !== "undefined" && typeof settings[GRAPHS_KEY] !== "undefined") {
        return candlesCount > Number(settings[GRAPHS_KEY].max_candles_before_line_display);
    }
    return candlesCount > default_max_candles_before_lines;

}
function getDisplayedCandlesLinesSources(uiConfig) {
    const default_max_candles_line_sources = ["close"];
    const settings = uiConfig[DISPLAY_SETTINGS_KEY];
    if (typeof settings !== "undefined" && typeof settings[GRAPHS_KEY] !== "undefined") {
        return settings[GRAPHS_KEY].max_candles_line_sources;
    }
    return default_max_candles_line_sources;
}

function _createPieChartElement({
    chartDetails,
    chartIdentifier,
    backtestingId,
    optimizerId,
    optimizerCampaign
}) {
    return {
        type: chartDetails.kind,
        labels: chartDetails.labels,
        values: chartDetails.values,
        text: chartDetails.text,
        name: `${
            chartDetails.title
        } (${chartIdentifier})`,
        user_title: chartDetails.title,
        backtesting_id: backtestingId,
        optimizer_id: optimizerId,
        hole: chartDetails.hole,
        textposition: 'inside',
        campaign_name: optimizerCampaign
    }
}
function _createChartedElement({
    chartDetails,
    yAxisId,
    xAxisId,
    backtestingId,
    optimizerId,
    optimizerCampaign,
    chartIdentifier,
    plotOnlyY,
    chartsInfo,
    chartLocation
}) {
    const chartedElement = {
        x: chartDetails.x,
        mode: chartDetails.mode,
        type: chartDetails.kind,
        text: chartDetails.text,
        name: `${
            chartDetails.title
        } (${chartIdentifier})`,
        user_title: chartDetails.title,
        backtesting_id: backtestingId,
        optimizer_id: optimizerId,
        campaign_name: optimizerCampaign,
        line: {
            shape: chartDetails.line_shape,
            color: chartDetails.color?.[0],
        },
        marker: {}
    }
    MARKER_ATTRIBUTES.forEach((attribute) => {
        if (chartDetails[attribute] !== null) {
            chartedElement.marker[attribute] = chartDetails[attribute];
        }
    });
    if (plotOnlyY) {
        chartedElement.y = chartDetails.y;
    } else {
        ALL_PLOT_SOURCES.forEach((element) => {
            if (chartDetails[element] !== null) {
                chartedElement[element] = chartDetails[element]
            }
        })
    }
    if (xAxisId > 1) {
        chartedElement.xaxis = `x${xAxisId}`
    }
    if (yAxisId > 1) {
        chartedElement.yaxis = `y${yAxisId}`
    }
    _logChartsInfo(chartsInfo, chartedElement, chartLocation)
    return chartedElement;
}

const MARKER_ATTRIBUTES = [
    "color",
    "size",
    "opacity",
    "line",
    "symbol"
];

function _logChartsInfo(chartsInfo, chartedElement, chartLocation) {
    if (! chartsInfo.chartsWithData[chartLocation]) {
        chartsInfo.chartsWithData[chartLocation] = true
    }
    // log max range
    const lastIndex = chartedElement.x.length - 1
    if (chartsInfo.maxRange.start) {
        chartsInfo.maxRange.start = chartsInfo.maxRange.start < chartedElement.x[0] ? chartsInfo.maxRange.start : chartedElement.x[0]
        chartsInfo.maxRange.end = chartsInfo.maxRange.end > chartedElement.x[lastIndex] ? chartsInfo.maxRange.end : chartedElement.x[lastIndex]
    } else {
        chartsInfo.maxRange = {
            start: chartedElement.x[0],
            end: chartedElement.x[lastIndex]
        }
    }
}

function getYAxisKey(yAxis, axisType) {
    return yAxis === 1 ? `${axisType}axis` : `${axisType}axis${yAxis}`;
}

function createAxisIfNotExists(axisType, axisId, layout, uiConfig, chartDetails) {
    const axisKey = getYAxisKey(axisId, axisType)
    if (! layout[axisKey]) {
        layout[axisKey] = getAxisTemplate(axisKey, uiConfig, axisType, chartDetails)
    }
}

function formatAsRangeTime(timestamp) {
    return new Date(timestamp - (new Date(timestamp).getTimezoneOffset() * 60_000)).toISOString().substr(0, 19).replace('T', ' ');
}

function getAxisTemplate(axisKey, uiConfig, axisType, chartDetails) {
    const axis = axisTemplate[axisKey]
    if (axisType === "x" && chartDetails.x_type !== null) {
        axis.type = chartDetails.x_type;
    } else if (axisType === "y") {
        axis.type = uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_use_log_scale === true ? "log" : "linear";
    }
    return axis
}

const axisTemplate = {
    xaxis: {
        type: 'date',
        autorange: true,
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        rangeslider: {
            visible: false
        },
        showspikes: false,
        domain: [0.02, 0.98]
    },
    xaxis2: {
        type: 'date',
        autorange: true,
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        rangeslider: {
            visible: false
        },
        domain: [
            0.02, 0.98
        ],
        side: 'top',
        overlaying: "x",
        showspikes: false
    },
    yaxis: {
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        fixedrange: false,
        anchor: "free",
        overlaying: "y",
        side: 'left',
        position: 0,
        autorange: true,
        showspikes: false
    },
    yaxis2: {
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        fixedrange: false,
        anchor: "free",
        overlaying: "y",
        side: 'right',
        position: 1,
        autorange: true,
        showspikes: false
    },
    yaxis3: {
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        fixedrange: false,
        anchor: "free",
        overlaying: "y",
        side: 'right',
        position: 0.985,
        autorange: true,
        showspikes: false
    },
    yaxis4: {
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        fixedrange: false,
        anchor: "free",
        overlaying: "y",
        side: 'left',
        position: 0.015,
        autorange: true,
        showspikes: false
    }
}
