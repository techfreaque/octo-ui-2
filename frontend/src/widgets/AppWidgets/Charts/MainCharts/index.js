import React from 'react';
// import Charts from '../Charts/SyncFusionCharts';
import ReactStockCharts from '../../../../components/Charts/ReactStockCharts';
import GridLayout from "react-grid-layout";



function MainCharts(props) {
    if (props.botDataManager.botPlotData) {
      return (

        <ReactStockCharts type="hybrid" data={props.botDataManager.botPlotData} {...props}/>

        // <Charts 
        //   symbols={props.botDataManager.mainBotData.symbols} 
        //   data={props.botDataManager.botPlotData} />         
          
          
        // <GridLayout
        //     className="layout"
        //     layout={props.layout}
        //     cols={12}
        //     rowHeight={30}
        //     width={window.innerWidth}
        //     height={300}
        //     >
        //     <div>
        //     </div>
        //   </GridLayout>
      );

    } else {
      return <></>
    }
}

export default MainCharts;
