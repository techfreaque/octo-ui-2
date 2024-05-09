import {
  useState,
  useContext,
  createContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  errorResponseCallBackParams,
  sendAndInterpretBotUpdate,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import createNotification from "../../components/Notifications/Notification";
import { backendRoutes } from "../../constants/backendConstants";
import {
  ApiActionsType,
  BotInfoType,
  useBotInfoContext,
} from "../data/BotInfoProvider";
import { useFetchPlotData } from "../data/BotPlottedElementsProvider";
import { useBotDomainContext } from "./BotDomainProvider";

export type SchemaValueRawType =
  | "string"
  | "array"
  | "object"
  | "boolean"
  | "number";

export type FlowEdgeConfigType = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};
// export type FlowNodeConfigType = {
//   [nodeKey: string]: {
//     [nodeSetting: string]: boolean | boolean[]|string|string[] |number|number[];
//   };
// };

// const t = {
//   config_ljh27onbqv6rp3pr0g: {
//     enable_plots_config_ljh27onbqv6rp3pr0g: false,
//     trigger_pairs_config_ljh27onbqv6rp3pr0g: ["BTC/USDT"],
//     trigger_time_frames_config_ljh27onbqv6rp3pr0g: [],
//   },
//   data: {
//     blockId: "candle_strategy",
//     color: "purple",
//     description:
//       "The candle based strategy can be used to trade based on candle closes",
//     nodeType: "StrategyBlock",
//     title: "Candle Based Strategy",
//     title_short: "Candle Strategy",
//   },
//   dragging: false,
//   height: 452,
//   id: "ljh27onbqv6rp3pr0g",
//   position: {
//     x: 688.291470530264,
//     y: 42.47334908334665,
//   },
//   positionAbsolute: {
//     x: 688.291470530264,
//     y: 42.47334908334665,
//   },
//   selected: true,
//   type: "StrategyBlockNode",
//   width: 500,
// };

export type TentaclesConfigValuesType = {
  [key: string]:
    | null
    | boolean
    | string
    | number
    | TentaclesConfigValuesType[]
    | FlowEdgeConfigType[]
    | TentaclesConfigValuesType
    | number[]
    | string[];
};

export type TentaclesConfigsSchemaType = {
  type: SchemaValueRawType;
  title: string;
  options?: {
    name: string;
    in_optimizer: boolean;
    in_summary: boolean;
    custom_path: string | null;
    grid_columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    collapsed?: boolean;
    disable_collapse?: boolean;
    color?: string;
    side?: "right" | "left";

    io_node_type?: "strategy_start_output" | "evaluator_signals_input";
    io_node_id?: number;
    direction?: "out" | "in";
    title?: string;
    is_connectable?: boolean;
  };
  properties?: {
    [key: string]: TentaclesConfigsSchemaType;
  };
  propertyOrder?: number;
  default?:
    | null
    | number[]
    | string[]
    | number
    | string
    | null
    | boolean
    | TentaclesConfigValuesType[]
    | TentaclesConfigValuesType;
  description?: string;
  format?: "select2" | "checkbox" | "select";
  enum?: string[] | number[];
  minItems?: number;
  minimum?: number;
  minLength?: number;
  uniqueItems?: boolean;
  multipleOf?: number;
  items?: {
    title?: string;
    type: "string" | "object";
    default?: number[] | string[] | boolean[];
    enum?: number[] | string[] | boolean[];
    properties?: {
      [key: string]: TentaclesConfigsSchemaType;
    };
  };
};
export type TentaclesConfigsRootType = {
  [key: string]: {
    title: string;
    tentacle: string;
    schema: TentaclesConfigsSchemaType;
    config: TentaclesConfigValuesType;
    tentacle_type: "evaluator" | "trading_mode";
    type: "input";
    is_hidden: boolean;
  };
};

export type TentaclesConfigsType = {
  [tentacleType in TentaclesConfigType]?: TentaclesConfigsRootType;
};

