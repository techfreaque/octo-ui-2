import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { addToOptimizerQueue, startOptimizer, stopOptimizer } from "../../api/actions";
import { OPTIMIZER_RUN_SETTINGS_KEY } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useSaveUiConfig, useUiConfigContext } from "../config/UiConfigProvider";
import { getOptimizerSettingsValues } from "../../widgets/AppWidgets/Configuration/OptimizerConfigForm/OptimizerConfigForm";

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
  const exchageId = botInfo && botInfo.exchange_id
  const getAndSaveOptimizerForm = useGetAndSaveOptimizerForm()
  const logic = useCallback(() => {
    if (optimizerSettings && exchageId) {
      startOptimizer(botDomain, optimizerSettings, getAndSaveOptimizerForm, exchageId, setBotIsOptimizing)
    }
  }, [setBotIsOptimizing, botDomain, optimizerSettings, exchageId, getAndSaveOptimizerForm]);
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
  const logic = useCallback(() => {
    if (optimizerSettings && exchageId) {
      addToOptimizerQueue(botDomain, optimizerSettings, getAndSaveOptimizerForm, exchageId, setBotIsOptimizing)
    }
  }, [setBotIsOptimizing, botDomain, optimizerSettings, exchageId, getAndSaveOptimizerForm]);
  return logic;
};

export const useGetAndSaveOptimizerForm = () => {
  const saveUiConfig = useSaveUiConfig()
  const logic = useCallback(() => {
    const optimizerForm = getOptimizerSettingsValues()
    saveUiConfig(prevConfig => ({ ...prevConfig, ...optimizerForm })
    )
    return optimizerForm
  }, [saveUiConfig]);
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
