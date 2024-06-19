import type { Datum } from "plotly.js";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

import { emptyValueFunction } from "../../../../helpers/helpers";
import type { ChartLocationType } from "./Plotly";
import type { AxisType } from "./PlotlyGenerateData";

export type PlotlyLayoutsType = {
  [chartLocation in ChartLocationType]?: PlotlyLayoutType | undefined;
};

export interface PlotlyLayoutType extends PlotlyAxisLayouts {
  autosize: boolean;
  hovermode: "x unified" | false;
  hoverlabel?: {
    bgcolor: string;
    bordercolor: string;
  };
  margin: {
    l: number;
    r: number;
    b: number;
    t: number;
    pad: number;
  };
  showlegend: boolean;
  legend: {
    x: number;
    xanchor: "left";
    y: number;
    yanchor: "top";
  };
  paper_bgcolor: string;
  plot_bgcolor: string;
  dragmode: "pan";
  font: {
    color: "#b2b5be";
  };
  width: number;
  height?: number;
  grid?: {
    rows: number;
    columns: number;
  };
}

type PlotlyAxisLayouts = {
  [axisKey in AxisType]?: PlotlyAxisLayout;
};

export interface PlotlyAxisLayout {
  type?: "date" | "log" | "linear";
  autorange: boolean;
  gridcolor: string;
  color: string;
  rangeslider?: {
    visible: boolean;
  };
  showspikes: boolean;
  domain?: [number, number];
  side?: "top" | "left" | "right";
  fixedrange?: boolean;
  overlaying?: "x" | "y";
  anchor?: "free";
  position?: number;
  range?: [Datum, Datum];
  maxRange?: [string, string];
}

export type UpdatePlotlyLayoutsType = {
  [chartLocation in ChartLocationType]: Dispatch<
    SetStateAction<PlotlyLayoutType | undefined>
  >;
};

const UpdatePlotlyLayoutsContext = createContext<UpdatePlotlyLayoutsType>({
  "main-chart": emptyValueFunction,
  "sub-chart": emptyValueFunction,
  "pie-chart": emptyValueFunction,
  b: emptyValueFunction,
});
const PlotlyLayoutsContext = createContext<PlotlyLayoutsType>({
  "main-chart": undefined,
  "sub-chart": undefined,
  "pie-chart": undefined,
  b: undefined,
});

export const useUpdatePlotlyLayoutsContext = () => {
  return useContext(UpdatePlotlyLayoutsContext);
};

export const usePlotlyLayoutsContext = () => {
  return useContext(PlotlyLayoutsContext);
};

export const PlotlyLayoutsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [mainLayouts, setMainLayouts] = useState<PlotlyLayoutType>();
  const [subLayouts, setSubLayouts] = useState<PlotlyLayoutType>();
  const [pieChartLayouts, setPieChartLayouts] = useState<PlotlyLayoutType>();
  const [backtestingLayouts, setBacktestingLayouts] =
    useState<PlotlyLayoutType>();
  return (
    <UpdatePlotlyLayoutsContext.Provider
      value={{
        "main-chart": setMainLayouts,
        "sub-chart": setSubLayouts,
        "pie-chart": setPieChartLayouts,
        b: setBacktestingLayouts,
      }}
    >
      <PlotlyLayoutsContext.Provider
        value={{
          "main-chart": mainLayouts,
          "sub-chart": subLayouts,
          "pie-chart": pieChartLayouts,
          b: backtestingLayouts,
        }}
      >
        {children}
      </PlotlyLayoutsContext.Provider>
    </UpdatePlotlyLayoutsContext.Provider>
  );
};
