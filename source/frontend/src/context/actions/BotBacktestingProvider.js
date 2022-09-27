import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { startBacktesting, stopBacktesting } from "../../api/actions";
import { BACKTESTING_RUN_SETTINGS_KEY } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";

const BotIsBacktestingContext = createContext();
const UpdateBotIsBacktestingContext = createContext();

export const useBotIsBacktestingContext = () => {
  return useContext(BotIsBacktestingContext);
};

export const useUpdateBotIsBacktestingContext = () => {
  return useContext(UpdateBotIsBacktestingContext);
};

// export const useCheckIsBacktesting = () => {
//   const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
//   const botDomain = useBotDomainContext();
//   const logic = useCallback(() => {
//     return checkBotIsBacktesting(botDomain, setBotIsBacktesting);
//   }, [setBotIsBacktesting, botDomain]);
//   return logic;
// };

export const useStopBacktesting = () => {
  const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
  const botDomain = useBotDomainContext();
  const logic = useCallback(() => {
    stopBacktesting(botDomain, setBotIsBacktesting)
  }, [setBotIsBacktesting, botDomain]);
  return logic;
};

export const useStartBacktesting = () => {
  const setBotIsBacktesting = useUpdateBotIsBacktestingContext();
  const uiSettigs = useUiConfigContext()
  const backtestingSettings = uiSettigs[BACKTESTING_RUN_SETTINGS_KEY]
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext()
  const exchageId = botInfo && botInfo.exchange_id
  const logic = useCallback(() => {
    if (backtestingSettings && exchageId) {
      startBacktesting(botDomain, backtestingSettings, exchageId, setBotIsBacktesting)
    }
  }, [setBotIsBacktesting, botDomain, backtestingSettings, exchageId]);
  return logic;
};

export const BotBacktestingProvider = ({ children }) => {
  const [botIsBacktesting, setBotIsBacktesting] = useState(false);
  // todo handle progress
  return (
    <BotIsBacktestingContext.Provider value={botIsBacktesting}>
      <UpdateBotIsBacktestingContext.Provider value={setBotIsBacktesting}>
        {children}
      </UpdateBotIsBacktestingContext.Provider>
    </BotIsBacktestingContext.Provider>
  );
};