type TentaclesConfigType = "tradingTentacles" | "tentacles";

export const tentacleConfigTypes: {
  [key in TentaclesConfigType]: TentaclesConfigType;
} = {
  tradingTentacles: "tradingTentacles",
  tentacles: "tentacles",
};

const TentaclesConfigContext = createContext<TentaclesConfigsType | undefined>(
  undefined
);
const UpdateTentaclesConfigContext = createContext<
  Dispatch<SetStateAction<TentaclesConfigsType | undefined>>
>((_value) => {});

const IsSavingTentaclesConfigContext = createContext<boolean>(false);
const UpdateIsSavingTentaclesConfigContext = createContext<
  Dispatch<SetStateAction<boolean>>
>((_value) => {});

export const useIsSavingTentaclesConfigContext = () => {
  return useContext(IsSavingTentaclesConfigContext);
};
export const useUpdateIsSavingTentaclesConfigContext = () => {
  return useContext(UpdateIsSavingTentaclesConfigContext);
};
export const useTentaclesConfigContext = () => {
  return useContext(TentaclesConfigContext);
};
const useUpdateTentaclesConfigContext = () => {
  return useContext(UpdateTentaclesConfigContext);
};

export const useFetchTentaclesConfig = () => {
  const updateTentaclesConfig = useUpdateTentaclesConfigContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      tentacles: string[],
      successCallback?: (payload: successResponseCallBackParams) => void,
      isTradingTentacle: boolean = false
    ) => {
      function errorCallback({
        updatedData,
        updateUrl,
        data,
        response,
      }: errorResponseCallBackParams) {
        createNotification({
          title: "Failed to fetch tentacles config",
          type: "danger",
          message: data?.message,
        });
      }
      function _successCallback({
        updatedData,
        updateUrl,
        data,
        response,
      }: successResponseCallBackParams) {
        if (data?.success) {
          updateTentaclesConfig((prevConfig) => {
            const newConfig: TentaclesConfigsType = {
              ...prevConfig,
            };
            if (isTradingTentacle) {
              newConfig[tentacleConfigTypes.tradingTentacles] = data?.data;
            } else {
              const prevTentacles =
                newConfig[tentacleConfigTypes.tentacles] || {};
              newConfig[tentacleConfigTypes.tentacles] = {
                ...prevTentacles,
                ...data?.data,
              };
            }
            return newConfig;
          });
          successCallback?.({
            updatedData,
            updateUrl,
            data,
            response,
          });
        } else {
          errorCallback({
            updatedData,
            updateUrl,
            data,
            response,
          });
        }
      }
      sendAndInterpretBotUpdate({
        updatedData: {
          tentacles,
        },
        updateUrl: botDomain + backendRoutes.fetchTentaclesConfig,
        successCallback: _successCallback,
        errorCallback,
      });
    },
    [botDomain, updateTentaclesConfig]
  );
};

export function getEnabledTradingTentaclesList(
  botInfo: BotInfoType | undefined
): string[] {
  const tentacles: string[] = [];
  botInfo?.strategy_names && tentacles.push(...botInfo.strategy_names);
  botInfo?.evaluator_names && tentacles.push(...botInfo.evaluator_names);
  botInfo?.trading_mode_name && tentacles.push(botInfo.trading_mode_name);
  return Array.from(new Set(tentacles));
}

export const useFetchCurrentTradingTentaclesConfig = () => {
  const loadTentaclesConfig = useFetchTentaclesConfig();
  const botInfo = useBotInfoContext();
  return useCallback(
    (successCallback?: (payload: successResponseCallBackParams) => void) => {
      const tentacles = getEnabledTradingTentaclesList(botInfo);
      loadTentaclesConfig(tentacles, successCallback, true);
    },
    [botInfo, loadTentaclesConfig]
  );
};

export type SaveTentaclesConfigType = (
  newConfigs: TentaclesConfigsType,
  setIsSaving?: Dispatch<SetStateAction<boolean>> | undefined,
  reloadPlots?: boolean,
  isTradingConfig?: boolean,
  keepExisting?: boolean,
  successNotification?: boolean
) => void;

