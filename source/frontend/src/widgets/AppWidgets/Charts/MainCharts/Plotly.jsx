import React, { useEffect, useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { ALL_PLOT_SOURCES, CANDLES_PLOT_SOURCES, DISPLAY_SETTINGS_KEY, GRAPHS_KEY } from '../../../../constants/backendConstants';
import { useUiConfigContext } from '../../../../context/config/UiConfigProvider';
import { useVisiblePairsContext } from '../../../../context/config/VisiblePairProvider';
import { useVisibleTimeFramesContext } from '../../../../context/config/VisibleTimeFrameProvider';
import { useBotPlottedElementsContext } from '../../../../context/data/BotPlottedElementsProvider';

export const chartLocations = ["main-chart", "sub-chart"]

export default function PlotlyChart() {
    const [charts, setCharts] = useState()
    const [layout, setLayout] = useState()
    const containerRef = useRef()
    const plottedElements = useBotPlottedElementsContext()
    const hiddenXAxisChartIDs = ["sub-chart"];
    const uiConfig = useUiConfigContext()
    const visiblePairs = useVisiblePairsContext();
    const visibleTimeframes = useVisibleTimeFramesContext();
    useEffect(() => {
        setPlotData(
            plottedElements,
            containerRef, uiConfig, hiddenXAxisChartIDs, visibleTimeframes,
            visiblePairs, charts, layout, setCharts, setLayout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plottedElements])

    useEffect(() => {
        // update layout when dimensions change
        containerRef?.current && setLayout(prevLayout => (
            { ...prevLayout, height: containerRef.current.clientHeight, width: containerRef.current.clientWidth }
        ))
    }, [containerRef?.current?.clientWidth, containerRef?.current?.clientHeight])
    return useMemo(() => (
        <div style={{ height: "100%", width: "100%" }} ref={containerRef}>
            {charts && layout
                && <Plot
                    data={charts}
                    layout={layout}
                    config={getPlotlyConfig()}
                />}
        </div>
    ), [charts, layout])
}

function setPlotData(
    plottedElements,
    containerRef, uiConfig, hiddenXAxisChartIDs, visibleTimeframes,
    visiblePairs, charts, layout, setCharts, setLayout) {
    if (plottedElements.live || plottedElements.backtesting) {
        const plotData = []
        const _layout = {
            height: containerRef.current.clientHeight,
            width: containerRef.current.clientWidth,
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
            yaxis: {
                gridcolor: "#2a2e39",
                color: "#b2b5be",
                fixedrange: false,
                anchor: "free",
                overlaying: "y",
                side: 'left',
                position: 0
            },
            yaxis2: {
                gridcolor: "#2a2e39",
                color: "#b2b5be",
                fixedrange: false,
                anchor: "free",
                overlaying: "y",
                side: 'right',
                position: 1
            },
            yaxis3: {
                gridcolor: "#2a2e39",
                color: "#b2b5be",
                fixedrange: false,
                anchor: "free",
                overlaying: "y",
                side: 'right',
                position: 0.985
            },
            yaxis4: {
                gridcolor: "#2a2e39",
                color: "#b2b5be",
                fixedrange: false,
                anchor: "free",
                overlaying: "y",
                side: 'left',
                position: 0.015
            }
        };
        if (uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_unified_tooltip) {
            _layout.hovermode = "x unified";
            _layout.hoverlabel = {
                bgcolor: "#131722",
                bordercolor: "#2a2e39"
            };
        } else {
            _layout.hovermode = false;
        }
        plottedElements && Object.keys(plottedElements).forEach((liveOrBacktest) => {
            if (liveOrBacktest === "backtesting") {
                plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((optimizerCampaign) => {
                    plottedElements[liveOrBacktest][optimizerCampaign]
                        && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign]).forEach((optimizerId) => {
                            plottedElements[liveOrBacktest][optimizerCampaign][optimizerId]
                                && Object.keys(plottedElements[liveOrBacktest][optimizerCampaign][optimizerId]).forEach((backtestingId) => {
                                    formatSubData(plottedElements[liveOrBacktest][optimizerCampaign][optimizerId][backtestingId],
                                        undefined, backtestingId, optimizerCampaign, optimizerId, _layout, uiConfig,
                                        hiddenXAxisChartIDs, plotData, visibleTimeframes, visiblePairs)
                                })
                        })
                })
            } else if (liveOrBacktest === "live") {
                plottedElements[liveOrBacktest] && Object.keys(plottedElements[liveOrBacktest]).forEach((liveId) => {
                    formatSubData(plottedElements[liveOrBacktest][liveId], liveId, undefined, undefined, undefined, _layout, uiConfig,
                        hiddenXAxisChartIDs, plotData, visibleTimeframes, visiblePairs)
                })
            }
        })
        if (plotData.length && JSON.stringify(plotData) !== JSON.stringify(charts) && JSON.stringify(_layout) !== JSON.stringify(layout)) {
            setCharts(plotData)
            setLayout(_layout)
        }
    }
}


