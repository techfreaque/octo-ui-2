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

  const mainLayout = layouts[chartLocations[0]];
  const mainChart = charts[chartLocations[0]];
  const subLayout = layouts[chartLocations[1]];
  const subChart = charts[chartLocations[1]];
  return useMemo(() => {
    return mainLayout && mainChart ? (
      <>
        {!window.matchMedia("(pointer: coarse)").matches && <Crosshair />}
        {subLayout && subChart ? (
          <DualChart
            chartLocations={chartLocations}
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
                chartLocation={chartLocations[0]}
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
  }, [mainLayout, mainChart, subLayout, subChart, chartLocations, setLayouts]);
}

function DualChart({
  chartLocations,
  setLayouts,
  subLayout,
  subChart,
  mainLayout,
  mainChart,
}: {
  chartLocations: ChartLocationType[];
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
            chartLocation={chartLocations[0]}
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
            chartLocation={chartLocations[1]}
            setLayouts={setLayouts}
            layout={subLayout}
            chart={subChart}
          />
        </div>
      </Splitter>
    );
  }, [
    botColorMode,
    chartLocations,
    mainChart,
    mainLayout,
    setLayouts,
    subChart,
    subLayout,
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
