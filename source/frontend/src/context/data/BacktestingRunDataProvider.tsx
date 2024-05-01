import {
  useState,
  useContext,
  createContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchBacktestingRunData } from "../../api/data";
import { sendAndInterpretBotUpdate } from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { useBotDomainContext } from "../config/BotDomainProvider";
import {
  useUiConfigContext,
  useUpdateUiConfigContext,
} from "../config/UiConfigProvider";
import { TentaclesConfigsType } from "../config/TentaclesConfigProvider";

export interface BacktestingRunData {
  id: number;
  "optimization campaign": string;
  "user inputs": TentaclesConfigsType;
  timestamp: number;
  name: null;
  leverage: number;
  trading_type: string;
  ref_market: string;
  duration: number;
  "backtesting files": string[];
  gains: number;
  "% gains": number;
  "markets profitability": {
    "BTC/USDT": string;
  };
  "end portfolio": string;
  "start portfolio": string;
  "% win rate": number;
  "% draw down": number;
  "R\\u00b2 max balance": number;
  "R\\u00b2 end balance": number;
  symbols: string[];
  "time frames": string[];
  entries: number;
  wins: number;
  loses: number;
  trades: number;
  exchanges: string[];
  start_time: number;
  end_time: number;
  future_contracts: {};
  "optimizer id": number;
}
export interface BacktestingRunsData {
  data: BacktestingRunData[];
  campaigns: {
    [campaignName: string]: boolean;
  };
}

const BacktestingRunDataContext = createContext<
  BacktestingRunsData | undefined
>(undefined);
const UpdateBacktestingRunDataContext = createContext<
  Dispatch<SetStateAction<BacktestingRunsData | undefined>>
>((_) => {});

export const useBacktestingRunDataContext = () => {
  return useContext(BacktestingRunDataContext);
};

export const useUpdateBacktestingRunDataContext = () => {
  return useContext(UpdateBacktestingRunDataContext);
};

export const useFetchBacktestingRunData = () => {
  const setBacktestingRunData = useUpdateBacktestingRunDataContext();
  const botDomain = useBotDomainContext();
  const uiConfig = useUiConfigContext();
  const setUiConfig = useUpdateUiConfigContext();
  return useCallback(() => {
    if (uiConfig?.optimization_campaign)
      fetchBacktestingRunData(
        setBacktestingRunData,
        setUiConfig,
        botDomain,
        false,
        {
          ...uiConfig.optimizer_campaigns_to_load,
        }
      );
  }, [setBacktestingRunData, botDomain, uiConfig, setUiConfig]);
};

export const useDeleteBacktestingRunData = () => {
  const botDomain = useBotDomainContext();
  const reloadData = useFetchBacktestingRunData();
  return useCallback(
    (runsToDelete) => {
      const data = {
        runs: runsToDelete,
      };
      const successCallback = () => {
        reloadData();
        createNotification({ title: "Runs successfully deleted" });
      };
      sendAndInterpretBotUpdate({
        updatedData: data,
        updateUrl: botDomain + backendRoutes.deleteRunData,
        successCallback,
      });
    },
    [botDomain, reloadData]
  );
};

export const BacktestingRunDataProvider = ({ children }) => {
  const [backtestingRunData, setBacktestingRunData] = useState<
    BacktestingRunsData
  >();
  return (
    <BacktestingRunDataContext.Provider value={backtestingRunData}>
      <UpdateBacktestingRunDataContext.Provider value={setBacktestingRunData}>
        {children}
      </UpdateBacktestingRunDataContext.Provider>
    </BacktestingRunDataContext.Provider>
  );
};
