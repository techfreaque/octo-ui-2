import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
  ScatterSeries,
  // SquareMarker,
  TriangleMarker,
  // CircleMarker,
  LineSeries,
  CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { last } from "react-stockcharts/lib/utils";
import ZoomButtons from "react-stockcharts/lib/ZoomButtons";
import {
  mouseBasedZoomAnchor,
  // lastVisibleItemBasedZoomAnchor,
  // rightDomainBasedZoomAnchor,
} from "react-stockcharts/lib/utils/zoomBehavior";
// import { fitWidth } from "react-stockcharts/lib/helper";

class ReactStockCharts extends React.Component {
  constructor(props) {
    super(props);
    this.saveNode = this.saveNode.bind(this);
    this.resetYDomain = this.resetYDomain.bind(this);
    this.handleReset = this.handleReset.bind(this);
    // this.setState({
    // 	suffix: 1
    // });
  }
  saveNode(node) {
    this.node = node;
  }
  resetYDomain() {
    this.node.resetYDomain();
  }
  handleReset() {
    console.log("reset");
    this.setState({
      suffix: this.state.suffix + 1,
    });
  }

  render() {
    const initialData = this.props.plot_data;
    const plottedSources = this.props.plot_sources;

    const chartsToRender = {};
    Object.keys(plottedSources).forEach((chartLocation) => {
      const DataToPlotException = {};
      try {
        plottedSources[chartLocation].forEach((plotSource) => {
          if (plotSource.enabled !== false) {
            chartsToRender[chartLocation] = true;
            throw DataToPlotException;
          }
        });
      } catch (e) {
        if (e !== DataToPlotException) throw e;
      }
    });
    if (chartsToRender === {}) {
      return <></>;
    }

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => new Date(d.x)
    );
    const { data, xScale, xAccessor, displayXAccessor } =
      xScaleProvider(initialData);
    const defaultZoomedDataPoints = data.length < 5000 ? data.length : 5000;
    const xExtents = [
      xAccessor(last(data)),
      xAccessor(data[data.length - defaultZoomedDataPoints]),
    ];
    function candlesYAccessor(dataSet, dataTitle) {
      const data = dataSet.data[dataTitle];
      return data
        ? {
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume,
            date: dataSet.x,
          }
        : {
            open: undefined,
            high: undefined,
            low: undefined,
            close: undefined,
            volume: undefined,
            date: undefined,
          };
    }
    function defaultYAccessor(data, title) {
      return data[title] && data[title].y;
    }

    function defaultYExtents(d, chartLocation) {
      let data = [];
      plottedSources[chartLocation].forEach((source) => {
        if (source.enabled === false || !d.data[source.title]) {
          return;
        } else if (source.title === "candles") {
          data = [d.data.candles.low, d.data.candles.high];
        } else if (d.data[source.title]) {
          data = data.concat([d.data[source.title].y]);
        }
      });
      return data;
    }

    const margin = { left: 70, right: 70, top: 20, bottom: 30 };

    const gridHeight =
      this.props.height - margin.top - margin.bottom;
    const gridWidth = window.innerWidth - margin.left - margin.right;
    const showGrid = true;
    const yGrid = showGrid
      ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 }
      : {};
    const xGrid = showGrid
      ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 }
      : {};

    if (
      this.props.plot_data.length < 1 ||
      this.props.plot_data.length === undefined
    ) {
      console.log("no data to plot on Chart");
      return <></>;
    }

    let upperHeight = this.props.height - 50;
    let lowerHeight = 0;
    if (Object.keys(chartsToRender).length === 2) {
      upperHeight = this.props.height * 0.65;
      lowerHeight = this.props.height * 0.35 - 55;
    }
    const charts = Object.keys(chartsToRender).map(
      (chartLocation, chartIndex) => {
        const origin = chartIndex === 1 ? upperHeight + 25 : 0;
        const height = chartIndex === 1 ? lowerHeight : upperHeight;
        return (
          <Chart
            id={chartIndex}
            key={chartIndex}
            height={height}
            yExtents={(d) => defaultYExtents(d, chartLocation)}
            origin={(w, h) => [0, origin]}
            // padding={{ top: 10, bottom: 10 }}
          >
            {chartIndex === 0 && (
              <XAxis
                axisAt="bottom"
                orient="bottom"
                tickStroke={this.props.botColors.font}
                stroke={this.props.botColors.border}
                {...xGrid}
              />
            )}
            <YAxis
              axisAt="left"
              orient="left"
              tickStroke={this.props.botColors.font}
              stroke={this.props.botColors.border}
              {...yGrid}
              onDoubleClick={this.resetYDomain}
            />
            {chartIndex === 0 && (
              <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={timeFormat("%Y-%m-%d %H:%M")}
              />
            )}
            <MouseCoordinateY
              at="right"
              orient="right"
              displayFormat={format(".2f")}
            />

            {plottedSources[chartLocation].map((plot, plotIndex) => {
              if (plot.enabled === false) {
                return <></>;
              } else if (plot.type === "candlestick") {
                return (
                  <div key={plot.title}>
                    <CandlestickSeries
                      key={plotIndex}
                      yAccessor={(d) => candlesYAccessor(d, plot.title)}
                      stroke={(d) =>
                        d.close > d.open
                          ? this.props.botColors.candles.border.green
                          : this.props.botColors.candles.border.red
                      }
                      wickStroke={(d) =>
                        d.close > d.open
                          ? this.props.botColors.candles.wick.green
                          : this.props.botColors.candles.wick.red
                      }
                      fill={(d) =>
                        d.close > d.open
                          ? this.props.botColors.candles.body.green
                          : this.props.botColors.candles.body.red
                      }
                    />
                    <OHLCTooltip
                      forChart={chartIndex}
                      key={plotIndex + "tt"}
                      accessor={(d) => candlesYAccessor(d, plot.title)}
                      origin={[10, -10]}
                      textFill={this.props.botColors.font}
                      // labelFill={this.props.botColors.fontActive}
                    />
                  </div>
                );
              } else if (plot.mode === "markers") {
                return (
                  <ScatterSeries
                    key={plotIndex}
                    yAccessor={(d) => defaultYAccessor(d.data, plot.title)}
                    marker={TriangleMarker}
                    markerProps={{
                      width: 8,
                      stroke: "#2ca02c",
                      fill: "#2ca02c",
                    }}
                  />
                );
              } else {
                return (
                  <LineSeries
                    key={plotIndex}
                    yAccessor={(d) => defaultYAccessor(d.data, plot.title)}
                  />
                );
              }
            })}

            {chartIndex === 0 && <ZoomButtons onReset={this.handleReset} />}
          </Chart>
        );
      }
    );

    return (
      <ChartCanvas
        ratio={1}
        width={window.innerWidth}
        height={this.props.height}
        margin={margin}
        type={this.props.type}
        pointsPerPxThreshold={1000}
        seriesName="Main-Chart"
        data={data}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xScale={xScale}
        xExtents={xExtents}
        ref={this.saveNode}
        zoomAnchor={mouseBasedZoomAnchor}
        // clamp={true}
      >
        {charts}
        <CrossHairCursor stroke={this.props.botColors.font} />
      </ChartCanvas>
    );
  }
}

// ReactStockCharts = fitWidth(ReactStockCharts);

export default ReactStockCharts;
