// import React from "react";
// import ReactStockCharts from "../../../../components/Charts/ReactStockCharts";
// import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
// import { useBotPlottedElementsContext } from "../../../../context/data/BotPlottedElementsProvider";
// import { useCurrentPanelContext } from "../../../LayoutWidgets/SplitMainContent";
// import Legend from "../../PlotSources/Legend";

// export default function MainCharts(props) {
//   const botColors = useBotColorsContext();
//   const plottedElements = useBotPlottedElementsContext();
//   const currentPanel = useCurrentPanelContext()
//   if (plottedElements.plot_data) {
//     return currentPanel && (
//       <div>
//         <Legend />
//         <ReactStockCharts
//           type="hybrid"
//           plot_data={plottedElements.plot_data}
//           plot_sources={plottedElements.plot_sources}
//           height={currentPanel.size}
//           botColors={botColors}
//         />
//       </div>
//     );
//   } else {
//     return <></>;
//   }
// }
