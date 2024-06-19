import "./crosshair.css";

import Splitter, { SplitDirection } from "@devbookhq/splitter";
import { useMemo } from "react";
import { useEffect } from "react";

import { useColorModeContext } from "../../../../context/config/ColorModeProvider";
import { getSplitterClasses } from "../../../LayoutWidgets/SplitMainContent";
import type { ChartDataType, ChartsDataType } from "../ChartTablePieCombo";
import Crosshair, {
  handleCrosshairOnMouseEnter,
  handleCrosshairOnMouseLeave,
} from "./Crosshair";
import type {
  ChartLocationType} from "./Plotly";
import PlotlyChart, {
  allChartLocations,
  enableAxisSelect,
} from "./Plotly";
import type {
  PlotlyLayoutsType,
  PlotlyLayoutType,
  UpdatePlotlyLayoutsType,
} from "./PlotlyContext";

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
              <PlotlyChart
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
          <PlotlyChart
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
          <PlotlyChart
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
