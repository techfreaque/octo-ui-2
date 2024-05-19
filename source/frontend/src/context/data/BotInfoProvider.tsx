import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchBotInfo } from "../../api/data";
import { useBotDomainContext } from "../config/BotDomainProvider";
import { useUpdateVisibleTimeFramesContext } from "../config/VisibleTimeFrameProvider";
import { useUpdateVisiblePairsContext } from "../config/VisiblePairProvider";
import {
  useUpdateVisibleExchangesContext,
  useVisibleExchangesContext,
} from "../config/VisibleExchangesProvider";
import { useIsBotOnlineContext } from "./IsBotOnlineProvider";
import {
  BotExchangeInfoProvider,
  ConfigSymbolsType,
} from "./BotExchangeInfoProvider";
import { RealTimeStrategyCommandsType } from "../../widgets/AppWidgets/Buttons/ToggleActivateRealTimeStrategy";
import { BlockInfoType } from "../../widgets/AppWidgets/Configuration/StrategyFlowBuilder/BuildingBlocksSideBar";
import { ClearOlottingCacheType } from "../../widgets/AppWidgets/ResetConfigs/ResetConfigs";

const ProjectInfoOpenContext = createContext<boolean>(false);
const UpdateProjectInfoOpenContext = createContext<
  Dispatch<SetStateAction<boolean>>
>((_value) => {});

export const useProjectInfoOpenContext = () => {
  return useContext(ProjectInfoOpenContext);
};

export const useUpdateProjectInfoOpenContext = () => {
  return useContext(UpdateProjectInfoOpenContext);
};

export type ApiActionsType =
  | "execute"
  | RealTimeStrategyCommandsType
  | ClearOlottingCacheType;

export type ProfileType = {
  profile: {
    id: string;
    avatar: string;
    name: string;
    description: string;
    read_only?: boolean;
  };
  config: {
    "crypto-currencies": ConfigSymbolsType;
    "trader-simulator": {
      "starting-portfolio": {
        [currency: string]: number;
      };
      enabled: boolean;
      fees: {
        maker: number;
        taker: number;
      };
    };
    trading: {
      "reference-market": string;
    };
    trader: {
      enabled: boolean;
      "load-trade-history": boolean;
    };
  };
};

export type ProfileRootPathType =
  | "crypto-currencies"
  | "trader-simulator"
  | "trading"
  | "trader";

export type BotInfoType = {
  octobot_project: string;
  octobot_version: string;
  strategy_names: string[];
  evaluator_names: string[];
  strategy_name: string;
  trading_mode_name: string;
  time_frames: string[];
  trigger_time_frames: string[];
  traded_time_frames: string[];
  is_owner: boolean;
  can_logout: boolean;
  symbols: string[];
  exchange_names: string[];
  exchange_name: string;
  current_profile: ProfileType;
  profiles?: {
    [profileName: string]: ProfileType;
  };
  optimization_campaign: string;
  live_id: number;
  data_files: DataFilesType;
  installed_blocks_info?: BlockInfoType;
  exchange_id?: string;
  available_api_actions: ApiActionsType;
  ids_by_exchange_name: IdsByExchangeType;
  ui_pro_installed?: boolean;
  any_neural_net_active?: boolean;
  should_stop_training?: boolean;
  real_time_strategies_active?: boolean;
};

export type DataFilesType = [
  string,
  {
    candles_length: number;
    date: string;
    end_date: string;
    end_timestamp: number;
    exchange: string;
    start_date: string;
    start_timestamp: number;
    symbols: string[];
    time_frames: string[];
    timestamp: number;
    type: string;
  }
][];

export type IdsByExchangeType = { [exchange: string]: string };

const BotInfoContext = createContext<BotInfoType | undefined>(undefined);
const UpdateBotInfoContext = createContext<
  Dispatch<SetStateAction<BotInfoType | undefined>>
>((_value) => {});
export const useBotInfoContext = () => {
  return useContext(BotInfoContext);
};

export const useUpdateBotInfoContext = () => {
  return useContext(UpdateBotInfoContext);
};

export function useCurrentProfile() {
  const botInfo = useBotInfoContext();
  return botInfo?.current_profile;
}

export const useFetchBotInfo = () => {
  const setBotInfo = useUpdateBotInfoContext();
  const botDomain = useBotDomainContext();
  const visibleExchanges = useVisibleExchangesContext();
  const logic = useCallback(
    (
      successNotification = false,
      setIsFinished?: Dispatch<SetStateAction<boolean>>
    ) => {
      setIsFinished && setIsFinished(false);
      fetchBotInfo(
        botDomain,
        setBotInfo,
        visibleExchanges,
        successNotification,
        setIsFinished
      );
    },
    [setBotInfo, botDomain, visibleExchanges]
  );
  return logic;
};

export const useIsDemoMode = () => {
  const botInfo = useBotInfoContext();
  return useMemo(() => {
    const isDemo = botInfo?.is_owner === false;
    return isDemo;
  }, [botInfo?.is_owner]);
};

export const BotInfoProvider = ({ children }: { children: JSX.Element }) => {
  const [botInfo, setBotInfo] = useState<BotInfoType | undefined>(undefined);
  const [projectInfoOpen, setProjectInfoOpen] = useState<boolean>(false);
  const botDomain = useBotDomainContext();
  const isBotOnline = useIsBotOnlineContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();
  const setVisiblePairs = useUpdateVisiblePairsContext();
  const setVisibleExchanges = useUpdateVisibleExchangesContext();
  useEffect(() => {
    if (isBotOnline) {
      fetchBotInfo(botDomain, setBotInfo);
    }
  }, [botDomain, isBotOnline]);
  useEffect(() => {
    if (botInfo?.trigger_time_frames || botInfo?.traded_time_frames) {
      if (botInfo.is_owner === false) {
        setProjectInfoOpen(true);
      }
      setVisibleTimeframes((prevTimeframes) => {
        const availableTimeframes =
          (botInfo?.trigger_time_frames?.length &&
            botInfo?.trigger_time_frames) ||
          botInfo?.traded_time_frames;
        if (prevTimeframes && availableTimeframes?.includes(prevTimeframes)) {
          return prevTimeframes;
        }
        return availableTimeframes?.[0];
      });
      setVisiblePairs((prevPairs) => {
        if (prevPairs && botInfo?.symbols?.includes(prevPairs)) {
          return prevPairs;
        }
        return botInfo?.symbols?.[0];
      });
      setVisibleExchanges((prevExchange) => {
        if (prevExchange && botInfo?.exchange_names?.includes(prevExchange)) {
          return prevExchange;
        }
        return botInfo?.exchange_name;
      });
    }
  }, [botInfo, setVisibleTimeframes, setVisiblePairs, setVisibleExchanges]);

  return (
    <BotInfoContext.Provider value={botInfo}>
      <UpdateBotInfoContext.Provider value={setBotInfo}>
        <ProjectInfoOpenContext.Provider value={projectInfoOpen}>
          <UpdateProjectInfoOpenContext.Provider value={setProjectInfoOpen}>
            <BotExchangeInfoProvider>{children}</BotExchangeInfoProvider>
          </UpdateProjectInfoOpenContext.Provider>
        </ProjectInfoOpenContext.Provider>
      </UpdateBotInfoContext.Provider>
    </BotInfoContext.Provider>
  );
};