export const useSaveTentaclesConfig: () => SaveTentaclesConfigType = () => {
  const fetchPlotData = useFetchPlotData();
  const loadCurrentTradingTentaclesConfig = useFetchCurrentTradingTentaclesConfig();
  const loadTentaclesConfig = useFetchTentaclesConfig();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      newConfigs: TentaclesConfigsType,
      setIsSaving?: Dispatch<SetStateAction<boolean>>,
      reloadPlots: boolean = false,
      isTradingConfig: boolean = true,
      keepExisting: boolean = true,
      successNotification: boolean = true
    ) => {
      function errorCallback(payload: errorResponseCallBackParams) {
        setIsSaving?.(false);
        createNotification({ title: payload.data });
      }
      function onFinish(payload: successResponseCallBackParams) {
        setIsSaving?.(false);
        if (successNotification) {
          createNotification({ title: "Successfully save tentacles config" });
        }
        if (reloadPlots) {
          fetchPlotData();
        }
      }
      function successCallback(payload: successResponseCallBackParams) {
        if (isTradingConfig) {
          loadCurrentTradingTentaclesConfig(onFinish);
        } else {
          const tentacles = Object.keys(newConfigs);
          loadTentaclesConfig(tentacles, onFinish);
        }
      }
      sendAndInterpretBotUpdate({
        updatedData: newConfigs,
        updateUrl:
          botDomain +
          (isTradingConfig
            ? `${
                reloadPlots
                  ? backendRoutes.updateTentaclesConfigAndReRun
                  : backendRoutes.updateTentaclesConfig
              }&keep_existing=${keepExisting}`
            : backendRoutes.updateTentaclesConfigNoReload),
        successCallback,
        errorCallback,
      });
    },
    [
      botDomain,
      fetchPlotData,
      loadCurrentTradingTentaclesConfig,
      loadTentaclesConfig,
    ]
  );
};

export const useSaveTentaclesConfigAndSendAction = () => {
  const fetchPlotData = useFetchPlotData();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      newConfigs,
      actionType: ApiActionsType,
      setIsLoading: Dispatch<SetStateAction<boolean>>,
      reloadPlots: boolean = false,
      successCallback?: (payload: successResponseCallBackParams) => void,
      errorCallback?: (payload: errorResponseCallBackParams) => void
    ) => {
      function _errorCallback(payload: errorResponseCallBackParams) {
        setIsLoading(false);
        createNotification({
          title: "Failed to executed trading mode",
          type: "danger",
        });
      }
      function _successCallback(payload: successResponseCallBackParams) {
        if (reloadPlots) {
          fetchPlotData();
        }
        setIsLoading(false);
        createNotification({ title: "Successfully executed trading mode" });
      }
      sendAndInterpretBotUpdate({
        updatedData: newConfigs,
        updateUrl: `${
          botDomain + backendRoutes.updateTentaclesConfigAndSendCommand
        }/${actionType}`,
        successCallback: successCallback || _successCallback,
        errorCallback: errorCallback || _errorCallback,
      });
    },
    [fetchPlotData, botDomain]
  );
};

export const TentaclesConfigProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [tentaclesConfig, setTentaclesConfig] = useState<
    TentaclesConfigsType | undefined
  >(undefined);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  return (
    <TentaclesConfigContext.Provider value={tentaclesConfig}>
      <UpdateTentaclesConfigContext.Provider value={setTentaclesConfig}>
        <IsSavingTentaclesConfigContext.Provider value={isSaving}>
          <UpdateIsSavingTentaclesConfigContext.Provider value={setIsSaving}>
            {children}
          </UpdateIsSavingTentaclesConfigContext.Provider>
        </IsSavingTentaclesConfigContext.Provider>
      </UpdateTentaclesConfigContext.Provider>
    </TentaclesConfigContext.Provider>
  );
};
