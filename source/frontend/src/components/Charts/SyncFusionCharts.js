import * as React from "react";
import {
  DataLabel,
  DateTime,
  Category,
  ChartComponent,
  ColumnSeries,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
  Zoom,
  Crosshair,
  HiloOpenCloseSeries,
} from "@syncfusion/ej2-react-charts";
export default function SyncFusionCharts(props) {
  if (props.data) {
    // const primaryxAxis = { valueType: 'Category' };
    const primaryXAxis = {
      valueType: "DateTime",
      labelFormat: "yMd",
      enableAutoIntervalOnZooming: true,
      crosshairTooltip: { enable: true },
    };
    const primaryYAxis = {
      enableAutoIntervalOnZooming: true,
      crosshairTooltip: { enable: true },
    };
    const zoomSettings = {
      enableMouseWheelZooming: true,
      enablePinchZooming: true,
    };
    const tooltip = {
      enable: true,
      shared: true,
      format: "${series.name} : ${point.x} : ${point.y}",
    };
    const crosshair = { enable: true };
    const legendSettings = { visible: true, position: "Top" };
    const charts = props.data.map((element) => {
      if (element.kind === "candlestick") {
        return (
          <SeriesDirective key={element.title}
          dataSource={element.data}
          xName="x"
          yName="low"
          name={element.title}
          type="HiloOpenClose"
          low="low"
          high="high"
          open="open"
          close="close" />
        );
      } else if (element.mode === "lines") {
        return (
          <SeriesDirective
            key={element.title}
            dataSource={element.data}
            xName="x"
            type="Line"
            yName="y"
            name={element.title}
          />
        );
      } else if (element.mode === "markers") {
        return (
          <SeriesDirective
            key={element.title}
            dataSource={element.data}
            xName="x"
            type="Line"
            yName="y"
            name={element.title}
          />
        );
      } else {
        return null;
      }
    });
    return (
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <ChartComponent
          id="charts"
          crosshair={crosshair}
          primaryXAxis={primaryXAxis}
          primaryYAxis={primaryYAxis}
          width="100%"
          height={props.height ? props.height : "200"}
          zoomSettings={zoomSettings}
          enableCanvas
          tooltip={tooltip}
          legendSettings={legendSettings}
        >
          <Inject
            services={[
              ColumnSeries,
              Legend,
              LineSeries,
              Category,
              Tooltip,
              Crosshair,
              Zoom,
              HiloOpenCloseSeries,
              DataLabel,
              DateTime,
            ]}
          />
          <SeriesCollectionDirective>{charts}</SeriesCollectionDirective>
        </ChartComponent>
      </div>
    );
  } else {
    return <></>;
  }
}
