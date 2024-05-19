import { useMemo } from "react";
import { getSplitterClasses } from "../../../LayoutWidgets/SplitMainContent";
import PlotlyChart, {
  ChartLocationType,
  allChartLocations,
  enableAxisSelect,
} from "./Plotly";
import { useEffect } from "react";
import "./crosshair.css";
import Crosshair, {
  handleCrosshairOnMouseEnter,
  handleCrosshairOnMouseLeave,
} from "./Crosshair";
import useMeasure from "react-use-measure";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import { useColorModeContext } from "../../../../context/config/ColorModeProvider";
import {
  PlotlyLayoutType,
  PlotlyLayoutsType,
  UpdatePlotlyLayoutsType,
} from "./PlotlyContext";
import { ChartDataType, ChartsDataType } from "../ChartTablePieCombo";

export default function PlotlyDualCharts({
  chartLocations = allChartLocations,
  charts,
  setLayouts,
  layouts,
}: {
  chartLocations?: ChartLocationType[];
  charts: ChartsDataType;
  setLayouts: UpdatePlotlyLayoutsType;
  layouts: PlotlyLayoutsType;
}) {
  useEffect(() => {
    enableAxisSelect();
  }, [charts]);
  const mainChartLocation = chartLocations[0];
  const mainLayout = mainChartLocation && layouts[mainChartLocation];
  const mainChart = mainChartLocation && charts[mainChartLocation];
  const subChartLocation = chartLocations[1];
  const subLayout = subChartLocation && layouts[subChartLocation];
  const subChart = subChartLocation && charts[subChartLocation];
  return useMemo(() => {
    return mainLayout && mainChart ? (
      <>
        {!window.matchMedia("(pointer: coarse)").matches && <Crosshair />}
        {subLayout && subChart ? (
          <DualChart
            mainChartLocation={mainChartLocation}
            subChartLocation={subChartLocation}
            setLayouts={setLayouts}
            subLayout={subLayout}
            subChart={subChart}
            mainLayout={mainLayout}
            mainChart={mainChart}
          />
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
              }}
              onMouseEnter={handleCrosshairOnMouseEnter}
              onMouseLeave={handleCrosshairOnMouseLeave}
            >
              <Chart
                chartLocation={mainChartLocation}
                setLayouts={setLayouts}
                layout={mainLayout}
                chart={mainChart}
              />
            </div>
          </div>
        )}
      </>
    ) : (
      <></>
    );
  }, [
    mainLayout,
    mainChart,
    subLayout,
    subChart,
    mainChartLocation,
    subChartLocation,
    setLayouts,
  ]);
}

function DualChart({
  mainChartLocation,
  subChartLocation,
  setLayouts,
  subLayout,
  subChart,
  mainLayout,
  mainChart,
}: {
  mainChartLocation: ChartLocationType;
  subChartLocation: ChartLocationType;
  setLayouts: UpdatePlotlyLayoutsType;
  subLayout: PlotlyLayoutType;
  subChart: ChartDataType[];
  mainLayout: PlotlyLayoutType;
  mainChart: ChartDataType[];
}) {
  const botColorMode = useColorModeContext();
  return useMemo(() => {
    const gutterClassName = Math.random().toString(36).slice(2, 7);
    return (
      <Splitter
        direction={SplitDirection.Vertical}
        initialSizes={[60, 40]}
        minHeights={[0, 0]}
        classes={getSplitterClasses(botColorMode)}
        gutterClassName={gutterClassName}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
          onMouseEnter={handleCrosshairOnMouseEnter}
          onMouseLeave={handleCrosshairOnMouseLeave}
        >
          <Chart
            chartLocation={mainChartLocation}
            setLayouts={setLayouts}
            layout={mainLayout}
            chart={mainChart}
          />
        </div>
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
          onMouseEnter={handleCrosshairOnMouseEnter}
          onMouseLeave={handleCrosshairOnMouseLeave}
        >
          <Chart
            chartLocation={subChartLocation}
            setLayouts={setLayouts}
            layout={subLayout}
            chart={subChart}
          />
        </div>
      </Splitter>
    );
  }, [
    botColorMode,
    mainChartLocation,
    setLayouts,
    mainLayout,
    mainChart,
    subChartLocation,
    subLayout,
    subChart,
  ]);
}

function Chart({
  chartLocation,
  setLayouts,
  layout,
  chart,
}: {
  chartLocation: ChartLocationType;
  setLayouts: UpdatePlotlyLayoutsType;
  layout: PlotlyLayoutType;
  chart: ChartDataType[];
}) {
  const [containerRef, { width, height }] = useMeasure();
  return useMemo(
    () => (
      <div
        style={{
          height: "100%",
          width: "100%",
        }}
        ref={containerRef}
      >
        <PlotlyChart
          chartLocation={chartLocation}
          setLayouts={setLayouts}
          layout={{
            ...layout,
            width,
            height,
          }}
          chartData={chart}
        />
      </div>
    ),
    [chart, chartLocation, containerRef, height, layout, setLayouts, width]
  );
}
