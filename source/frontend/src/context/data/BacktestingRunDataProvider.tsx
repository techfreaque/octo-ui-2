import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

import { fetchBacktestingRunData } from "../../api/data";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { TentaclesConfigValuesType } from "../config/TentaclesConfigProvider";
import {
  useUiConfigContext,
  useUpdateUiConfigContext,
} from "../config/UiConfigProvider";
import { useUpdateDisplayedRunIdsContext } from "./BotPlottedElementsProvider";

export interface BacktestingRunDataWithoutID {
  "optimization campaign": string;
  "user inputs": TentaclesConfigValuesType;
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
  future_contracts: {
    [exchangeName: string]: {
      [symbol: string]: {
        contract_type: "linear_perpetual";
        margin_type: "isolated";
        position_mode: "one_way_mode";
      };
    };
  };
  "optimizer id": number;
}

export type BacktestingRunData = BacktestingRunDataWithoutID & {
  id: number;
};
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
>(emptyValueFunction);

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
  return useCallback(
    (onDone?: () => void) => {
      if (uiConfig?.optimization_campaign) {
        fetchBacktestingRunData(
          setBacktestingRunData,
          setUiConfig,
          botDomain,
          false,
          {
            ...uiConfig.optimizer_campaigns_to_load,
          },
          onDone
        );
      }
    },
    [setBacktestingRunData, botDomain, uiConfig, setUiConfig]
  );
};

export type RunsToDeleteDataType = {
  backtesting_id: number;
  optimizer_id: number;
  campaign_name: string;
}[];

export const useDeleteBacktestingRunData = () => {
  const botDomain = useBotDomainContext();
  const reloadData = useFetchBacktestingRunData();
  const setDisplayedRunIds = useUpdateDisplayedRunIdsContext();
  return useCallback(
    (
      runsToDelete: RunsToDeleteDataType,
      isDeleting: Dispatch<SetStateAction<boolean>>,
      onSuccess?: () => void
    ) => {
      isDeleting(true);
      const data = {
        runs: runsToDelete,
      };
      const successCallback = () => {
        reloadData();
        createNotification({ title: "Runs successfully deleted" });
        setDisplayedRunIds((prevState) => ({
          ...prevState,
          backtesting: [],
        }));
        isDeleting(false);
        onSuccess?.();
      };
      const errorCallback = (payload: errorResponseCallBackParams) => {
        reloadData();
        createNotification({
          title: "Failed to delete selcted runs",
          message: `Error: ${payload.data}`,
          type: "danger",
        });
        isDeleting(false);
      };
      sendAndInterpretBotUpdate({
        updatedData: data,
        updateUrl: botDomain + backendRoutes.deleteRunData,
        successCallback,
        errorCallback,
      });
    },
    [botDomain, reloadData, setDisplayedRunIds]
  );
};

export const BacktestingRunDataProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
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
