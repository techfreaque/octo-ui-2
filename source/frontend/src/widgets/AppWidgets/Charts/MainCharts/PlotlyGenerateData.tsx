import { Dispatch, SetStateAction } from "react";
import {
  ALL_PLOT_SOURCES,
  CANDLES_PLOT_SOURCES,
  CanldesPlotSourceType,
  DISPLAY_SETTINGS_KEY,
  GRAPHS_KEY,
  PlotSourceType,
} from "../../../../constants/backendConstants";
import { UiConfigType } from "../../../../context/config/UiConfigProvider";
import { ChartsDataType } from "../ChartTablePieCombo";
import {
  PlotlyAxisLayout,
  PlotlyLayoutsType,
  PlotlyLayoutType,
  UpdatePlotlyLayoutsType,
} from "./PlotlyContext";
import {
  ChartDetailsType,
  PlottedElementLiveNameType,
  PlottedElementNameType,
  PlottedLiveElementType,
  PlottedElementsType,
  PlottedSubElementType,
  PlottedBacktestingElementType,
  PlottedElementBacktestingNameType,
} from "../../../../context/data/BotPlottedElementsProvider";
import { ChartLocationType, allChartLocations } from "./Plotly";

type ChartsInfoType = {
  maxRange: {
    start: undefined;
    end: undefined;
  };
  chartsWithData: {
    [chart in ChartLocationType]?: boolean;
  };
};

export function setPlotData(
  plottedElements: PlottedElementsType<PlottedElementNameType> | undefined,
  uiConfig: UiConfigType,
  visibleTimeframes: string,
  visiblePairs: string,
  setCharts: Dispatch<SetStateAction<ChartsDataType | undefined>>,
  setLayouts: UpdatePlotlyLayoutsType
) {
  if (!(plottedElements?.live || plottedElements?.backtesting)) {
    return;
  }
  const chartsInfo: ChartsInfoType = {
    maxRange: {
      start: undefined,
      end: undefined,
    },
    chartsWithData: {},
  };
  const {
    plotData,
    layouts,
  }: {
    plotData: PlottedDataType;
    layouts: PlotlyLayoutsType;
  } = formatPlottedData(
    plottedElements,
    uiConfig,
    visibleTimeframes,
    visiblePairs,
    chartsInfo
  );
  const plotDataToStore: ChartsDataType = {};
  let hasCharts = false;
  const start =
    chartsInfo.maxRange.start && formatAsRangeTime(chartsInfo.maxRange.start);
  const end =
    chartsInfo.maxRange.end && formatAsRangeTime(chartsInfo.maxRange.end);
  Object.entries(layouts).forEach(([thisChartLocation, layout]) => {
    if (chartsInfo.chartsWithData?.[thisChartLocation]) {
      if (start && end) {
        const xaxis = layout?.xaxis;
        if (xaxis) {
          xaxis.range = [start, end];
          xaxis.maxRange = [start, end];
        }
      }
      setLayouts[thisChartLocation](layout);
      plotDataToStore[thisChartLocation] = plotData[thisChartLocation];
      hasCharts = true;
      return;
    } else if (
      thisChartLocation === "pie-chart" &&
      plotData[thisChartLocation]
    ) {
      setLayouts[thisChartLocation]({
        ...layout,
        grid: {
          rows: 1,
          columns: 2,
        },
      });
      plotDataToStore[thisChartLocation] = plotData[thisChartLocation];
      hasCharts = true;
    } else {
      setLayouts[thisChartLocation](undefined);
    }
  });
  if (hasCharts) {
    setCharts(plotDataToStore);
  } else {
    setCharts(undefined);
  }
}

function setLayout(
  layouts: PlotlyLayoutsType,
  layout: PlotlyLayoutType,
  chartLocation: ChartLocationType
) {
  layouts[chartLocation] = layout;
}

function getOrGenerateLayout(
  layouts: PlotlyLayoutsType,
  uiConfig: UiConfigType,
  chartLocation: ChartLocationType
): PlotlyLayoutType {
  if (typeof layouts[chartLocation] !== "undefined") {
    return layouts[chartLocation] as PlotlyLayoutType;
  }
  const layout: PlotlyLayoutType = {
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 30,
      t: 0,
      pad: 0,
    },
    showlegend: true,
    legend: {
      x: 0.01,
      xanchor: "left",
      y: 0.99,
      yanchor: "top",
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    dragmode: "pan",
    font: {
      color: "#b2b5be",
    },
    width: window.innerWidth,
    hovermode: false,
  };
  if (uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.display_unified_tooltip) {
    layout.hovermode = "x unified";
    layout.hoverlabel = {
      bgcolor: "#131722",
      bordercolor: "#2a2e39",
    };
  }
  return layout;
}

