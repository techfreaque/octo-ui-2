import React from 'react';
import ReactStockCharts from '../../../../components/Charts/ReactStockCharts';
import { useBotColorsContext } from '../../../../context/BotColorsProvider';
import { useBotPlottedElementsContext } from '../../../../context/BotPlottedElementsProvider';
import Legend from '../../PlotSources/Legend';

function MainCharts(props) {
  const botColors = useBotColorsContext()
  const plottedElements = useBotPlottedElementsContext()
  // console.log(plottedElements)
  if (plottedElements.plot_data) {
    return (
      <div>
        <Legend/>
        <ReactStockCharts type="hybrid" 
                          plot_data={plottedElements.plot_data} 
                          plot_sources={plottedElements.plot_sources}
                          dimensions={props.dimensions} 
                          botColors={botColors}/>
                        </div>
    );
  } else {
    return <></>
  }
}

export default MainCharts;
