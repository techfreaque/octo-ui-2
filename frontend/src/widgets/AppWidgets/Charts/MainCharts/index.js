import React from 'react';
import ReactStockCharts from '../../../../components/Charts/ReactStockCharts';
import { useBotColorsContext } from '../../../../context/BotColorsProvider';
import { useBotPlottedElementsContext } from '../../../../context/BotPlottedElementsProvider';

function MainCharts(props) {
  const botColors = useBotColorsContext()
  const plottedElements = useBotPlottedElementsContext()
  if (plottedElements.data) {
    return (
      <ReactStockCharts type="hybrid" 
                        data={plottedElements} 
                        {...props} 
                        botColors={botColors}/>
    );
  } else {
    return <></>
  }
}

export default MainCharts;
