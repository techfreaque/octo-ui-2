import React, {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import { startBacktesting, stopBacktesting } from "../../api/actions";
import { BACKTESTING_RUN_SETTINGS_KEY, CURRENT_BOT_DATA } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useUiConfigContext } from "../config/UiConfigProvider";
import { AbstractWebsocketContext } from "../websockets/AbstractWebsocketContext";
import createNotification from "../../components/Notifications/Notification";

const BotIsBacktestingContext = createContext();
const UpdateBotIsBacktestingContext = createContext();
const BacktestingProgressContext = createContext();

export const useBotIsBacktestingContext = () => {
  return useContext(BotIsBacktestingContext);
};

export const useUpdateBotIsBacktestingContext = () => {
  return useContext(UpdateBotIsBacktestingContext);
};

export const useBacktestingProgressContext = () => {
  return useContext(BacktestingProgressContext);
};

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
  const defaultExchangeName = botInfo?.exchange_name
  const ids_by_exchange_name = botInfo?.ids_by_exchange_name
  const logic = useCallback(() => {
    if (backtestingSettings && ids_by_exchange_name) {
      const _backtestingSettings = {
        data_sources: [CURRENT_BOT_DATA],
        ...backtestingSettings,
        exchange_ids: backtestingSettings.exchange_names
          ? backtestingSettings.exchange_names.map(exchangeName => (
            ids_by_exchange_name[exchangeName])
          )
          : Object.values(ids_by_exchange_name).map(exchangeId => exchangeId),

        // TODO remove when stock supports ids sources
        data_source: backtestingSettings.data_sources
          ? backtestingSettings.data_sources[0]
          : CURRENT_BOT_DATA,
        exchange_id: ids_by_exchange_name[
          backtestingSettings.exchange_names
            ? backtestingSettings.exchange_names[0]
            : defaultExchangeName
        ],
      }
      startBacktesting(botDomain, _backtestingSettings, setBotIsBacktesting)
    }
  }, [
    setBotIsBacktesting, botDomain,
    backtestingSettings, ids_by_exchange_name, defaultExchangeName
  ]);
  return logic;
};

export const BotBacktestingProvider = ({ children }) => {
  const [botIsBacktesting, setBotIsBacktesting] = useState(false);
  const [backtestingProgress, setBacktestingProgress] = useState(0);
  const botDomain = useBotDomainContext();
  const socketUrl = botDomain + "/backtesting"

  function onConnectionUpdate(data, socket) {
    if (data) {
      setBacktestingProgress(data)
    }
    if (data?.status === "starting" || data?.status === "computing") {
      setBotIsBacktesting(true);
      setTimeout(function () { socket.emit('backtesting_status') }, 50);
    } else {
      setBotIsBacktesting(prevState => {
        if (data?.status === "finished" && prevState) {
          createNotification("Backtest finished successfully")
        }
        return false
      });
    }
  }
  function onConnectionLost() {
    setBotIsBacktesting(false)
  }

  return (
    <BotIsBacktestingContext.Provider value={botIsBacktesting}>
      <UpdateBotIsBacktestingContext.Provider value={setBotIsBacktesting}>
        <BacktestingProgressContext.Provider value={backtestingProgress}>
          <AbstractWebsocketContext
            socketUrl={socketUrl}
            onConnectionUpdate={onConnectionUpdate}
            onConnectionLost={onConnectionLost} onKey={"backtesting_status"}>
            {children}
          </AbstractWebsocketContext>
        </BacktestingProgressContext.Provider>
      </UpdateBotIsBacktestingContext.Provider>
    </BotIsBacktestingContext.Provider>
  );
};
