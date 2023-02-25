import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { addToOptimizerQueue, startOptimizer, stopOptimizer } from "../../api/actions";
import { OPTIMIZER_INPUTS_KEY, OPTIMIZER_RUN_SETTINGS_KEY } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useSaveUiConfig, useUiConfigContext } from "../config/UiConfigProvider";
import { getOptimizerSettingsValues } from "../../widgets/AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";
import { useFetchOptimizerQueue } from "../data/OptimizerQueueProvider";

const BotIsOptimizingContext = createContext();
const UpdateBotIsOptimizingContext = createContext();

export const useBotIsOptimizingContext = () => {
  return useContext(BotIsOptimizingContext);
};
export const useUpdateBotIsOptimizingContext = () => {
  return useContext(UpdateBotIsOptimizingContext);
};

// export const useCheckIsOptimizing = () => {
//   const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
//   const botDomain = useBotDomainContext();
//   const logic = useCallback(() => {
//     return checkBotIsOptimizing(botDomain, setBotIsOptimizing);
//   }, [setBotIsOptimizing, botDomain]);
//   return logic;
// };

export const useStopOptimizer = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    stopOptimizer(botDomain, setBotIsOptimizing)
  }, [setBotIsOptimizing, botDomain]);
  return logic;
};

export const useStartOptimizer = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const uiSettigs = useUiConfigContext()
  const optimizerSettings = uiSettigs[OPTIMIZER_RUN_SETTINGS_KEY]
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext()
  const idsByExchangeName = botInfo && botInfo.ids_by_exchange_name
  const getAndSaveOptimizerForm = useGetAndSaveOptimizerForm()
  const logic = useCallback(() => {
    if (optimizerSettings && idsByExchangeName) {
      startOptimizer(botDomain, optimizerSettings, getAndSaveOptimizerForm, idsByExchangeName, setBotIsOptimizing)
    }
  }, [setBotIsOptimizing, botDomain, optimizerSettings, idsByExchangeName, getAndSaveOptimizerForm]);
  return logic;
};

export const useAddToOptimizerQueue = () => {
  const setBotIsOptimizing = useUpdateBotIsOptimizingContext();
  const uiSettigs = useUiConfigContext()
  const optimizerSettings = uiSettigs[OPTIMIZER_RUN_SETTINGS_KEY]
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext()
  const exchageId = botInfo && botInfo.exchange_id
  const getAndSaveOptimizerForm = useGetAndSaveOptimizerForm()
  const fetchOptimizerQueue = useFetchOptimizerQueue()

  const logic = useCallback(() => {
    if (optimizerSettings && exchageId) {

      addToOptimizerQueue(
        botDomain, optimizerSettings, getAndSaveOptimizerForm(),
        exchageId, setBotIsOptimizing, fetchOptimizerQueue)
    }
  }, [setBotIsOptimizing, botDomain, optimizerSettings, exchageId, getAndSaveOptimizerForm, fetchOptimizerQueue]);
  return logic;
};

export const useGetAndSaveOptimizerForm = () => {
  const saveUiConfig = useSaveUiConfig()
  const uiConfig = useUiConfigContext()
  const logic = useCallback(() => {
    const optimizerForm = getOptimizerSettingsValues()
    const newSettings = { ...uiConfig, [OPTIMIZER_INPUTS_KEY]: optimizerForm }
    saveUiConfig(newSettings)
    return optimizerForm
  }, [saveUiConfig, uiConfig]);
  return logic;
};

export const BotOptimizerProvider = ({ children }) => {
  const [botIsOptimizing, setBotIsOptimizing] = useState(false);
  // todo handle progress
  return (
    <BotIsOptimizingContext.Provider value={botIsOptimizing}>
      <UpdateBotIsOptimizingContext.Provider value={setBotIsOptimizing}>
        {children}
      </UpdateBotIsOptimizingContext.Provider>
    </BotIsOptimizingContext.Provider>
  );
};