type PlottedDataType = {
  [chart in ChartLocationType]?: ChartedElementType[];
};

function formatPlottedData(
  plottedElements: PlottedElementsType<PlottedElementNameType>,
  uiConfig: UiConfigType,
  visibleTimeframes: string,
  visiblePairs: string,
  chartsInfo: ChartsInfoType
): { plotData: PlottedDataType; layouts: PlotlyLayoutsType } {
  const plotData: PlottedDataType = {};
  const layouts: PlotlyLayoutsType = {};
  plottedElements &&
    Object.keys(plottedElements).forEach((liveOrBacktest) => {
      if (plottedElements?.[liveOrBacktest]) {
        if (liveOrBacktest === "backtesting") {
          formatPlottedBacktestingData({
            plottedBacktestingElements: plottedElements[
              liveOrBacktest
            ] as PlottedElementsType<PlottedElementBacktestingNameType>,
            uiConfig,
            visibleTimeframes,
            visiblePairs,
            chartsInfo,
            layouts,
            plotData,
          });
        } else if (liveOrBacktest === "live") {
          formatPlottedLiveData({
            plottedLiveElements: plottedElements[
              liveOrBacktest
            ] as PlottedElementsType<PlottedElementLiveNameType>,
            uiConfig,
            visibleTimeframes,
            visiblePairs,
            chartsInfo,
            layouts,
            plotData,
          });
        }
      }
    });
  return { plotData, layouts };
}

function formatPlottedLiveData({
  plottedLiveElements,
  uiConfig,
  visibleTimeframes,
  visiblePairs,
  chartsInfo,
  layouts,
  plotData,
}: {
  plottedLiveElements: PlottedLiveElementType;
  uiConfig: UiConfigType;
  visibleTimeframes: string;
  visiblePairs: string;
  chartsInfo: ChartsInfoType;
  layouts: PlotlyLayoutsType;
  plotData: PlottedDataType;
}) {
  Object.entries(plottedLiveElements).forEach(([liveId, subElements]) => {
    formatSubData({
      subElements,
      liveId,
      uiConfig,
      layouts,
      plotData,
      visibleTimeframes,
      visiblePairs,
      chartsInfo,
    });
  });
}

