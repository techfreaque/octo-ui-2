import { PlotRelayoutEvent } from "plotly.js";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import { PlotlyLayoutType, UpdatePlotlyLayoutsType } from "./PlotlyContext";
import { ChartDataType } from "../ChartTablePieCombo";
import { objectKeys } from "../../../../helpers/helpers";

export type ChartLocationType = "main-chart" | "sub-chart" | "pie-chart" | "b";

export type NonChartLocationTypes = "table";

export const allChartLocations: ChartLocationType[] = [
  "main-chart",
  "sub-chart",
];

export default function PlotlyChart({
  chartLocation,
  setLayouts,
  layout,
  chartData,
}: {
  chartLocation: ChartLocationType;
  setLayouts: UpdatePlotlyLayoutsType;
  layout: PlotlyLayoutType;
  chartData: ChartDataType[];
}) {
  return useMemo(
    () => {
      const divId = getDivId(chartLocation);
      return (
        chartData &&
        layout && (
          <Plot
            data={chartData}
            layout={JSON.parse(JSON.stringify(layout))}
            config={getPlotlyConfig()}
            divId={divId}
            onRelayout={(chart) => {
              relayout(chart, chartLocation, setLayouts);
            }}
          />
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartData, chartLocation, JSON.stringify(layout)]
  );
}

interface ChartDiv extends HTMLElement {
  layout?: PlotlyLayoutType;
}

function relayout(
  ed: Readonly<PlotRelayoutEvent>,
  chartLocation: ChartLocationType,
  setLayouts: UpdatePlotlyLayoutsType
) {
  if (Object.entries(ed).length === 0) {
    return;
  }
  const thisChartDiv: ChartDiv | null = document.getElementById(
    getDivId(chartLocation)
  );
  if (thisChartDiv?.layout) {
    objectKeys(setLayouts).forEach((otherChartLocation) => {
      if (
        otherChartLocation !== chartLocation &&
        allChartLocations.includes(otherChartLocation)
      ) {
        const chartDiv: ChartDiv | null = document.getElementById(
          getDivId(otherChartLocation)
        );
        if (chartDiv?.layout) {
          const newLayout = {
            ...chartDiv.layout,
          };
          const x = newLayout.xaxis;
          const x2 = newLayout.xaxis2;
          const y = newLayout.yaxis;
          const y2 = newLayout.yaxis2;
          const y3 = newLayout.yaxis3;
          const y4 = newLayout.yaxis4;

          if (ed[xAutorange] && ed[yAutorange]) {
            if (x && thisChartDiv.layout?.xaxis?.maxRange) {
              x.range = [
                thisChartDiv.layout.xaxis.maxRange[0],
                thisChartDiv.layout.xaxis.maxRange[1],
              ];
              x.autorange = false;
            }
            if (x2 && thisChartDiv.layout?.xaxis?.maxRange) {
              x2.range = [
                thisChartDiv.layout.xaxis.maxRange[0],
                thisChartDiv.layout.xaxis.maxRange[1],
              ];

              x2.autorange = false;
            }
            if (y) {
              y.autorange = true;
              y.range = [null, null];
            }
            if (y2) {
              y2.autorange = true;
              y2.range = [null, null];
            }
            if (y3) {
              y3.autorange = true;
              y3.range = [null, null];
            }
            if (y4) {
              y4.autorange = true;
              y4.range = [null, null];
            }

            setLayouts[otherChartLocation](newLayout);
          } else if (ed[xRange0]) {
            if (x) {
              x.autorange = false;
              x.range = [ed[xRange0] || null, ed[xRange1] || null];
            }
            if (x2) {
              x2.autorange = false;
              x2.range = [ed[xRange0] || null, ed[xRange1] || null];
            }
            if (y) {
              y.autorange = true;
              y.range = [null, null];
            }
            if (y2) {
              y2.autorange = true;
              y2.range = [null, null];
            }
            if (y3) {
              y3.autorange = true;
              y3.range = [null, null];
            }
            if (y4) {
              y4.autorange = true;
              y4.range = [null, null];
            }
            setLayouts[otherChartLocation](newLayout);
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
    });
  }
}

const xAutorange = "xaxis.autorange";
const xRange0 = "xaxis.range[0]";
const xRange1 = "xaxis.range[1]";
const yAutorange = "yaxis.autorange";
const yRange0 = "yaxis.range[0]";
// const yRange1 = 'yaxis.range[1]'

export function getDivId(chartLocation: ChartLocationType) {
  return `plotly${chartLocation}`;
}

export function getPlotlyConfig(): Partial<Plotly.Config> {
  return {
    scrollZoom: true,
    modeBarButtonsToRemove: ["select2d", "lasso2d", "toggleSpikelines"],
    responsive: true,
    showEditInChartStudio: false,
    displaylogo: false, // no logo to avoid 'rel="noopener noreferrer"' security issue (see https://webhint.io/docs/user-guide/hints/hint-disown-opener/)
  };
}

export function enableAxisSelect() {
  // allow moving chart for selected y scale layer
  const yaxis_resize_layers = document.getElementsByClassName(
    "nsdrag drag cursor-ns-resize"
  );
  if (yaxis_resize_layers) {
    Array.from(yaxis_resize_layers).forEach((yaxis_drag_layer) => {
      if (yaxis_drag_layer.getAttribute("listener") !== "true") {
        yaxis_drag_layer.addEventListener("click", (e) => {
          yaxis_drag_layer.parentElement?.parentElement?.append(
            yaxis_drag_layer.parentElement
          );
        });
        yaxis_drag_layer.setAttribute("listener", "true");
      }
    });
  }
}
