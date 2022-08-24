import React, { useRef } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	ScatterSeries,
	SquareMarker,
	TriangleMarker,
	CircleMarker,
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
import {
	OHLCTooltip,
} from "react-stockcharts/lib/tooltip";
import { last } from "react-stockcharts/lib/utils";

export default function ReactStockCharts (props) {
	const { data: preInitialData, type, dimensions, botDataManager } = props;
	const initialData = preInitialData.data
	const plottedData = preInitialData.plot_sources.main_chart
	const xScaleProvider = discontinuousTimeScaleProvider
		.inputDateAccessor(d => new Date(d.x));
	const {
		data,
		xScale,
		xAccessor,
		displayXAccessor,
	} = xScaleProvider(initialData);
	const xExtents = [
		xAccessor(last(data)),
		xAccessor(data[data.length - 20])
	];
	function candlesYAccessor(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	}
	function defaultYAccessor(data, title) {
		try {
			return data[title].y
		} catch {
			return undefined
		}
	}
	return (
			// <ChartCanvas ratio={1} width={dimensions.width} height={dimensions.height}
			<ChartCanvas 
					ratio={1} 
					width={botDataManager.dimensions.windowWidth}
					height={dimensions.height}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					type={type}
					pointsPerPxThreshold={1000}
					seriesName="Main-Chart"
					data={data}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xScale={xScale}
					xExtents={xExtents}
			>
				<Chart id={1}
						yExtents={d => [d.data.candles.low, d.data.candles.high]}>
					<XAxis 
						axisAt="bottom"
						orient="bottom" 
						stroke={props.botDataManager.colors.font}
						tickStroke={props.botDataManager.colors.font}
						/>
					<YAxis
						axisAt="right"
						orient="right"
						tickStroke={props.botDataManager.colors.font}
						stroke={props.botDataManager.colors.font}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} 
						/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					{plottedData.map(plot => {
						if (plot.type === "candlestick") {
							return <CandlestickSeries key={plot.title} yAccessor={d => candlesYAccessor(d.data[plot.title])}
								stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
								wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
								fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}
									/>
						} else if (plot.type === "markers") {
							return <ScatterSeries key={plot.title} yAccessor={d => defaultYAccessor(d.data, plot.title)} 
										marker={TriangleMarker} markerProps={{ width: 8, stroke: "#2ca02c", fill: "#2ca02c" }}/>
						} else {
							return <LineSeries key={plot.title} yAccessor={d => defaultYAccessor(d.data, plot.title)} />
						}
					})}
						
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</Chart>
				{/* <CrossHairCursor stroke={props.botDataManager.colors} /> */}
			</ChartCanvas>
	);
}
