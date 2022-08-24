import React from "react";

import DefaultLayout from "./DefaultLayout/index.js";


const KeysToComponentMap = {
    DefaultLayout: DefaultLayout
  };
  
  
export default function LayoutWidgets(props) {
    const config = props.currentPage.layout
    return config.map(element => {
        if (typeof KeysToComponentMap[element.component] !== "undefined") {
          return React.createElement(
            KeysToComponentMap[element.component],
            {
                key: element.id,
                botDataManager: props.botDataManager,
                ...element,
            },
            element.children &&
              (typeof element.children === "string"
                ? element.children
                : element.children.map(c => LayoutWidgets(c)))
          );
        } else {
            console.log("error loading widget: "+element)
            return <></>
        }
    })
  }


// export default function LayoutWidgets(props) {
//     return props.layout.map(element => {
//         if (element.widget === "Header"){
//             return (
//                 <div key={element.i}>
//                     <Header
//                         timeframes={props.botDataManager.mainBotData.time_frames} 
//                         symbols={props.botDataManager.mainBotData.symbols} 
//                         exchange_name={props.botDataManager.mainBotData.exchange_name}/>
//                 </div>)
//         } else if (element.widget === "MainCharts"){
//             return (
//                 <div key={element.i}>
//                     <MainCharts
//                         symbols={props.botDataManager.mainBotData.symbols} 
//                         data={props.botDataManager.botPlotData} 
//                         width={window.innerWidth}/>
//                 </div>)
//         } else if (element.widget === "Footer"){
//             return (<div key={element.i}><Footer/></div>)
//         }
//     })
// }