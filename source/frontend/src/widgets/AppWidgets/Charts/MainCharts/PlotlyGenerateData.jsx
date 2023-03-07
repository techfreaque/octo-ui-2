import { ALL_PLOT_SOURCES, CANDLES_PLOT_SOURCES, DISPLAY_SETTINGS_KEY, GRAPHS_KEY } from '../../../../constants/backendConstants';


export function setPlotData(
    plottedElements,
    uiConfig, visibleTimeframes,
    visiblePairs, setCharts, setLayouts) {
    if (plottedElements.live || plottedElements.backtesting) {
        const layouts = {}
        const chartsInfo = {
            maxRange: { start: undefined, end: undefined },
            chartsWithData: {}
        }
        const plotData = formatplottedData(
            plottedElements,
            uiConfig,
            visibleTimeframes,
            visiblePairs,
            layouts,
            chartsInfo
        )
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
}

function setLayout(layouts, layout, chartLocation) {
    layouts[chartLocation] = layout
}

function getOrGenerateLayout(layouts, uiConfig, chartLocation) {
    if (layouts[chartLocation]) {
        return layouts[chartLocation]
    } else {
        const layout = {
            autosize: true,
            margin: { l: 50, r: 50, b: 30, t: 0, pad: 0 },
            showlegend: true,
            legend: { x: 0.01, xanchor: 'left', y: 0.99, yanchor: "top" },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            dragmode: "pan",
            font: {
                color: "#b2b5be"
            },
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
}



function formatplottedData(
    plottedElements,
    uiConfig,
    visibleTimeframes,
    visiblePairs,
    layouts,
    chartsInfo
) {
    const plotData = {}
    plottedElements && Object.keys(plottedElements).forEach((liveOrBacktest) => {
        if (liveOrBacktest === "backtesting") {
            plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((optimizerCampaign) => {
                plottedElements[liveOrBacktest][optimizerCampaign]
                    && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign]).forEach((optimizerId) => {
                        plottedElements[liveOrBacktest][optimizerCampaign][optimizerId]
                            && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign][optimizerId]).forEach((backtestingId) => {
                                formatSubData({
                                    subElements: plottedElements[liveOrBacktest][optimizerCampaign][optimizerId][backtestingId],
                                    backtestingId: backtestingId, optimizerCampaign: optimizerCampaign,
                                    optimizerId: optimizerId, uiConfig: uiConfig,
                                    plotData: plotData,
                                    visibleTimeframes: visibleTimeframes, visiblePairs: visiblePairs,
                                    chartsInfo: chartsInfo
                                })
                            })
                    })
            })
        } else if (liveOrBacktest === "live") {
            plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((liveId) => {
                formatSubData({
                    subElements: plottedElements[liveOrBacktest][liveId],
                    liveId: liveId,
                    uiConfig: uiConfig, layouts: layouts,
                    plotData: plotData,
                    visibleTimeframes: visibleTimeframes,
                    visiblePairs: visiblePairs,
                    chartsInfo: chartsInfo
                })
            })
        }
    })
    return plotData
}

