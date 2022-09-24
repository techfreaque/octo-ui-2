export const developmentBotDomain = "http://localhost:5003";
;
export const basePath = "/octo_ui2";

export const backendRoutes = {
  frontendEntry: basePath + "/home",
  botInfo: basePath + "/bot-info",
  botConfig: basePath + "/bot-config",
  plottedData: basePath + "/plotted_data",
  botPortfolio: basePath + "/portfolio",
  appStore: basePath + "/app-store",
  installApp: "/advanced/tentacle_packages",
  updateTentaclesConfig: "/config_tentacles",
  strategyDesignRunData: "/strategy_design/run_data",
  strategyDesignConfig: "/strategy_design/strategy_design_config",
  backtesting: "/backtesting",
  backtestingStart: "/backtesting?action_type=start_backtesting_with_current_bot_data&source=strategy_design&reset_tentacle_config=False&auto_stop=True",
  backtestingStop: "/backtesting?action_type=stop_backtesting",
}

export let hiddenBacktestingMetadataColumns = []; // should be null
export const displayedRunIds = [];
export const ID_SEPARATOR = "_";
export const TENTACLE_SEPARATOR = "###";
export const MAX_SEARCH_LABEL_SIZE = 32;
export const TIMESTAMP_DATA = ["timestamp", "start time", "end time"];
export const ID_DATA = ["id", "backtesting id", "optimizer id"];
export const METADATA_HIDDEN_FIELDS = ["backtesting files", "user inputs"]
export const METADATA_UNDISPLAYED_FIELDS = ["children"]
export const CUSTOM_USER_INPUT_PATH_SEPARATOR = "/"

export const hidden_class = "d-none"

export const CURRENT_BOT_DATA = "current_bot_data"
export const OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY = "optimizer_campaigns_to_load";
export const OPTIMIZER_RUN_SETTINGS_KEY = "optimizer_run_settings";
export const OPTIMIZER_CAMPAIGN_KEY = "optimization_campaign";
export const OPTIMIZER_INPUTS_KEY = "optimizer_inputs";
export const CURRENT_LIVE_ID_KEY = "current-live-id";
export const BACKTESTING_RUN_SETTINGS_KEY = "backtesting_run_settings";
export const DISPLAY_SETTINGS_KEY = "display_settings"
export const DISPLAYED_ELEMENTS_KEY = "displayed_elements"
export const GRAPHS_KEY = "graphs"