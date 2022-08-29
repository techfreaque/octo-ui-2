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
import {
	OHLCTooltip,
} from "react-stockcharts/lib/tooltip";
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
		console.log("reset")
		this.setState({
			suffix: this.state.suffix + 1
		});
	}
	render() {
		const initialData = this.props.data.data
		const plottedData = this.props.data.plot_sources.main_chart
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
		function candlesYAccessor(dataSet, dataTitle) {
			const data = dataSet.data[dataTitle]
			return { open: data.open, high: data.high, 
				low: data.low, close: data.close, 
				volume: data.volume, date: dataSet.x};
		}
		function defaultYAccessor(data, title) {
			try {
				return data[title].y
			} catch {
				return undefined
			}
		}

		const margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const gridHeight = this.props.dimensions.height - margin.top - margin.bottom;
		const gridWidth = this.props.botDataManager.dimensions.windowWidth - margin.left - margin.right;
		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

		if (this.props.data.data.length === 0){
			console.log("no data to plot on Chart")
			return <></>
		}
		return (
				<ChartCanvas 
						ratio={1} 
						width={this.props.botDataManager.dimensions.windowWidth}
						height={this.props.dimensions.height}
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
					<Chart id={1}
							yExtents={d => [d.data.candles.low, d.data.candles.high]}>
						<XAxis 
							axisAt="bottom"
							orient="bottom" 
							tickStroke={this.props.botDataManager.colors.font}
							stroke={this.props.botDataManager.colors.border}
							{...xGrid}
							/>
						<YAxis
							axisAt="left"
							orient="left"
							tickStroke={this.props.botDataManager.colors.font}
							stroke={this.props.botDataManager.colors.border}
							{...yGrid}
							onDoubleClick={this.resetYDomain}
						/>
						<MouseCoordinateX
							at="bottom"
							orient="bottom"
							displayFormat={timeFormat("%Y-%m-%d %H:%M")} 
							/>
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")} />

						{plottedData.map(plot => {
							if (plot.type === "candlestick") {
								return (<div key={plot.title}>
											<CandlestickSeries key={plot.title} yAccessor={d => candlesYAccessor(d, plot.title)}
															stroke={d => d.close > d.open 
																? this.props.botDataManager.colors.candles.border.green 
																: this.props.botDataManager.colors.candles.border.red}
															wickStroke={d => d.close > d.open 
																? this.props.botDataManager.colors.candles.wick.green 
																: this.props.botDataManager.colors.candles.wick.red}
															fill={d => d.close > d.open 
																? this.props.botDataManager.colors.candles.body.green 
																: this.props.botDataManager.colors.candles.body.red}
											/>
											<OHLCTooltip forChart={1} key={plot.title+"tt"} 
													accessor={d => candlesYAccessor(d, plot.title)} 
													origin={[10, -10]} textFill={this.props.botDataManager.colors.font}
													// labelFill={this.props.botDataManager.colors.fontActive}
													/>
										</div>)
							} else if (plot.mode === "markers") {
								return <ScatterSeries key={plot.title} yAccessor={d => defaultYAccessor(d.data, plot.title)} 
											marker={TriangleMarker} 
											markerProps={{ width: 8, stroke: "#2ca02c", fill: "#2ca02c" }}
											/>
							} else {
								return <LineSeries key={plot.title} yAccessor={d => defaultYAccessor(d.data, plot.title)} />
							}
						})}
							
						<ZoomButtons
							onReset={this.handleReset}
						/>
					</Chart>
					<CrossHairCursor stroke={this.props.botDataManager.colors.font} />
				</ChartCanvas>
		);
	}
}

// ReactStockCharts = fitWidth(ReactStockCharts);

export default ReactStockCharts;