function formatSubData({
    subElements, liveId, backtestingId,
    optimizerCampaign,
    optimizerId, uiConfig, layouts,
    plotData, visibleTimeframes,
    visiblePairs, chartsInfo
}) {
    subElements && Object.keys(subElements).forEach((pair) => {
        if (pair === visiblePairs) {
            subElements[pair] && Object.keys(subElements[pair]).forEach((timeframe) => {
                if (timeframe === visibleTimeframes) {
                    const chartIdentifier = backtestingId
                        ? optimizerId
                            ? `${backtestingId}:${optimizerId} - ${optimizerCampaign}`
                            : `${backtestingId} - ${optimizerCampaign}`
                        : `live ${liveId}`;
                    const thisData = subElements[pair][timeframe].data.sub_elements;
                    thisData.forEach((sub_element) => {
                        if (sub_element.type === "chart") {
                            const chartLocation = sub_element.name
                            if (!plotData[chartLocation]) {
                                plotData[chartLocation] = []
                            }
                            const layout = getOrGenerateLayout(layouts, uiConfig, chartLocation)
                            let yAxisId = 1
                            let xAxisId = 1;
                            sub_element.data.elements.forEach((chartDetails) => {
                                if (chartDetails.own_yaxis && yAxisId <= 4) {
                                    yAxisId += 1;
                                }
                                if (chartDetails.own_xaxis && xAxisId <= 2) {
                                    xAxisId += 1;
                                }
                                createAxisIfNotExists("y", yAxisId, layout, uiConfig, chartDetails)
                                createAxisIfNotExists("x", xAxisId, layout, uiConfig, chartDetails)
                                _createCharts(
                                    {
                                        chartDetails: chartDetails, plotData: plotData,
                                        yAxisId: yAxisId, xAxisId: xAxisId, layout: layout,
                                        backtestingId: backtestingId, optimizerId: optimizerId,
                                        optimizerCampaign: optimizerCampaign,
                                        chartIdentifier: chartIdentifier,
                                        uiConfig: uiConfig, chartsInfo: chartsInfo,
                                        chartLocation: chartLocation
                                    });
                            })
                            setLayout(layouts, layout, chartLocation)
                        }
                    })
                }
            })
        }
    })
}


function _createCharts({
    chartDetails, plotData, yAxisId, xAxisId,
    backtestingId, optimizerId,
    optimizerCampaign, chartIdentifier,
    uiConfig, chartsInfo, chartLocation
}) {
    _createChartedElements({
        chartDetails: chartDetails,
        yAxisId: yAxisId, xAxisId: xAxisId,
        backtestingId: backtestingId,
        optimizerId: optimizerId,
        optimizerCampaign: optimizerCampaign,
        chartIdentifier: chartIdentifier,
        uiConfig: uiConfig,
        chartsInfo: chartsInfo,
        chartLocation: chartLocation
    }).forEach(element => {
        plotData[chartLocation].push(element);
    })

}

function _createChartedElements({
    chartDetails, yAxisId, xAxisId, backtestingId,
    optimizerId, optimizerCampaign, chartIdentifier,
    uiConfig, chartsInfo, chartLocation
}) {
    const createdChartedElements = [];
    if (chartDetails.x === null) {
        return createdChartedElements;
    }
    if (chartDetails.kind === "candlestick" && displayCandlesAsLines(chartDetails.x.length, uiConfig)) {
        chartDetails.kind = "scattergl";
        chartDetails.mode = "line";
        const originTitle = chartDetails.title;
        const displayedCandlesSources = getDisplayedCandlesLinesSources(uiConfig);
        CANDLES_PLOT_SOURCES.forEach(plotSource => {
            if (displayedCandlesSources.indexOf(plotSource) !== -1) {
                chartDetails.y = chartDetails[plotSource];
                chartDetails.title = `${originTitle} [${plotSource}]`
                createdChartedElements.push(
                    _createChartedElement({
                        chartDetails: chartDetails, yAxisId: yAxisId,
                        xAxisId: xAxisId, backtestingId: backtestingId,
                        optimizerId: optimizerId,
                        optimizerCampaign: optimizerCampaign,
                        chartIdentifier: chartIdentifier, plotOnlyY: true,
                        chartsInfo: chartsInfo, chartLocation: chartLocation
                    })
                );
            }
        })
    } else {
        createdChartedElements.push(
            _createChartedElement({
                chartDetails: chartDetails, yAxisId: yAxisId,
                xAxisId: xAxisId, backtestingId: backtestingId,
                optimizerId: optimizerId,
                optimizerCampaign: optimizerCampaign,
                chartIdentifier: chartIdentifier, plotOnlyY: false,
                chartsInfo: chartsInfo, chartLocation: chartLocation
            })
        );
    }
    return createdChartedElements;
}