function formatPlottedBacktestingData({
  plottedBacktestingElements,
  uiConfig,
  visibleTimeframes,
  visiblePairs,
  chartsInfo,
  layouts,
  plotData,
}: {
  plottedBacktestingElements: PlottedBacktestingElementType;
  uiConfig: UiConfigType;
  visibleTimeframes: string;
  visiblePairs: string;
  chartsInfo: ChartsInfoType;
  layouts: PlotlyLayoutsType;
  plotData: PlottedDataType;
}) {
  Object.entries(plottedBacktestingElements).forEach(
    ([optimizerCampaign, campaignElements]) => {
      campaignElements &&
        Object.entries(campaignElements).forEach(
          ([optimizerId, optimzerElements]) => {
            optimzerElements &&
              Object.entries(optimzerElements).forEach(
                ([backtestingId, backtestingElements]) => {
                  formatSubData({
                    subElements: backtestingElements,
                    backtestingId,
                    optimizerCampaign,
                    optimizerId,
                    uiConfig,
                    plotData,
                    layouts,
                    visibleTimeframes,
                    visiblePairs,
                    chartsInfo,
                  });
                }
              );
          }
        );
    }
  );
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
  chartsInfo,
}: {
  subElements: PlottedSubElementType;
  liveId?: string;
  backtestingId?: string;
  optimizerCampaign?: string;
  optimizerId?: string;
  uiConfig: UiConfigType;
  layouts: PlotlyLayoutsType;
  plotData: PlottedDataType;
  visibleTimeframes: string;
  visiblePairs: string;
  chartsInfo: ChartsInfoType;
}) {
  subElements &&
    Object.keys(subElements).forEach((pair) => {
      if (pair === visiblePairs) {
        subElements[pair] &&
          Object.keys(subElements[pair]).forEach((timeframe) => {
            if (timeframe !== visibleTimeframes) {
              return;
            }
            const chartIdentifier = backtestingId
              ? optimizerId
                ? `${backtestingId}:${optimizerId} - ${optimizerCampaign}`
                : `${backtestingId} - ${optimizerCampaign}`
              : `live ${liveId}`;
            const thisData = subElements[pair][timeframe]?.data?.sub_elements;
            thisData?.forEach((sub_element) => {
              const chartLocation: ChartLocationType | "table" =
                sub_element.name;
              if (
                chartLocation === "table" ||
                !allChartLocations.includes(chartLocation) ||
                sub_element.type !== "chart"
              ) {
                return;
              }
              if (!plotData[chartLocation]) {
                plotData[chartLocation] = [];
              }
              const layout = getOrGenerateLayout(
                layouts,
                uiConfig,
                chartLocation
              );
              let yAxisId: XAxisIdType = 1;
              let xAxisId: AxisIdType = 1;
              sub_element?.data?.elements?.forEach((chartDetails) => {
                if (chartDetails.own_yaxis && yAxisId < 4) {
                  yAxisId++;
                }
                if (chartDetails.own_xaxis && xAxisId < 2) {
                  xAxisId++;
                }
                createAxisIfNotExists(
                  "y",
                  yAxisId,
                  layout,
                  uiConfig,
                  chartDetails
                );
                createAxisIfNotExists(
                  "x",
                  xAxisId,
                  layout,
                  uiConfig,
                  chartDetails
                );
                _createCharts({
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
                  chartLocation,
                });
              });
              setLayout(layouts, layout, chartLocation);
            });
          });
      }
    });
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
  chartLocation,
}: {
  chartDetails: ChartDetailsType;
  plotData: PlottedDataType;
  yAxisId: number;
  xAxisId: number;
  backtestingId?: string;
  optimizerId?: string;
  optimizerCampaign?: string;
  chartIdentifier: string;
  uiConfig: UiConfigType;
  chartsInfo: ChartsInfoType;
  chartLocation: ChartLocationType;
}) {
  if (!chartDetails.x) {
    if (chartDetails.values) {
      (plotData[chartLocation] as ChartedElementType[]).push(
        _createPieChartElement({
          chartDetails,
          chartIdentifier,
          backtestingId,
          optimizerId,
          optimizerCampaign,
        })
      );
    }
    return;
  }
  if (
    chartDetails.kind === "candlestick" &&
    displayCandlesAsLines(chartDetails.x.length, uiConfig)
  ) {
    chartDetails.kind = "scattergl";
    chartDetails.mode = "line";
    const originTitle = chartDetails.title;
    const displayedCandlesSources = getDisplayedCandlesLinesSources(uiConfig);
    CANDLES_PLOT_SOURCES.forEach((plotSource) => {
      if (!displayedCandlesSources.includes(plotSource)) {
        return;
      }
      chartDetails.y = chartDetails[plotSource];
      chartDetails.title = `${originTitle} [${plotSource}]`;
      (plotData[chartLocation] as ChartedElementType[]).push(
        _createChartedElement({
          chartDetails,
          yAxisId,
          xAxisId,
          backtestingId,
          optimizerId,
          optimizerCampaign,
          chartIdentifier,
          plotOnlyY: true,
          chartsInfo,
          chartLocation,
        })
      );
    });
    return;
  }
  (plotData[chartLocation] as ChartedElementType[]).push(
    _createChartedElement({
      chartDetails,
      yAxisId,
      xAxisId,
      backtestingId,
      optimizerId,
      optimizerCampaign,
      chartIdentifier,
      plotOnlyY: false,
      chartsInfo,
      chartLocation,
    })
  );
}

function displayCandlesAsLines(candlesCount: number, uiConfig: UiConfigType) {
  const default_max_candles_before_lines = 5000;
  if (
    uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]
      ?.max_candles_before_line_display
  ) {
    return (
      candlesCount >
      Number(
        uiConfig?.[DISPLAY_SETTINGS_KEY][GRAPHS_KEY]
          .max_candles_before_line_display
      )
    );
  }
  return candlesCount > default_max_candles_before_lines;
}
function getDisplayedCandlesLinesSources(
  uiConfig: UiConfigType
): CanldesPlotSourceType[] {
  const default_max_candles_line_sources: CanldesPlotSourceType[] = ["close"];
  if (
    uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]?.max_candles_line_sources
  ) {
    return uiConfig[DISPLAY_SETTINGS_KEY][GRAPHS_KEY].max_candles_line_sources;
  }
  return default_max_candles_line_sources;
}

