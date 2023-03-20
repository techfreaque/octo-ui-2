import React, {
  useState,
  useContext,
  createContext,
  useCallback
} from "react";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useFetchPlotData } from "../data/BotPlottedElementsProvider";
import { useBotDomainContext } from "./BotDomainProvider";


const TentaclesConfigContext = createContext();
const UpdateTentaclesConfigContext = createContext();
const HiddenBacktestingMetadataColumnsContext = createContext();
const UpdateHiddenBacktestingMetadataColumnsContext = createContext();


export const useTentaclesConfigContext = () => {
  return useContext(TentaclesConfigContext);
};
export const useUpdateTentaclesConfigContext = () => {
  return useContext(UpdateTentaclesConfigContext);
};
export const useHiddenBacktestingMetadataColumnsContext = () => {
  return useContext(HiddenBacktestingMetadataColumnsContext);
};
export const useUpdateHiddenBacktestingMetadataColumnsContext = () => {
  return useContext(UpdateHiddenBacktestingMetadataColumnsContext);
};

export const useFetchTentaclesConfig = () => {
  const updateTentaclesConfig = useUpdateTentaclesConfigContext();
  const botDomain = useBotDomainContext()
  const logic = useCallback((tentacles, successCallback = null) => {
    const failure = (updated_data, update_url, result, msg, status) => {
      createNotification("Failed to fetch tentacles config", "danger", msg?.message)
    }
    const success = (updated_data, update_url, result, msg, status) => {
      if (msg?.success) {
        updateTentaclesConfig(msg?.data)
        successCallback && successCallback(updated_data, update_url, result, msg, status)
      } else {
        failure(updated_data, update_url, result, msg, status)
      }
    }
    sendAndInterpretBotUpdate({ tentacles: tentacles }, botDomain + backendRoutes.fetchTentaclesConfig, success, failure, "POST")
  }, [botDomain, updateTentaclesConfig]);
  return logic;
};

export function getEnabledTentaclesList(botInfo) {
  const tentacles = []
  botInfo?.strategy_names && tentacles.push(...botInfo.strategy_names)
  botInfo?.evaluator_names && tentacles.push(...botInfo.evaluator_names)
  botInfo?.trading_mode_name && tentacles.push(botInfo.trading_mode_name)
  return tentacles
}

export const useFetchCurrentTentaclesConfig = () => {
  const loadTentaclesConfig = useFetchTentaclesConfig();
  const botInfo = useBotInfoContext()
  const logic = useCallback((successCallback = null) => {
    const tentacles = getEnabledTentaclesList(botInfo)
    loadTentaclesConfig(tentacles, successCallback)
  }, [botInfo, loadTentaclesConfig]);
  return logic;
};


export const useSaveTentaclesConfig = () => {
  const fetchPlotData = useFetchPlotData();
  const loadCurrentTentaclesConfig = useFetchCurrentTentaclesConfig();
  const botDomain = useBotDomainContext()
  const logic = useCallback((newConfigs, setIsSaving, reloadPlots = false) => {
    const failure = (updated_data, update_url, result, msg, status) => {
      setIsSaving && setIsSaving(false)
      createNotification(msg)
    }
    const onFinish = (updated_data, update_url, result, msg, status) => {
      setIsSaving && setIsSaving(false)
      createNotification("Successfully save tentacles config")
      reloadPlots && fetchPlotData()
    }
    const success = (updated_data, update_url, result, msg, status) => {
      loadCurrentTentaclesConfig(onFinish)
    }
    sendAndInterpretBotUpdate(newConfigs, botDomain + backendRoutes.updateTentaclesConfig, success, failure)
  }, [botDomain, fetchPlotData, loadCurrentTentaclesConfig]);
  return logic;
};

export const useSaveTentaclesConfigAndSendAction = () => {
  const fetchPlotData = useFetchPlotData();
  const botDomain = useBotDomainContext()
  const logic = useCallback((newConfigs, actionType, setIsLoading, reloadPlots = false, successCallback = undefined, failureCallback = undefined) => {
    const fail = (updated_data, update_url, result, msg, status) => {
      setIsLoading(false)
      createNotification("Failed to executed trading mode", "danger")
    }
    const success = (updated_data, update_url, result, msg, status) => {
      reloadPlots && fetchPlotData()
      setIsLoading(false)
      createNotification("Successfully executed trading mode")
    }
    sendAndInterpretBotUpdate(newConfigs, botDomain + backendRoutes.updateTentaclesConfigAndSendCommand + "/" + actionType, successCallback || success, fail || failureCallback)
  }, [fetchPlotData, botDomain]);
  return logic;
};

export const TentaclesConfigProvider = ({ children }) => {
  const [tentaclesConfig, setTentaclesConfig] = useState();
  return (
    <TentaclesConfigContext.Provider value={tentaclesConfig}>
      <UpdateTentaclesConfigContext.Provider value={setTentaclesConfig}>
        {children}
      </UpdateTentaclesConfigContext.Provider>
    </TentaclesConfigContext.Provider>
  )
};
