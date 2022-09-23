import React, {
  useState,
  useContext,
  createContext,
  // useCallback,
} from "react";
// import { fetchLiveRunData } from "../api/botData";
// import { useBotDomainContext } from "./BotDomainProvider";
// import { useUiConfigContext, useUpdateUiConfigContext } from "./UiConfigProvider";

const LiveRunDataContext = createContext();
const UpdateLiveRunDataContext = createContext();

export const useLiveRunDataContext = () => {
  return useContext(LiveRunDataContext);
};

export const useUpdateLiveRunDataContext = () => {
  return useContext(UpdateLiveRunDataContext);
};

// export const useFetchLiveRunData = () => {
//   const setLiveRunData = useUpdateLiveRunDataContext();
//   const botDomain = useBotDomainContext();
//   const uiConfig = useUiConfigContext()
//   const setUiConfig = useUpdateUiConfigContext()
//   const logic = useCallback(() => {
//     uiConfig.optimizer_campaigns_to_load
//       && fetchLiveRunData(
//         setLiveRunData, setUiConfig, botDomain,
//         false, { ...uiConfig.optimizer_campaigns_to_load }
//       )
//   }, [setLiveRunData, botDomain, uiConfig, setUiConfig]);
//   return logic;
// };

export const LiveRunDataProvider = ({ children }) => {
  const [liveRunData, setLiveRunData] = useState({});
  return (
    <LiveRunDataContext.Provider value={liveRunData}>
      <UpdateLiveRunDataContext.Provider value={setLiveRunData}>
        {children}
      </UpdateLiveRunDataContext.Provider>
    </LiveRunDataContext.Provider>
  );
};