function _createPieChartElement({
  chartDetails,
  chartIdentifier,
  backtestingId,
  optimizerId,
  optimizerCampaign,
}: {
  chartDetails: ChartDetailsType;
  chartIdentifier: string;
  backtestingId?: string;
  optimizerId?: string;
  optimizerCampaign?: string;
}): ChartedElementType {
  return {
    type: chartDetails.kind,
    labels: chartDetails.labels,
    values: chartDetails.values,
    text: chartDetails.text,
    hoverlabel: {
      font: { color: "#fff" },
    },
    name: `${chartDetails.title} (${chartIdentifier})`,
    user_title: chartDetails.title,
    backtesting_id: backtestingId,
    optimizer_id: optimizerId,
    hole: chartDetails.hole,
    textposition: "inside",
    campaign_name: optimizerCampaign,
  };
}

type ChartedElementType = {
  x?: any;
  mode?: any;
  type: any;
  text?: any;
  labels?: any;
  values?: any;
  name: string;
  user_title?: string;
  backtesting_id?: string;
  optimizer_id?: string;
  campaign_name?: string;
  hole?: any;
  textposition?: "inside";
  hoverlabel?: {
    font: {
      color: string;
    };
  };
  line?: {
    shape: string;
    color: string;
  };
  xaxis?: string;
  yaxis?: string;
  marker?: {
    [attribute in MarkerAttributesType]?: any;
  };
} & {
  [sourceType in PlotSourceType]?: any;
};

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
  chartLocation,
}: {
  chartDetails: ChartDetailsType;
  yAxisId: number;
  xAxisId: number;
  backtestingId?: string;
  optimizerId?: string;
  optimizerCampaign?: string;
  chartIdentifier: string;
  plotOnlyY: boolean;
  chartsInfo: ChartsInfoType;
  chartLocation: ChartLocationType;
}): ChartedElementType {
  const chartedElement: ChartedElementType = {
    x: chartDetails.x,
    mode: chartDetails.mode,
    type: chartDetails.kind,
    text: chartDetails.text,
    name: `${chartDetails.title} (${chartIdentifier})`,
    user_title: chartDetails.title,
    backtesting_id: backtestingId,
    optimizer_id: optimizerId,
    campaign_name: optimizerCampaign,
    line: {
      shape: chartDetails.line_shape,
      color: chartDetails.color?.[0],
    },
  };
  MARKER_ATTRIBUTES.forEach((attribute) => {
    if (chartDetails[attribute]) {
      if (!chartedElement.marker) {
        chartedElement.marker = {};
      }
      chartedElement.marker[attribute] = chartDetails[attribute];
    }
  });
  if (plotOnlyY) {
    chartedElement.y = chartDetails.y;
  } else {
    ALL_PLOT_SOURCES.forEach((element) => {
      if (chartDetails[element]) {
        chartedElement[element] = chartDetails[element];
      }
    });
  }
  if (xAxisId > 1) {
    chartedElement.xaxis = `x${xAxisId}`;
  }
  if (yAxisId > 1) {
    chartedElement.yaxis = `y${yAxisId}`;
  }
  _logChartsInfo(chartsInfo, chartedElement, chartLocation);
  return chartedElement;
}

export type MarkerAttributesType =
  | "color"
  | "size"
  | "opacity"
  | "line"
  | "symbol";

const MARKER_ATTRIBUTES: MarkerAttributesType[] = [
  "color",
  "size",
  "opacity",
  "line",
  "symbol",
];

