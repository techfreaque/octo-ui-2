export const developmentBotDomain = "http://192.168.18.5:5003";
;
export const OctoBotVersion = "0.4.9";

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
  strategyDesignConfig: "/strategy_design/strategy_design_config"
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