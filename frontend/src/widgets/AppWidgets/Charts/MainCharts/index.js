import React from 'react';
import ReactStockCharts from '../../../../components/Charts/ReactStockCharts';

function MainCharts(props) {
    if (props.botDataManager.botPlotData) {
      return (
        <ReactStockCharts type="hybrid" data={props.botDataManager.botPlotData} {...props}/>
      );
    } else {
      return <></>
    }
}

export default MainCharts;