function _logChartsInfo(
  chartsInfo: ChartsInfoType,
  chartedElement: ChartedElementType,
  chartLocation: ChartLocationType
) {
  chartsInfo.chartsWithData[chartLocation] = true;
  // log max range
  const lastIndex = chartedElement.x.length - 1;
  if (chartsInfo.maxRange.start) {
    chartsInfo.maxRange.start =
      chartsInfo.maxRange.start < chartedElement.x[0]
        ? chartsInfo.maxRange.start
        : chartedElement.x[0];
    chartsInfo.maxRange.end =
      chartsInfo.maxRange.end &&
      chartsInfo.maxRange.end > chartedElement.x[lastIndex]
        ? chartsInfo.maxRange.end
        : chartedElement.x[lastIndex];
  } else {
    chartsInfo.maxRange = {
      start: chartedElement.x[0],
      end: chartedElement.x[lastIndex],
    };
  }
}

type XAxisKeyType = "x";
type YAxisKeyType = "y";
type AxisKeyType = XAxisKeyType | YAxisKeyType;

type XAxisType = "xaxis" | "xaxis2";
type YAxisType = "yaxis" | "yaxis2" | "yaxis3" | "yaxis4";
export type AxisType = XAxisType | YAxisType;

type XAxisIdType = 1 | 2;
type AxisIdType = XAxisIdType | 3 | 4;

type GetAxisKey<
  TAxisKeyType extends AxisKeyType,
  TAxisIdType extends AxisIdType
> = TAxisKeyType extends "x"
  ? TAxisIdType extends XAxisIdType
    ? XAxisType
    : undefined
  : YAxisType;

function getAxisKey<
  TAxisKeyType extends AxisKeyType,
  TAxisIdType extends AxisIdType
>(
  axisId: TAxisIdType,
  axisType: TAxisKeyType
): GetAxisKey<TAxisKeyType, TAxisIdType> {
  return `${axisType}axis${axisId === 1 ? "" : axisId}` as GetAxisKey<
    TAxisKeyType,
    TAxisIdType
  >;
}

function createAxisIfNotExists(
  axisType: AxisKeyType,
  axisId: AxisIdType,
  layout: PlotlyLayoutType,
  uiConfig: UiConfigType,
  chartDetails: ChartDetailsType
) {
  const axisKey = getAxisKey(axisId, axisType);
  if (axisKey && !layout[axisKey]) {
    layout[axisKey] = getAxisTemplate(
      axisKey,
      uiConfig,
      axisType,
      chartDetails
    );
  }
}

function formatAsRangeTime(timestamp: number): string {
  return new Date(timestamp - new Date(timestamp).getTimezoneOffset() * 60_000)
    .toISOString()
    .substr(0, 19)
    .replace("T", " ");
}

function getAxisTemplate(
  axisKey: AxisType,
  uiConfig: UiConfigType,
  axisType: AxisKeyType,
  chartDetails: ChartDetailsType
): PlotlyAxisLayout {
  const axis = axisTemplate[axisKey];
  if (axisType === "x" && chartDetails.x_type) {
    axis.type = chartDetails.x_type;
  } else if (axisType === "y" && chartDetails.y_type !== "date") {
    axis.type = uiConfig?.[DISPLAY_SETTINGS_KEY]?.[GRAPHS_KEY]
      ?.display_use_log_scale
      ? "log"
      : "linear";
  }
  return axis;
}

const axisTemplate: {
  [axisKey in AxisType]: PlotlyAxisLayout;
} = {
  xaxis: {
    type: "date",
    autorange: true,
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    rangeslider: {
      visible: false,
    },
    showspikes: false,
    domain: [0.02, 0.98],
  },
  xaxis2: {
    type: "date",
    autorange: true,
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    rangeslider: {
      visible: false,
    },
    domain: [0.02, 0.98],
    side: "top",
    overlaying: "x",
    showspikes: false,
  },
  yaxis: {
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    fixedrange: false,
    anchor: "free",
    overlaying: "y",
    side: "left",
    position: 0,
    autorange: true,
    showspikes: false,
  },
  yaxis2: {
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    fixedrange: false,
    anchor: "free",
    overlaying: "y",
    side: "right",
    position: 1,
    autorange: true,
    showspikes: false,
  },
  yaxis3: {
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    fixedrange: false,
    anchor: "free",
    overlaying: "y",
    side: "right",
    position: 0.985,
    autorange: true,
    showspikes: false,
  },
  yaxis4: {
    gridcolor: "#2a2e39",
    color: "#b2b5be",
    fixedrange: false,
    anchor: "free",
    overlaying: "y",
    side: "left",
    position: 0.015,
    autorange: true,
    showspikes: false,
  },
};
