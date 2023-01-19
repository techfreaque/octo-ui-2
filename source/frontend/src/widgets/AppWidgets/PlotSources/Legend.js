// import React, { useState } from "react";
// import { Button, Chip } from "@mui/material";
// import "./legend.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
// import { useBotPlottedElementsContext, useUpdateBotPlottedElementsContext } from "../../../context/data/BotPlottedElementsProvider";

// export default function Legend() {
//   const plottedElements = useBotPlottedElementsContext();

//   const [legendOpen, setLegendOpen] = useState(true);
//   function toggleLegend() {
//     setLegendOpen((prevState) => !prevState);
//   }

//   if (plottedElements.plot_sources) {
//     return (
//       <div>
//         <div className="legend-container">
//           {legendOpen && <LegendElements plottedElements={plottedElements} />}
//           <Button onClick={toggleLegend} variant="outlined">
//             <FontAwesomeIcon icon={legendOpen ? faArrowUp : faArrowDown} />
//           </Button>
//         </div>
//       </div>
//     );
//   } else {
//     return <></>;
//   }
// }

// function LegendElements({ plottedElements }) {
//   const updatePlottedElements = useUpdateBotPlottedElementsContext();
//   function handleChange(event) {
//     updatePlottedElements((prevElements) => {
//       const sourceId = event.target.id
//         ? event.target.id
//         : event.target.parentElement.id;
//       const [chartLocation, id] = sourceId.split("/");
//       prevElements.plot_sources[chartLocation][id].enabled =
//         prevElements.plot_sources[chartLocation][id].enabled !== false
//           ? false
//           : true;
//       return { ...prevElements };
//     });
//   }
//   return Object.keys(plottedElements.plot_sources).map(
//     (chartLocation, chartIndex) => {
//       return (
//         <div key={chartIndex}>
//           <p className="mb-0">{chartLocation}</p>
//           {plottedElements.plot_sources[chartLocation].map(
//             (plotElement, index) => {
//               return (
//                 <div key={index}>
//                   <Chip
//                     key={index}
//                     variant="outlined"
//                     color={
//                       plotElement.enabled !== false ? "primary" : undefined
//                     }
//                     size="small"
//                     label={plotElement.title}
//                     id={chartLocation + "/" + index}
//                     onClick={(event) => handleChange(event)}
//                     // icon={<FaceIco />}
//                   />
//                 </div>
//               );
//             }
//           )}
//         </div>
//       );
//     }
//   );
// }
