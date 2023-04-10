// import React, {
//   useState,
//   useContext,
//   createContext,
//   useCallback,
//   // useCallback,
// } from "react";
// import { fetchLiveRunData } from "../../api/data";
// import { useBotDomainContext } from "../config/BotDomainProvider";
// import { useBotInfoContext } from "./BotInfoProvider";
// // import { fetchLiveRunData } from "../api/botData";
// // import { useBotDomainContext } from "./BotDomainProvider";
// // import { useUiConfigContext, useUpdateUiConfigContext } from "./UiConfigProvider";

// const LiveRunDataContext = createContext();
// const UpdateLiveRunDataContext = createContext();

// export const useLiveRunDataContext = () => {
//   return useContext(LiveRunDataContext);
// };

// export const useUpdateLiveRunDataContext = () => {
//   return useContext(UpdateLiveRunDataContext);
// };

// export const useFetchLiveRunData = () => {
//   const setLiveRunData = useUpdateLiveRunDataContext();
//   const botDomain = useBotDomainContext();
//   const botInfo = useBotInfoContext();
//   const logic = useCallback(() => {
//     botInfo?.live_id && fetchLiveRunData(botInfo.live_id, setLiveRunData, botDomain)
//   }, [setLiveRunData, botDomain, botInfo?.live_id]);
//   return logic;
// };

// export const LiveRunDataProvider = ({ children }) => {
//   const [liveRunData, setLiveRunData] = useState({});
//   return (
//     <LiveRunDataContext.Provider value={liveRunData}>
//       <UpdateLiveRunDataContext.Provider value={setLiveRunData}>
//         {children}
//       </UpdateLiveRunDataContext.Provider>
//     </LiveRunDataContext.Provider>
//   );
// };