function formatSubData(
    subElements, liveId, backtestingId, optimizerCampaign,
    optimizerId, layout, uiConfig,
    hiddenXAxisChartIDs, plotData, visibleTimeframes, visiblePairs
) {
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
                            const xaxis_list = [];
                            const yaxis_list = [];
                            let yAxis
                            if (backtestingId !== undefined && sub_element.name !== "backtesting-run-overview") {
                                yAxis = 1;
                            } else {
                                yAxis = 0;
                            }

                            let xAxis = 0;
                            sub_element.data.elements.forEach((chartDetails) => {
                                if (chartDetails.own_yaxis && yAxis < 4) {
                                    yAxis += 1;
                                } else if (yAxis === 0) {
                                    yAxis = 1;
                                }
                                if (chartDetails.own_xaxis) {
                                    xAxis += 1;
                                }
                                createChart(
                                    chartDetails, plotData, yAxis, xAxis, xaxis_list, yaxis_list,
                                    backtestingId, optimizerId, optimizerCampaign, chartIdentifier,
                                    layout, uiConfig);
                                if (hiddenXAxisChartIDs.indexOf(sub_element.name) !== -1) {
                                    layout.xaxis.visible = false;
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    return layout
}


function createChart(chartDetails, chartData, yAxis, xAxis, xaxis_list, yaxis_list, backtesting_id, optimizer_id, campaign_name, chartIdentifier, layout, uiConfig) {
    const xaxis = {
        gridcolor: "#2a2e39",
        color: "#b2b5be",
        autorange: true,
        rangeslider: {
            visible: false,
        },
        domain: [0.02, 0.98]
    };
    const yaxis = {
    };
    if (chartDetails.x_type !== null) {
        xaxis.type = chartDetails.x_type;
    }
    if (xAxis > 1) {
        xaxis.overlaying = "x"
    }
    if (chartDetails.y_type !== null && uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_use_log_scale === true) {
        yaxis.type = chartDetails.y_type;
    }

    _createOrAdaptChartedElements(
        chartDetails, yAxis, xAxis, backtesting_id,
        optimizer_id, campaign_name, chartIdentifier, uiConfig).forEach(element => {
            chartData.push(element);
        })


    const MAX_AXIS_INDEX = 4;
    yaxis_list.push(yaxis)
    yaxis_list.forEach(function (axis, i) {
        if (i > 0 && i < MAX_AXIS_INDEX) {
            layout[`yaxis${i + 1}`].type = axis.type;
        } else {
            layout["yaxis"].type = axis.type
        }
    });
    xaxis_list.push(xaxis)
    xaxis_list.forEach(function (axis, i) {
        if (i > 0) {
            layout[`xaxis${i + 1}`] = axis;
        } else {
            layout.xaxis = axis
        }
    });
}

function _createOrAdaptChartedElements(chartDetails, yAxis, xAxis, backtesting_id, optimizer_id, campaign_name, chartIdentifier, uiConfig) {
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
                    _getChartedElements(chartDetails, yAxis, xAxis, backtesting_id, optimizer_id, campaign_name, chartIdentifier, true)
                );
            }
        })
    } else {
        createdChartedElements.push(
            _getChartedElements(chartDetails, yAxis, xAxis, backtesting_id, optimizer_id, campaign_name, chartIdentifier, false)
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
function _getChartedElements(chartDetails, yAxis, xAxis, backtesting_id, optimizer_id, campaign_name, chartIdentifier, plotOnlyY) {
    const chartedElements = {
        x: chartDetails.x,
        mode: chartDetails.mode,
        type: chartDetails.kind,
        text: chartDetails.text,
        name: `${chartDetails.title} (${chartIdentifier})`,
        user_title: chartDetails.title,
        backtesting_id: backtesting_id,
        optimizer_id: optimizer_id,
        campaign_name: campaign_name,
    }
    chartedElements.line = {
        shape: chartDetails.line_shape
    }
    const markerAttributes = ["color", "size", "opacity", "line", "symbol"];
    chartedElements.marker = {};
    markerAttributes.forEach(function (attribute) {
        if (chartDetails[attribute] !== null) {
            chartedElements.marker[attribute] = chartDetails[attribute];
        }
    });
    if (plotOnlyY) {
        chartedElements.y = chartDetails.y;
    } else {
        ALL_PLOT_SOURCES.forEach(function (element) {
            if (chartDetails[element] !== null) {
                chartedElements[element] = chartDetails[element]
            }
        })
    }
    // if (xAxis > 1) {
    //     chartedElements.xaxis = `x${xAxis}`
    // }
    // if (yAxis > 1) {
    //     chartedElements.yaxis = `y${yAxis}`
    // }
    return chartedElements;
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