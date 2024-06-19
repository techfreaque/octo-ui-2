import type { Dispatch, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchUIConfig, saveUIConfig } from "../../api/configs";
import type {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../api/fetchAndStoreFromBot";
import type {
  BACKTESTING_RUN_SETTINGS_KEY,
  botLayoutKey,
  CanldesPlotSourceType,
  CURRENT_LIVE_ID_KEY,
  DISPLAY_SETTINGS_KEY,
  GRAPHS_KEY,
  OPTIMIZER_CAMPAIGN_KEY,
  OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY,
  OPTIMIZER_RUN_SETTINGS_KEY,
} from "../../constants/backendConstants";
import { emptyValueFunction } from "../../helpers/helpers";
import type { flowEditorSettingsName } from "../../widgets/AppWidgets/Configuration/UIConfig";
import { useBotInfoContext } from "../data/BotInfoProvider";
import { useBotDomainContext } from "./BotDomainProvider";
import type { UiLayoutPageType } from "./BotLayoutProvider";

export interface BotLayoutType {
  layouts: UiLayoutPageType[];
  isCustom: boolean;
}

export type UiConfigKeyType =
  | "backtesting_run_settings"
  | "optimizer_campaigns_to_load"
  | "optimizer_run_settings"
  | "optimization_campaign"
  | "flow_editor_settings"
  | "display_settings";

export type UiSubConfigsType =
  | OptimizerUiConfig
  | OptimizerCampaignsToLoadUiConfig
  | BacktestingUiConfig
  | FlowSettingsUiConfig
  | DisplaySettingsUiConfig
  | undefined;

export interface OptimizerUiConfig {
  data_files?: string[];
  end_timestamp?: number | null;
  exchange_names?: string[];
  exchange_type?: "use_current_profile";
  idle_cores?: number;
  notify_when_complete?: boolean;
  optimizer_id?: number;
  queue_size?: number;
  start_timestamp?: number | null;
}
export type OptimizerCampaignsToLoadUiConfig = {
  [campaignName: string]: boolean;
};
export interface BacktestingUiConfig {
  data_sources?: string[];
  end_timestamp?: number | null;
  exchange_names?: string[];
  exchange_type?: "use_current_profile";
  start_timestamp?: number | null;
}
export interface FlowSettingsUiConfig {
  auto_save?: boolean;
}
export interface DisplaySettingsUiConfig {
  [GRAPHS_KEY]?: {
    display_use_log_scale?: boolean;
    display_unified_tooltip?: boolean;
    max_candles_before_line_display?: number;
    max_candles_line_sources?: CanldesPlotSourceType[];
  };
}

export interface UiConfigType {
  [botLayoutKey]?: BotLayoutType | undefined;
  [OPTIMIZER_RUN_SETTINGS_KEY]?: OptimizerUiConfig;
  [BACKTESTING_RUN_SETTINGS_KEY]?: BacktestingUiConfig;
  [OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY]?: OptimizerCampaignsToLoadUiConfig;
  [CURRENT_LIVE_ID_KEY]?: number;
  [DISPLAY_SETTINGS_KEY]?: DisplaySettingsUiConfig;
  [OPTIMIZER_CAMPAIGN_KEY]?: {
    name?: string;
  };
  [flowEditorSettingsName]?: FlowSettingsUiConfig;
}

const UiConfigContext = createContext<UiConfigType>({});
const UpdateUiConfigContext =
  createContext<Dispatch<SetStateAction<UiConfigType>>>(emptyValueFunction);

export const useUiConfigContext = () => {
  return useContext(UiConfigContext);
};

export const useUpdateUiConfigContext = () => {
  return useContext(UpdateUiConfigContext);
};

export const useFetchUiConfig = () => {
  const setUiConfig = useUpdateUiConfigContext();
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const exchangeNames =
    botInfo?.ids_by_exchange_name && Object.keys(botInfo.ids_by_exchange_name);
  return useCallback(() => {
    fetchUIConfig(botDomain, setUiConfig, exchangeNames);
  }, [setUiConfig, botDomain, exchangeNames]);
};

export const useSaveUiConfig = () => {
  const setUiConfig = useUpdateUiConfigContext();
  const botDomain = useBotDomainContext();
  return useCallback(
    (
      newConfig: UiConfigType,
      successCallback:
        | ((payload: successResponseCallBackParams) => void)
        | undefined,
      errorCallback: (payload: errorResponseCallBackParams) => void,
      overwriteConfig = false,
    ) => {
      setUiConfig((prevConfig) => {
        const _newConfig: UiConfigType = {
          ...(overwriteConfig ? {} : prevConfig),
          ...newConfig,
        };
        saveUIConfig({
          botDomain,
          newConfig: _newConfig,
          successCallback,
          errorCallback,
        });
        return _newConfig;
      });
    },
    [setUiConfig, botDomain],
  );
};

export const UiConfigProvider = ({ children }: { children: JSX.Element }) => {
  const [uiConfig, setUiConfig] = useState<UiConfigType>({});
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const exchangeNamesStr = JSON.stringify(
    botInfo?.ids_by_exchange_name && Object.keys(botInfo.ids_by_exchange_name),
  );
  useEffect(() => {
    if (exchangeNamesStr) {
      const exchangeNames = JSON.parse(exchangeNamesStr);
      fetchUIConfig(botDomain, setUiConfig, exchangeNames);
    }
  }, [botDomain, exchangeNamesStr]);
  return (
    <UiConfigContext.Provider value={uiConfig}>
      <UpdateUiConfigContext.Provider value={setUiConfig}>
        {children}
      </UpdateUiConfigContext.Provider>
    </UiConfigContext.Provider>
  );
};