function displayCandlesAsLines(candlesCount, uiConfig) {
    const default_max_candles_before_lines = 5000;
    const settings = uiConfig[DISPLAY_SETTINGS_KEY];
    if (typeof settings !== "undefined" && typeof settings[GRAPHS_KEY] !== "undefined") {
        return candlesCount > Number(settings[GRAPHS_KEY].max_candles_before_line_display);
    }
    return candlesCount > default_max_candles_before_lines;

} function getDisplayedCandlesLinesSources(uiConfig) {
    const default_max_candles_line_sources = ["close"];
    const settings = uiConfig[DISPLAY_SETTINGS_KEY];
    if (typeof settings !== "undefined" && typeof settings[GRAPHS_KEY] !== "undefined") {
        return settings[GRAPHS_KEY].max_candles_line_sources;
    }
    return default_max_candles_line_sources;
}

function _createChartedElement({
    chartDetails, yAxisId, xAxisId, backtestingId, optimizerId, optimizerCampaign, chartIdentifier, plotOnlyY, chartsInfo, chartLocation
}) {
    const chartedElement = {
        x: chartDetails.x,
        mode: chartDetails.mode,
        type: chartDetails.kind,
        text: chartDetails.text,
        name: `${chartDetails.title} (${chartIdentifier})`,
        user_title: chartDetails.title,
        backtesting_id: backtestingId,
        optimizer_id: optimizerId,
        campaign_name: optimizerCampaign,
        line: { shape: chartDetails.line_shape },
        marker: {}
    }
    MARKER_ATTRIBUTES.forEach(function (attribute) {
        if (chartDetails[attribute] !== null) {
            chartedElement.marker[attribute] = chartDetails[attribute];
        }
    });
    if (plotOnlyY) {
        chartedElement.y = chartDetails.y;
    } else {
        ALL_PLOT_SOURCES.forEach(function (element) {
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

const MARKER_ATTRIBUTES = ["color", "size", "opacity", "line", "symbol"];

function _logChartsInfo(chartsInfo, chartedElement, chartLocation) {
    if (!chartsInfo.chartsWithData[chartLocation]) {
        chartsInfo.chartsWithData[chartLocation] = true
    }
    // log max range 
    const lastIndex = chartedElement.x.length - 1
    if (chartsInfo.maxRange.start) {
        chartsInfo.maxRange.start = chartsInfo.maxRange.start < chartedElement.x[0]
            ? chartsInfo.maxRange.start
            : chartedElement.x[0]
        chartsInfo.maxRange.end = chartsInfo.maxRange.end > chartedElement.x[lastIndex]
            ? chartsInfo.maxRange.end
            : chartedElement.x[lastIndex]
    } else {
        chartsInfo.maxRange = {
            start: chartedElement.x[0],
            end: chartedElement.x[lastIndex],
        }
    }
}

function getYAxisKey(yAxis, axisType) {
    return yAxis === 1 ? `${axisType}axis` : `${axisType}axis${yAxis}`;
}

function createAxisIfNotExists(axisType, axisId, layout, uiConfig, chartDetails) {
    const axisKey = getYAxisKey(axisId, axisType)
    if (!layout[axisKey]) {
        layout[axisKey] = getAxisTemplate(axisKey, uiConfig, axisType, chartDetails)
    }
}

function formatAsRangeTime(timestamp) {
    return new Date(
        timestamp - (new Date(timestamp).getTimezoneOffset() * 60000)
    ).toISOString().substr(0, 19).replace('T', ' ');
}

function getAxisTemplate(axisKey, uiConfig, axisType, chartDetails) {
    const axis = axisTemplate[axisKey]
    if (axisType === "y" && uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_use_log_scale === true) {
        axis.type = "log"
    }
    if (axisType === "x" && chartDetails.x_type !== null) {
        axis.type = chartDetails.x_type;
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
            visible: false,
        },
        domain: [0.02, 0.98]
    },
    xaxis2: {
        type: 'date',
        autorange: true,
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        rangeslider: {
            visible: false,
        },
        domain: [0.02, 0.98],
        side: 'top',
        overlaying: "x",
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
    }
}
